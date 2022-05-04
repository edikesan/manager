<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Vik_Schedule extends Model
{

    protected $fillable = [
        'game_id',
        'game_date',
        'game_type',
        'game_datetime',
        'status',
        'vikUpdater'
    ];
}
