<?php

namespace App;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Nicolaslopezj\Searchable\SearchableTrait;
use PhpSoft\Users\Models\UserTrait;

class User extends Model implements AuthenticatableContract,
                                    //AuthorizableContract,
                                    CanResetPasswordContract
{
    use SearchableTrait;
    protected $searchable = [
        'columns' => [
            'users.player_firstname' => 1,
            'users.player_name' => 2,
            'users.email' => 200,
            'users.player_birthday' => 3,
            'users.player_status' => 4,
            'users.player_plz' => 5,
            'users.gender' => 6,
            'users.player_city' => 7,
            'users.player_street' => 8,
            'users.player_phone' => 9,
            'users.player_position' => 10,
            'users.player_stick' => 11,
            'users.player_type' => 12,
            'users.player_number' => 13,
            'users.member_jn' => 14
        ],
    ];
    use Authenticatable, CanResetPassword,UserTrait;

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'player_firstname',
        'player_name',
        'email',
        'password',
        'player_birthday',
        'image',
        'gender',
        'status',
        'player_status',
        'player_plz',
        'player_city',
        'player_street',
        'player_phone',
        'player_position',
        'player_stick',
        'player_type',
        'player_number',
        'member_jn'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = ['password', 'remember_token'];

    public function Task()
    {
        return $this->hasMany('App\Task');
    }

    public function Role_user()
    {
        return $this->hasMany('App\Role_user');
    }

    public function Comment()
    {
        return $this->hasMany('App\Comment');
    }
   #### import fields
    public  $import_fields=['email','password','role','name','gender','status'];
}
