<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class role_user extends Model
{
    protected $table = 'role_user';

    public function role()
    {
        return $this->hasMany('App\Role');
    }
    public function user()
    {
        return $this->hasMany('App\User');
    }
    protected $fillable = ['user_id', 'role_id'];
}
