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

class SupplierCheckController extends Controller
{
    public function __construct()
    {
        // Apply the jwt.auth middleware to all methods in this controller
        // except for the authenticate method. We don't want to prevent
        // the user from retrieving their token if they don't already have it
        $this->middleware('jwt.auth', ['except' => ['authenticate']]);
    }


    public function search(Request $request)
    {
        ### search
        if ($request['query']) {
            $param_array = json_decode($request['query']);
            $store_data = app('App\Http\Controllers\NetframeController')->getSupplierReceipt($param_array->spednr);
            return $store_data;
        }
        return 'Nicht gefunden';
    }

    public function updateSupplierCheck(Request $request)
    {
        ### search
        if ($request['query']) {
            $param_array = json_decode($request['query']);
            $store_data = app('App\Http\Controllers\NetframeController')->updateSupplierCheckData( $param_array->rowid, $param_array->ladedatum, $param_array->entladedatum, $param_array->menge );
            return $store_data;
        }
        return 'Nicht gefunden';
    }

    public function updateTankstelleSupplierCheck(Request $request)
    {
        ### search
        if ($request['query']) {
//print_r($request['query'])      ;
            $param_array = json_decode($request['query']);
            $store_data = app('App\Http\Controllers\NetframeController')->updateTankstelleSupplierCheckData( $param_array->rowid, $param_array->lieferscheinnr, $param_array->tkwkz,
                               $param_array->ladedatum,$param_array->entladedatum,$param_array->menge,$param_array->mengeltr,$param_array->temperatur,$param_array->fuellgrad,$param_array->bemerkung );
            return $store_data;
        }
        return 'Nicht gefunden';
    }

    public function getSupplierDetail(Request $request)
    {
        $data = $request->all();

        ### search
        if ($data['query']) {
            $param_array = json_decode($data['query']);
            if(empty($param_array->vertragnr)){
                $param_array->vertragnr = '99';
            }
            if(empty($param_array->projektnr)){
                $param_array->projektnr = '99';
            }
            $store_data = app('App\Http\Controllers\NetframeController')->getSupplierDetailData($param_array->vertragnr, $param_array->projektnr);
            return $store_data;
        }
        return 'Nicht gefunden';
    }

    public function getWareneingaenge(Request $request)
    {
        if ($request['query']) {
            $param_array = json_decode($request['query'], true);
            $data = app('App\Http\Controllers\NetframeController')->getWareneingaenge($param_array);
            return $data;
        }
        return 'Nicht gefunden';
    }


    public function deleteSupplierCheck(Request $request)
    {
        if ($request['query']) {
            $param_array = json_decode($request['query'], true);
            $data = app('App\Http\Controllers\NetframeController')->executeMacro('_SV_NETFRAME_BESCHAFFUNG_UPDATE_ZUGANGSPED_DEL',$param_array);
            return $data;
        }
        return 'Nicht gefunden';
    }


/*    public function destroy(Request $request)
    {
var_dump("request:" . $request);
var_dump(json_decode($request, true));
        if ($request['id']) {
            $param_array = json_decode($request['query'], true);
            $param = '{"row_id":' . $param_array['rowid'] . ', "_loeschgrund":' . $param_array['delete_reason'] . '}';
            $param = json_decode($param, true);
var_dump($param);
return;
            $response = app('App\Http\Controllers\NetframeController')->executeMacro('_SV_NETFRAME_BESCHAFFUNG_UPDATE_ZUGANGSPED_DEL',$param);
            return $response;
        }
        return 'Nicht gefunden';
    }
*/


}
