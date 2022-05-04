<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Nicolaslopezj\Searchable\SearchableTrait;

class Task extends Model
{
    use SearchableTrait;
    protected $searchable = [
        'columns' => [
            'tasks.title' => 30,
            'tasks.description' => 40,
            'users.name' => 50,
            'categories.name' => 50,
        ],
        'joins' => [
            'users' => ['users.id','tasks.user_id'],
            'categories' => ['categories.id','tasks.category_id'],
        ],
    ];
    public function User()
    {
        return $this->belongsTo('App\User');
    }
    public function Category()
    {
        return $this->belongsTo('App\Category');
    }

    public function Comment()
    {
        return $this->hasMany('App\Comment');
    }
    public function Tags()
    {
        return $this->belongsToMany('App\Tag','task_tags');
    }

    public function Gallery()
    {
        return $this->hasMany('App\Gallery');
    }

    protected $fillable= ['title', 'description', 'attach_url','start_date','end_date','task_status'];
}
