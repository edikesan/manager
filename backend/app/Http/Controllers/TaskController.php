<?php

namespace App\Http\Controllers;

use App\Category;
use App\Tag;
use App\Task;
use App\TaskTags;
use App\User;
use App\Gallery;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\Translation\Tests\Dumper\IniFileDumperTest;
use Validator;
use File;

class TaskController extends Controller
{
    public function __construct()
    {
        // Apply the jwt.auth middleware to all methods in this controller
        // except for the authenticate method. We don't want to prevent
        // the user from retrieving their token if they don't already have it
        $this->middleware('jwt.auth', ['except' => ['authenticate']]);
    }


    public function exportFile(Request $request)
    {
        ### $request['export_type'] is export mode  "EXCEL or CSV"
        ### Check export CSV permission
        if ($request['export_type'] == 'csv' && !Auth::user()->can('export_csv'))
            return 'You not have this permission';

        ### Check export EXCEL permission
        if ($request['export_type'] == 'xls' && !Auth::user()->can('export_xls'))
            return 'You not have this permission';


        ### record_type 1 equal whole records and 2 equals selected records
        if ($request['record_type'] == 1) {
            $tasks = Task::all();
        } else if ($request['record_type'] == 2) {
            $tasks = Task::findMany($request['selection']);
        }

        ###
        if ($request['export_type'] == 'pdf') { //export PDF
            $html = '<h1 style="text-align: center">YEP ngLaravel PDF</h1><h3 style="text-align: center"> You can change pdf style with html template</h3>';
            $html .= '<style> table, th, td {text-align: center;} th, td {padding: 5px;} th {color: #43A047;border-color: black;background-color: #C5E1A5} </style> <table border="2" style="width:100%;"> <tr> <th>Title</th> <th>Description</th> </tr>';
            foreach ($tasks as $task) {
                $html .= "<tr> <td>$task->title</td> <td>$task->description</td> </tr>";
            }
            $html .= '</table>';
            $pdf = App::make('dompdf.wrapper');
            $headers = array(
                'Content-Type: application/pdf',
            );
            $pdf->loadHTML($html);
            return $pdf->download('permission.pdf', $headers);
        } else {
            Excel::create('user', function ($excel) use ($tasks) {
                $excel->sheet('Sheet 1', function ($sheet) use ($tasks) {
                    $sheet->fromArray($tasks);
                });
            })->download($request['export_type']);
        }
    }


    public function search(Request $request)
    {
        $per_page = \Request::get('per_page') ?: 10;
        ### search
        if ($request['query']) {
            $Task = Task::search($request['query'], null, false)->with('User')->with('Category')->get();
            $page = $Task->has('page') ? $Task->page - 1 : 0;
            $total = $Task->count();
            $Task = $Task->slice($page * $per_page, $per_page);
            $Task = new \Illuminate\Pagination\LengthAwarePaginator($Task, $total, $per_page);
            return $Task;
        }
        return 'not found';
    }


    public function index()
    {
        $per_page = \Request::get('per_page') ?: 10;

        if (Auth::user()->can('view_task'))
            return Task::with('User')->with('Gallery')->with('Tags')->with('Comment.User')->with('Category')->paginate($per_page);
        else
            return response()->json(['error' => 'You not have Task'], 403);
    }

    public function store(Request $request)
    {
        if (Auth::user()->can('add_task')) {
            if ($request) {
                $validator = Validator::make($request->all(), [
                    'title' => 'required|min:6',
                    'user_id' => 'required',
                    'category_id' => 'required'
                ]);
                if ($validator->fails()) {
                    return response()->json(['error' => $validator->errors()], 406);
                }

                $Request = Task::create($request->all());

                if ($request['gallery'] != '') {
                    $json = $request['gallery'];
                    if ($json) {
                        foreach ($json as $val) {
                            // MOVE IMAGE TO UPLOAD FOLDER
                            if (file_exists("temp/" . $val['filename']) && $val['filename'] != '') {
                                File::move("temp/" . $val['filename'], "uploads/" . $val['filename']);
                                Gallery::create(['filename' => $val['filename'], 'size' => $val['size'], 'task_id' => $Request->id]);
                            }
                        }
                    }
                }

                if ($request['tags'] != '') {
                    $tag_json = $request['tags'];
                    foreach ($tag_json as $val) {
                        if ($val['id'] == 0) {
                            $tag = Tag::create(['tag' => $val['tag']]);
                            $val['id'] = $tag->id;
                        }
                        TaskTags::create(['task_id' => $Request->id, 'tag_id' => $val['id']]);
                    }
                }


                $category = User::find($request['user_id']);
                $category->Task()->save($Request);
                $category = Category::find($request['category_id']);
                $category->Task()->save($Request);


                return response()->json(['success' => $Request], 200);
            } else {
                return response()->json(['error' => 'can not save task'], 401);
            }
        } else
            return response()->json(['error' => 'You not have Task'], 403);
    }


    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $Task = Task::with('User')->with('Gallery')->with('Tags')->with("Comment.User")->with('Category')->find($id);
        return $Task;
    }


    public function edit($id)
    {
        $editTask = Task::find($id);
        if ($editTask)
            return response()->json(['success' => $editTask], 200);
        else
            return response()->json(['error' => 'not found item'], 404);
    }


    public function update(Request $request, $id)
    {

        if (Auth::user()->can('edit_task')) {
            $validator = Validator::make($request->all(), [
                'title' => 'required|min:6',

            ]);
            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 406);
            }
            $Task = Task::find($id);
            if ($Task) {
                $Task->update($request->all());
                $category = User::find($request['user_id']);
                $category->Task()->save($Task);
                $category = Category::find($request['category_id']);
                $category->Task()->save($Task);

                $delete_tag = TaskTags::where('task_id', $id);
                if ($delete_tag)
                    $delete_tag->delete();

                if ($request['gallery'] != '') {
                    $delete_tag = Gallery::where('task_id', $id);
                    if ($delete_tag)
                        $delete_tag->delete();
                    $json = $request['gallery'];
                    if ($json) {
                        foreach ($json as $val) {
                            // MOVE IMAGE TO UPLOAD FOLDER
                            if (file_exists("temp/" . $val['filename']) && $val['filename'] != '') {
                                File::move("temp/" . $val['filename'], "uploads/" . $val['filename']);
                            }
                            Gallery::create(['filename' => $val['filename'], 'size' => $val['size'], 'task_id' => $id]);
                        }
                    }
                }

                if ($request['tags'] != '') {
                    $tag_json = $request['tags'];
                    foreach ($tag_json as $val) {
                        if ($val['id'] == 0) {
                            $tag = Tag::create(['tag' => $val['tag']]);
                            $val['id'] = $tag->id;
                        }
                        TaskTags::create(['task_id' => $id, 'tag_id' => $val['id']]);
                    }
                }


                return response()->json(['success'], 200);


            } else
                return response()->json(['error' => 'not found item'], 404);
        } else
            return response()->json(['error' => 'You not have update Task'], 403);
    }


    public function destroy($id)
    {
        if (Auth::user()->can('delete_task')) {
            $temp = explode(",", $id);
            foreach ($temp as $val) {
                $Task = Task::find($val);
                $Task->delete();
            }
            return response()->json(['success'], 200);
        } else
            return response()->json(['error' => 'You not have delete Task'], 403);
    }
}
