<?php

namespace App\Http\Controllers;

use App\News;
use App\User;
use Illuminate\Support\Facades\Input;
 use Illuminate\Http\Request;
 use App\Http\Requests;
use File;


class UploadController extends Controller
{
    ### upload user avatar & news picture
    public function uploadimage()
    {
        $file = Input::file('file');
        $size = File::size($file);
        $destinationPath = public_path() . '/temp/';
        $extension = $file->getClientOriginalExtension();
        $filename = str_random(25).'.'.$extension;
        $upload_success = Input::file('file')->move($destinationPath, $filename);
        if ($upload_success) {
            return response()->json(['filename'=>$filename,'size'=>$size]);
        } else {
            return 'YEP: Problem in file upload';
        }

    }

    #### delete User avatar
    public function deleteUpload($id)
    {
        $filename = $id;
        $temp_dir = 'temp/';
        $path_final_dir = 'uploads/';

        if(File::delete($path_final_dir.$filename) || File::delete($temp_dir.$filename))
        {
//            $temp=User::find($id);
//            $temp->update(['avatar_url'=>'']);  ### update avatar_url to null in database
            return 1;                           ### update avatar_url to null in html
        }
        else
        {
            return 0;
        }
    }


}
