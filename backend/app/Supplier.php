<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{

    protected $fillable = [
        'supplier','supplier_number','active', 'row_id'
    ];
}
