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

class StoreController extends Controller
{
    public function __construct()
    {
        // Apply the jwt.auth middleware to all methods in this controller
        // except for the authenticate method. We don't want to prevent
        // the user from retrieving their token if they don't already have it
        $this->middleware('jwt.auth', ['except' => ['authenticate']]);
    }


    /**
     * @param Request $request
     * @return string
     */
    public function search(Request $request)
    {
        ### search
        if ($request['query']) {
            $customer_data = app('App\Http\Controllers\NetframeController')->getStoresByDate($request['query']);
            return $customer_data;
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

    public function store(Request $request)
    {
        if ($request->all()) {
            $store_data = app('App\Http\Controllers\NetframeController')->updateStore($request->all());
            return $store_data;
        }
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

    public function index(Request $request)
    {
        $store = DB::select(DB::raw('SELECT * FROM store'));
        return $store;
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $Prospect = Prospect::with('User')->with('Address')->with('Addresses')->with('Products')->with(array('Comments' => function ($query) {
            $query->with('User');
        }))->find($id);
        return $Prospect;
    }


    public function edit($id)
    {
        $editProspect = Prospect::find($id);
        if ($editProspect)
            return response()->json(['success' => $editProspect], 200);
        else
            return response()->json(['error' => 'Interessent nicht gefunden'], 404);
    }


    public function update(Request $request, $id)
    {

        if (Auth::user()->can('edit_prospect')) {
            $validator = Validator::make($request->all(), [
                'address_id' => 'required'
            ]);
            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 406);
            }
            $Prospect = Prospect::find($id);
            if ($Prospect) {
                unset($request['contact_at']);
                $Prospect->update($request->all());
                $address = Address::find($request['address_id']);
                $address->update($request['address']);
                
                return response()->json(['success'], 200);

            } else
                return response()->json(['error' => 'Interessent nicht gefunden'], 404);
        } else
            return response()->json(['error' => 'Für diese Aktion sind Ihre Berechtigungen nicht ausreichend'], 403);
    }

}
