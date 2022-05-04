<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Nicolaslopezj\Searchable\SearchableTrait;

class Prospect extends Model
{
    use SearchableTrait;
    protected $searchable = [
        'columns' => [
            'addresses.first_name' => 30,
            'addresses.last_name' => 40,
            'addresses.company_name' => 40,
            'addresses.street' => 40,
            'addresses.postcode' => 50,
            'addresses.city' => 50,
            'addresses.telephone' => 40,
            'addresses.email' => 40,
        ],
        'joins' => [
            'users' => ['users.id','prospects.user_id'],
            'addresses' => ['addresses.prospect_id','prospects.id'],
            'products' => ['prospects.id','products.prospect_id'],
        ],
    ];
    
    public function User()
    {
        return $this->belongsTo('App\User');
    }

    public function Address()
    {
        return $this->belongsTo('App\Address');
    }

    public function Addresses()
    {
        return $this->hasMany('App\Address');
    }

    public function Products()
    {
        return $this->hasMany('App\Product');
    }

    public function Comments()
    {
        return $this->hasMany('App\Comment');
    }

    protected $fillable= ['user_id', 'address_id', 'status_id', 'contact_at', 'source_id', 'salesstaff_bg_id', 'salesstaff_fg_id', 'gclid'];
}
