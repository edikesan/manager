<?php

namespace App\Http\Controllers;

use App\role_user;
use Illuminate\Http\Request;
use App\Role;
use App\User;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthenticateController extends Controller
{

    private $timestep           = '30';         // seconds
    private $timewindow         = '2';          // 2 steps either way
    private $tokenlength        = '6';          // characters
    private $tokenceiling       = '1000000';    // 10**TOKENLENGTH
    // IPadressen ohne 2 Faktor Authentifizierung
    // Secret key...  Must be retained on the server in plain text.
    private $ips_without_2fa    = array(
                                        "193.158.97.78",    //Rheingas
                                        "193.158.97.85",    //Rheingas
                                        "156.67.233.106"    //Rheingas Website Testserver
                                        );

    //SecretKey Must be [A-Z][2-7]

    public function authenticate(Request $request)
    {
	    $permissions=array();
        $credentials = $request->only('email', 'password');

        if(!in_array($_SERVER['REMOTE_ADDR'], $this->ips_without_2fa)){
        $user = DB::table('users')->where('email', '=', $credentials['email'])->first();

            /* mbode 30.03.2017 Sequrity Token auskommentieren
            if($user->secret_key != "") {
                $sec_key = $request->only('sec_key');
                $sec_key_bool = $this->TestKey($user->secret_key, $sec_key['sec_key']);
            }else{
                //Ohne 2 Faktor Secret Key, kein Login erlauben.
                $sec_key_bool = false;
            }*/

            $sec_key_bool = true;

        }else{
            //IPadresse vertrauenswürdig, keine 2 Faktor Authentifizierung notwendig.
            $sec_key_bool = true;
        }

        try {
            // verify the credentials and create a token for the user
            if (!$sec_key_bool OR (!$token = JWTAuth::attempt($credentials))) {
                return response()->json(['error' => 'Invalid Credentials'], 401);
            }
        } catch (JWTException $e) {
            // something went wrong
            return response()->json(['error' => 'could_not_create_token'], 500);
        }

        session_start();
        $_SESSION['auth'] = 1;
        $_SESSION['user_id'] = Auth::user()->id;

        $role = DB::table('role_user')->where('user_id',Auth::user()->id)->first();
        $user=Auth::user();
        $user->role_id=$role->role_id;
        $role = Role::find($role->role_id);
        $temp=$role->perms()->get()->lists('name');
        foreach($temp as $value){
            $permissions[]=$value;
         }
        $user->permissions=$permissions;
        return response()->json(compact('token','user'));
 
    }


    private function TimeStamp() {

        return floor(microtime(true)/$this->timestep);
    }


    private function B32toB($inarg) {

        $inarg  = strtoupper($inarg);
        if (!preg_match('/^[A-Z2-7]+$/', $inarg))
            throw new Exception('Invalid characters in the base32 string.');
        $n = $j = 0;
        $result = "";
        for ($i=0; $i<strlen($inarg); $i++) {
            $n = $n << 5;           // Each character gets 5 bits
            $c = ord($inarg[$i]);
            $c -= ($c>64) ? 65 : 24;  // A-Z or 2-7
            $n += $c;
            $j += 5;
            if ($j > 7) {
                $j -= 8;
                $result .= chr(($n & (0xFF << $j)) >> $j);
            }
        }
        return $result;
    }


    // HMAC-Based One-Time Password Algorithm from RFC 4226
    private function MakeOTP($secretKey, $timeval) {
        if (strlen($secretKey) < 8)
            throw new Exception('Secret key must contain at least 16 base 32 characters');
        $bTimeval = pack('N*', 0) . pack('N*', $timeval);    // Timeval must be 64-bit int
        $hash = hash_hmac ('sha1', $bTimeval, $secretKey, true);
        $offset = ord($hash[19]) & 0xf;
        $token =
            ((ord($hash[$offset+0]) & 0x7f) << 24 ) |
            ((ord($hash[$offset+1]) & 0xff) << 16 ) |
            ((ord($hash[$offset+2]) & 0xff) << 8 ) |
            ( ord($hash[$offset+3]) & 0xff) ;
        while($token>$this->tokenceiling) $token -= $this->tokenceiling;
        return str_pad($token, $this->tokenlength, '0', STR_PAD_LEFT);
    }


    private function TestKey($secretKey, $testkey) {
        $tStamp = $this->TimeStamp();
        $bSecretKey = $this->B32toB($secretKey);
        for ($ts=-$this->timewindow; $ts<=$this->timewindow; $ts++)
            if ($this->MakeOTP($bSecretKey, $tStamp+$ts) == $testkey) return true;
        return false;
    }

}
