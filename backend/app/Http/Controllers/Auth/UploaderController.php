<?php

namespace App\Http\Controllers;

use App\Uploader;
use App\Task;
use App\User;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Validator;

class UploaderController extends Controller
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
            $request = Comment::search($request['query'], null, false)->get();
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
        if(Auth::user()->can('view_comment'))
            return Comment::all();
        else
            return response()->json(['error' =>'You not have Comment permission'], 403);
    }


    public function store(Request $request)
    {
        if(Auth::user()->can('add_comment')) {
            if ($request) {
                $validator = Validator::make($request->all(), [
                    'comment_text' => 'required|min:6',
                ]);
                if ($validator->fails()) {
                    return response()->json(['error' => $validator->errors()], 406);
                }

                $Request=Comment::create($request->all());

                $category = Task::find($request['task_id']);
                $category->Comment()->save($Request);

                $category = User::find($request['user_id']);
                $category->Comment()->save($Request);

                return response()->json(['success'], 200);
            } else {
                return response()->json(['error' => 'can not save product'], 401);
            }
        }else
            return response()->json(['error' =>'You not have Comment'], 403);
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $Comment = Comment::find($id);
        return $Comment;
    }


    public function edit($id)
    {
        $editComment = Comment::find($id);
        if($editComment)
            return response()->json(['success'=>$editComment], 200);
        else
            return response()->json(['error' => 'not found item'], 404);
    }


    public function update(Request $request, $id)
    {

        if(Auth::user()->can('edit_comment')) {
            $validator = Validator::make($request->all(), [
                'comment_text' => 'required|min:6',

            ]);
            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 406);
            }
            $Comment = Comment::find($id);
            if ($Comment) {
                $Comment->update($request->all());
                $category = User::find($request['user_id']);
                $category->Comment()->save($Comment);
                $category = Task::find($request['task_id']);
                $category->Comment()->save($Comment);
                return response()->json(['success'], 200);
            } else
                return response()->json(['error' => 'not found item'], 404);
        } else
            return response()->json(['error' =>'You not have update Comment'], 403);
    }


    public function destroy($id)
    {
        if(Auth::user()->can('delete_comment')) {
            $temp = explode(",", $id);
            foreach($temp as $val){
                $Comment = Comment::find($val);
                $Comment->delete();
            }
            return response()->json(['success'], 200);
        } else
            return response()->json(['error' =>'You not have delete Comment'], 403);
    }
}
