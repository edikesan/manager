<?php

namespace App\Http\Controllers;

use App\Optionlist;
use App\Address;
use App\Prospect;
use App\Postcode;
use App\Product;
use App\User;
use App\Setting;
use Illuminate\Http\Request;

use App\Mail;
use Mail as Email;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\Translation\Tests\Dumper\IniFileDumperTest;
use Validator;
use File;
use DB;

class ForwardRequestController extends Controller
{
    public function __construct()
    {
        // Apply the jwt.auth middleware to all methods in this controller
        // except for the authenticate method. We don't want to prevent
        // the user from retrieving their token if they don't already have it
        $this->middleware('jwt.auth', ['except' => ['authenticate']]);
    }


    public function forwardRequest(Request $request)
    {
        ### search
        if ($request['query']) {
            $param_array = json_decode($request['query'], true);
            // Log paramter und response in a file with the name of macro
            $file = $param_array['makro'].'.txt';
            file_put_contents($file,"---------- ".date("m-d-yy H:i:s")." ----------"."\r\n", FILE_APPEND | LOCK_EX);
            file_put_contents($file, "Parameter: ".$request['query']."\r\n", FILE_APPEND | LOCK_EX );
            $store_data = app('App\Http\Controllers\NetframeController')->executeMacro($param_array['makro'], $param_array);
/*            ob_start();
            print_r($store_data);
            $textualRepresentation = ob_get_contents();
            ob_end_clean();
            file_put_contents($file, "Return: ".$textualRepresentation, FILE_APPEND | LOCK_EX);
*/
            return $store_data;
        }
        return 'Nicht gefunden';
    }
}