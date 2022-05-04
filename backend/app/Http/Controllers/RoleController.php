<?php

namespace App\Http\Controllers;

use App\Permission;
use App\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Validator;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class RoleController extends Controller
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
            $Role = Role::search($request['query'], null, false)->get();
            $page = $request->has('page') ? $request->page - 1 : 0;
            $total = $Role->count();
            $Role = $Role->slice($page * $per_page, $per_page);
            $Role = new \Illuminate\Pagination\LengthAwarePaginator($Role, $total, $per_page);
            return  $Role;
        }
        return 'not found';
    }




    public function index()
    {
        $per_page = \Request::get('per_page') ?: 10;

        if(Auth::user()->can('view_role'))
            return Role::paginate($per_page);
        else
            return response()->json(['error' =>'You not have Role'], 403);
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
        if(Auth::user()->can('add_role')) {
            if ($request) {

                $validator = Validator::make($request->all(), [
                    'name' => 'required|min:6',
                    'display_name' => 'required|min:6',
                ]);
                if ($validator->fails()) {
                    return response()->json(['error' => $validator->errors()], 406);
                }
               $Role=Role::create($request->all());
                foreach($request->permission as $key =>$val) {
                    if($val){
                        $prem_id= permission::select('id')->where('name'  , $key)->lists('id')->toarray();;
                        $Role->attachPermission($prem_id[0]);
                    }
                }
                return response()->json(['success'], 200);
            } else {
                return response()->json(['error' => 'can not save product'], 401);
            }
        }else
            return response()->json(['error' =>'You not have Role'], 403);

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $perm_arr=array();
        $editRole = Role::find($id);
        $permisions =permission::select(['name','id'])->get()->toArray();
        foreach($permisions as  $val){
            $user = DB::table('permission_role')->where('permission_id',$val['id'])->where('role_id',$id)->lists('role_id');
            if(count($user))
                $perm_arr[$val['name']]=1;
            else
                $perm_arr[$val['name']]=0;
        }
        if($editRole){
            $editRole->permission=$perm_arr;
            return $editRole;
        }
        else
            return response()->json(['error' => 'not found item'], 404);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $perm_arr=array();
        $editRole = Role::find($id);
        $permisions =permission::select(['name','id'])->get()->toArray();
        foreach($permisions as  $val){
            $user = DB::table('permission_role')->where('permission_id',$val['id'])->where('role_id',$id)->lists('role_id');
            if(count($user))
                $perm_arr[$val['name']]=1;
            else
                $perm_arr[$val['name']]=0;
        }
        if($editRole){
            $editRole->permission=$perm_arr;
            return $editRole;
        }
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
         * in demo version you can't update default task manager user role.
         * in production you should remove it
         */
        if($id==1)
            return response()->json(['error' =>'You not have permission to edit this item in demo mode'], 403);

        if(Auth::user()->can('edit_role')) {
            $validator = Validator::make($request->all(), [
                'name' => 'required|min:6',
                'display_name' => 'required|min:6',
            ]);
            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 406);
            }
            $Role = Role::find($id);
            if ($Role) {
                $Role->update($request->all());
                DB::table('permission_role')->where('role_id',$request['id'])->delete();
                foreach($request->permission as $key =>$val) {
                    if($val){
                        $prem_id= permission::select('id')->where('name'  , $key)->lists('id')->toarray();

                        if(count($prem_id))
                            $Role->attachPermission($prem_id[0]);
                    }
                }
                return response()->json(['success'], 200);
            } else
                return response()->json(['error' => 'not found item'], 404);
        } else
            return response()->json(['error' =>'You not have Role'], 403);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if(Auth::user()->can('delete_role')) {
            $temp = explode(",", $id);
            foreach($temp as $val){
                if($id==1)
                    return response()->json(['error' =>'You not have permission to delete this item in demo mode'], 403);
                $Role = Role::find($val);
                $Role->delete();
            }
            return response()->json(['success'], 200);
        } else
            return response()->json(['error' =>'You not have this permission'], 403);


    }
}
