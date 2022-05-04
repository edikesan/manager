<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TaskTags extends Model
{
    protected $fillable= ['tag_id','task_id'];
//    public function Task()
//    {
//        return $this->belongsToMany('App\Task');
//    }
//    public function Tag()
//    {
//        return $this->belongsToMany('App\Tag');
//    }
}
