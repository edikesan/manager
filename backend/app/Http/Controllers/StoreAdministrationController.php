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

class StoreAdministrationController extends Controller
{
    public function __construct()
    {
        // Apply the jwt.auth middleware to all methods in this controller
        // except for the authenticate method. We don't want to prevent
        // the user from retrieving their token if they don't already have it
        $this->middleware('jwt.auth', ['except' => ['authenticate']]);
    }


    public function updateStoreAdministration(Request $request)
    {
        if ($request['query']) {
            $param_array = json_decode($request['query'], true);
            $store_data = app('App\Http\Controllers\NetframeController')->executeMacro("_SV_NETFRAME_BESCHAFFUNG_UPDATE_ZUGANG", $param_array);
            return $store_data;
        }
        return 'Nicht gefunden';
    }

    public function search(Request $request)
    {
        ### search
        if ($request['query']) {
            $store_data = app('App\Http\Controllers\NetframeController')->getStoreAdministration($request['query']);
            return $store_data;
        }
        return 'Nicht gefunden';
    }

    public function createWE(Request $request)
    {
        ### search
        if ($request['query']) {
            $store_data = app('App\Http\Controllers\NetframeController')->createWe($request['query']);
            return $store_data;
        }
        return 'Nicht gefunden';
    }

    public function createFrachtBeleg(Request $request)
    {
        ### search
        if ($request['query']) {
            $store_data = json_decode ($request['query']);
            $erp_ret = app('App\Http\Controllers\NetframeController')->executeMacro("_SV_NETFRAME_BESCHAFFUNG_IMPORT_FRACHT", $params = array("rowid" => $store_data->rowid) );
            return $erp_ret;
        }
        return 'Nicht gefunden';
    }

    public function searchStationDeatil(Request $request)
    {

        ### search
        if ($request['query']) {
            $customer_data = app('App\Http\Controllers\NetframeController')->getStoreDetails($request['query']);
            return $customer_data;
        }
        return 'Nicht gefunden';
    }

    public function searchContract(Request $request)
    {
        $per_page = \Request::get('per_page') ?: 10;

        $user = User::with('Role_user')->find(Auth::user()->id);

        ### search
        if ($request['query']) {
            $customer_data = app('App\Http\Controllers\NetframeController')->getContractByCustomerId($request['query']);
            return array($customer_data);
        }
        return 'Nicht gefunden';
    }
}
