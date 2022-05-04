<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SupplierProduct extends Model
{

    protected $fillable = [
        'product_name','row_id','active'
    ];
}
