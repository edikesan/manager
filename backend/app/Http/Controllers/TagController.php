<?php

namespace App\Http\Controllers;

use App\Tag;
use App\Task;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Validator;

class TagController extends Controller
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
        $per_page = \Request::get('per_page') ?: 10;
        ### search
        if ($request['query']) {
            $request = Tag::search($request['query'], null, false)->get();
            $page = $request->has('page') ? $request->page - 1 : 0;
            $total = $request->count();
            $request = $request->slice($page * $per_page, $per_page);
            $request = new \Illuminate\Pagination\LengthAwarePaginator($request, $total, $per_page);
            return  $request;
        }
        return 'not found';
    }


    public function index()
    {
        $per_page = \Request::get('per_page') ?: 10;
        return Tag::paginate($per_page);

    }

    public function store(Request $request)
    {
        if(Auth::user()->can('add_tag')) {
            if ($request) {
                $validator = Validator::make($request->all(), [
                    'tag' => 'required|min:3',
                ]);
                if ($validator->fails()) {
                    return response()->json(['error' => $validator->errors()], 406);
                }
                $Request=Tag::create($request->all());

                $category = Task::find($request['task_id']);
                $category->Tag()->save($Request);

                return response()->json(['success'], 200);
            } else {
                return response()->json(['error' => 'can not save product'], 401);
            }
        }else
            return response()->json(['error' =>'You not have Tag'], 403);
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $Tag = Tag::find($id);
        return $Tag;
    }


    public function edit($id)
    {
        $editTag = Tag::find($id);
        if($editTag)
            return response()->json(['success'=>$editTag], 200);
        else
            return response()->json(['error' => 'not found item'], 404);
    }


    public function update(Request $request, $id)
    {

        if(Auth::user()->can('edit_tag')) {
            $validator = Validator::make($request->all(), [
                'tag' => 'required|min:6',

            ]);
            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 406);
            }
            $Tag = Tag::find($id);
            if ($Tag) {
                $Tag->update($request->all());
                $category = Task::find($request['task_id']);
                $category->Tag()->save($Tag);
                return response()->json(['success'], 200);
            } else
                return response()->json(['error' => 'not found item'], 404);
        } else
            return response()->json(['error' =>'You not have update Tag'], 403);
    }


    public function destroy($id)
    {
        if(Auth::user()->can('delete_tag')) {
            $temp = explode(",", $id);
            foreach($temp as $val){
                $Tag = Tag::find($val);
                $Tag->delete();
            }
            return response()->json(['success'], 200);
        } else
            return response()->json(['error' =>'You not have delete Tag'], 403);
    }
}
