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

class ProspectController extends Controller
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
            $customer_data = app('App\Http\Controllers\NetframeController')->getCustomerByCustomerNumber($request['query']);
            return array($customer_data);
        }
        return 'Nicht gefunden';
    }


}
