<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoundScore extends Model
{
    //
    protected $fillable = ['round_id', 'team_id', 'score'];
}
