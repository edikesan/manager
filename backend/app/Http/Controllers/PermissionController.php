<?php

namespace App\Http\Controllers;

use App\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use File;
use Validator;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class PermissionController extends Controller
{
    public function __construct()
    {
        // Apply the jwt.auth middleware to all methods in this controller
        // except for the authenticate method. We don't want to prevent
        // the user from retrieving their token if they don't already have it
        $this->middleware('jwt.auth', ['except' => ['authenticate']]);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function search(Request $request)
    {
        $per_page = \Request::get('per_page') ?: 10;
        ### search
        if ($request['query']) {
            $Permission = Permission::search($request['query'], null, false)->get();
            $page = $request->has('page') ? $request->page - 1 : 0;
            $total = $Permission->count();
            $Permission = $Permission->slice($page * $per_page, $per_page);
            $Permission = new \Illuminate\Pagination\LengthAwarePaginator($Permission, $total, $per_page);
            return  $Permission;
        }
        return 'not found';
    }




    public function index()
    {
        $per_page = \Request::get('per_page') ?: 10;

        if(Auth::user()->can('view_permission'))
            return Permission::paginate($per_page);
        else
            return response()->json(['error' =>'You not have permission'], 403);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if(Auth::user()->can('add_permission')) {
            if ($request) {

                $validator = Validator::make($request->all(), [
                    'name' => 'required|min:6',
                    'display_name' => 'required|min:6',
                ]);
                if ($validator->fails()) {
                    return response()->json(['error' => $validator->errors()], 406);
                }
                Permission::create($request->all());
                return response()->json(['success'], 200);
            } else {
                return response()->json(['error' => 'can not save product'], 401);
            }
        }else
            return response()->json(['error' =>'You not have permission'], 403);

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $Permission = Permission::find($id);
        return $Permission;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $editpermission = Permission::find($id);
        if($editpermission)
            return response()->json(['success'=>$editpermission], 200);
        else
            return response()->json(['error' => 'not found item'], 404);

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        /**
         * in demo version you can't update default task manager user permission.
         * in production you should remove it
         */
        if($id<45)
            return response()->json(['error' =>'You not have permission to edit this item in demo mode'], 403);
        /** end demo restriction
        */

        if(Auth::user()->can('edit_permission')) {
            $validator = Validator::make($request->all(), [
                'name' => 'required|min:6',
                'display_name' => 'required|min:6',
            ]);
            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 406);
            }
        $Permission = Permission::find($id);
            if ($Permission) {
                $Permission->update($request->all());
                return response()->json(['success'], 200);
            } else
                return response()->json(['error' => 'not found item'], 404);
        } else
            return response()->json(['error' =>'You not have permission'], 403);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if(Auth::user()->can('delete_permission')) {
            $temp = explode(",", $id);
            foreach($temp as $val){
                /**
                 * in demo version you can't delete default task manager user permission.
                 * in production you should remove it
                 */
                if($id<45)
                    return response()->json(['error' =>'You not have permission to delete this item in demo mode'], 403);
                /** end demo restriction
                 */
                $Permission = Permission::find($val);
                $Permission->delete();
            }
            return response()->json(['success'], 200);
        } else
            return response()->json(['error' =>'You not have permission'], 403);
    }
}
