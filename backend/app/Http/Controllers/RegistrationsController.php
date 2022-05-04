<?php

namespace App\Http\Controllers;

use App\VikRegistration;
use http\QueryString;
use Illuminate\Http\Request;

use App\Http\Requests;
use Validator;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use DB;

class RegistrationsController extends Controller
{
    public function __construct()
    {
        // Apply the jwt.auth middleware to all methods in this controller
        // except for the authenticate method. We don't want to prevent
        // the user from retrieving their token if they don't already have it
        $this->middleware('jwt.auth', ['except' => ['authenticate']]);
    }



    public function index()
    {
        $next_training = DB::select(DB::raw("SELECT pref_value FROM vik_preferences WHERE pref = 'NEXT_TRAINING'"));
//        print_r($next_training[0]->pref_value);
        $registrations = DB::select(DB::raw("SELECT r.guest_id, u.player_number, u.player_firstname, u.player_name, r.registration_datetime, r.cancelation_datetime, u.player_position ".
            "FROM vik_schedules s ".
            "JOIN vik_registrations r on s.game_id = r.game_id ".
            "JOIN users u on u.guest_id = r.guest_id ".
            "WHERE s.game_date = '".$next_training[0]->pref_value."' ".
            "  AND r.cancelation_datetime IS NULL ".
            "ORDER BY u.player_firstname, u.player_name"));
/*        $registrations = DB::table('users')
            ->join('vik_registrations','vik_registrations.guest_id','=','users.guest_id')
            ->join('vik_schedules','vik_schedules.game_id','=','vik_registrations.game_id')
            ->where('vik_schedules.game_date',$next_training[0]->pref_value);
/*        $registrations = DB::select(DB::raw("SELECT u.player_number, u.player_firstname, u.player_name, r.registration_datetime ".
                                             "FROM vik_schedules s ".
                                             "JOIN vik_registrations r on s.game_id = r.game_id".
                                             "JOIN users u on u.guest_id = r.guest_id ".
                                             "WHERE s.game_date = '".$next_training['pref_value']."'"));*/
        return $registrations;
    }


    public function getUnregistredUsers()
    {
//        $all_users = DB::select(DB::raw("SELECT u.guest_id, u.player_name, u.player_firstname FROM users u WHERE player_status = 'A' "));
        $user_registred = DB::select(DB::raw("SELECT a.guest_id, a.player_name, a.player_firstname ".
                                             "  FROM ( SELECT u.guest_id, u.player_name, u.player_firstname FROM users u WHERE player_status = 'A' )a  ".
                                             "   LEFT JOIN (  ".
                                             "       SELECT u.guest_id ".
                                             "         FROM vik_registrations r ".
                                             "         JOIN vik_schedules s ON s.game_id = r.game_id ".
                                             "         JOIN users u ON u.guest_id = r.guest_id ".
                                             "         JOIN vik_preferences p ON p.pref_value = s.game_date ) r ".
                                             "   ON     a.guest_id = r.guest_id ".
                                             "  WHERE r.guest_id IS NULL".
                                             "  ORDER BY 2,3"
        ));
        return $user_registred;
    }

    public function getTrainingDate()
    {
        $next_training = DB::select(DB::raw("SELECT s.game_datetime, s.game_id, s.game_date FROM vik_preferences p JOIN vik_schedules s ON s.game_date = p.pref_value WHERE p.pref = 'NEXT_TRAINING'"));
        return $next_training;
    }


    public function store(Request $request)
    {
        if(Auth::user()->can('add_registrations')) {
            $Request = $request->all();
            $Request['registration_datetime'] = date('Y-m-d H:i:s');
            $Player = DB::select(DB::raw("select * from users where guest_id = ".$Request['guest_id']))[0];

//print_r($Player->member_jn);
            if ($Player->member_jn=="1") {
                $Request['isMember'] = "Y";
                $Request['memberId'] =  $Player->guest_id;
            }
            else{
                $Request['isMember'] = "N";
                // Bei einem Gast soll eine Reihenfolge erreichnet werden
                $registration_rank = DB::select(DB::raw("SELECT max(registration_rank) ".
                                                        "  FROM vik_preferences p  ".
                                                        "  JOIN vik_schedules s ON s.game_date = p.pref_value ".
                                                        "  JOIN vik_registrations r on r.game_id = s.game_id ".
                                                        " WHERE p.pref = 'NEXT_TRAINING' ".
                                                        "   and r.isMember = 0"));
                if($registration_rank==null)
                    $registration_rank = 1;
                else
                    $registration_rank++;
                $Request['registration_rank'] = $registration_rank;
                $Request['memberId'] =  null;
            }
            $Request['inserter'] = Auth::user()->guest_id;

//return      $Request;

/*            $temp = explode(",", $id);
            foreach($temp as $val){
                if($id==1)
                    return response()->json(['error' =>'You not have permission to delete this item in demo mode'], 403);
                $Role = Role::find($val);
                $Role->delete();
            }
*/
            VikRegistration::create($Request);
            return response()->json(['success',
                        'guest_id' => $Player->guest_id,
                        'player_number' => $Player->player_number,
                        'player_name' => $Player->player_name,
                        'player_firstname' => $Player->player_firstname,
                        'registration_datetime' => $Request['registration_datetime'],
                        'player_position'=> $Player->player_position], 200);
        } else
            return response()->json(['error' =>'Sie haben keine Berechtigung. Wenden Sie sich an den Administrator!'], 403);
    }

    public function cancelRegistration(Request $request)
    {
//        echo "<script>console.log('Console: " . $request . "' );</script>";
        if(Auth::user()->can('add_registrations')) {
            $Request = $request->all();
            $UserRegistration = DB::select(DB::raw("select u.player_number, u.player_name,u.player_firstname,r.registration_datetime ".
                                                   " from users u join vik_registrations r on r.guest_id = u.guest_id ".
                                                   " where u.guest_id = ".$Request['guest_id']." and game_id = ".$Request['game_id']
            ))[0];

//var_dump($User);
            VikRegistration::where('guest_id',$Request['guest_id'])->where('game_id',$Request['game_id'])->update(['cancelation_datetime'=>date('Y-m-d H:i:s')]);
            return response()->json(['success',
                'guest_id' => $Request['guest_id'],
                'player_number' => $UserRegistration->player_number,
                'player_name' => $UserRegistration->player_name,
                'player_firstname' => $UserRegistration->player_firstname,
                'registration_datetime' => $UserRegistration->registration_datetime], 200);
        } else
            return response()->json(['error' =>'Sie haben keine Berechtigung. Wenden Sie sich an den Administrator!'], 403);
    }

}
