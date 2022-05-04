<?php

namespace App\Http\Controllers;

use App\Optionlist;
use Illuminate\Http\Request;

use App\Http\Requests;
use Validator;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class OptionlistController extends Controller
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
        $optionlists = Optionlist::all();
        return $optionlists;
    }


    public function create()
    {

    }


    public function store(Request $request)
    {
        if(Auth::user()->can('add_optionlist')) {
            if ($request) {
                $validator = Validator::make($request->all(), [
                    'optionlist' => 'required',
                    'name' => 'required',
                ]);
                if ($validator->fails()) {
                    return response()->json(['error' => $validator->errors()], 406);
                }

                Optionlist::create($request->all());
                return response()->json(['success'], 200);
            } else {
                return response()->json(['error' => 'Optionsliste kann nicht gespeichert werden'], 401);
            }
        }else{
            return response()->json(['error' => 'Für diese Aktion sind Ihre Berechtigungen nicht ausreichend'], 403);
        }

    }


    public function show($id)
    {
        //
    }


    public function edit($id)
    {
        //
    }


    public function update(Request $request, $id)
    {
        if(Auth::user()->can('edit_optionlist')) {
            $validator = Validator::make($request->all(), [
                'name' => 'required|min:3',
            ]);
            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 406);
            }

            $optionlist = Optionlist::find($id);
            if ($optionlist) {
                $optionlist->update($request->all());
                return response()->json(['success'], 200);
            } else
                return response()->json(['error' => 'Optionsliste nicht gefunden'], 404);
        } else{
            return response()->json(['error' =>'Für diese Aktion sind Ihre Berechtigungen nicht ausreichend'], 403);
        }
    }


    public function destroy($id)
    {
        if(Auth::user()->can('delete_optionlist')) {

                $Customer = Optionlist::find($id);
                $Customer->delete();
                 return response()->json(['success'], 200);
        } else
            return response()->json(['error' =>'Für diese Aktion sind Ihre Berechtigungen nicht ausreichend'], 403);
    }
}
