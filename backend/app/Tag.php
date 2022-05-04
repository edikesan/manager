<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Nicolaslopezj\Searchable\SearchableTrait;

class Tag extends Model
{
    use SearchableTrait;
    protected $searchable = [
        'columns' => [
            'tags.tag' => 30,
         ]
    ];
    public function Task()
    {
        return $this->belongsToMany('App\Task','task_tags');
    }
    protected $fillable= ['tag'];
}
