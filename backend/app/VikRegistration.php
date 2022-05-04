<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class VikRegistration extends Model
{

    protected $fillable = [
        'game_date',
        'game_id',
        'guest_id',
        'registration_datetime',
        'cancelation_datetime',
        'isMember',
        'registration_rank',
        'inserter'
    ];
}
