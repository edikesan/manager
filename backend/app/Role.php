<?php

namespace App;


use Zizaco\Entrust\EntrustRole;
use Nicolaslopezj\Searchable\SearchableTrait;

class role extends EntrustRole
{
    use SearchableTrait;
    protected $searchable = [
        'columns' => [
            'roles.name' => 100,
            'roles.description' => 100,
        ],
    ];
    public function role_user()
    {
        return $this->belongsTo('App\Role_user');
    }
    protected $fillable = ['name','display_name', 'description'];
}
