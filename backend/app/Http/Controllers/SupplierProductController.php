<?php

namespace App\Http\Controllers;

use App\SupplierProduct;
use Illuminate\Http\Request;

use App\Http\Requests;
use Validator;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use DB;

class SupplierProductController extends Controller
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
        $suppliers_products = DB::select(DB::raw('SELECT * FROM supplier_product'));
        return $suppliers_products;
    }

}
