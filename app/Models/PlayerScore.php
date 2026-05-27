<?php

namespace App\Models;

use Database\Factories\PlayerScoreFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlayerScore extends Model
{
    /** @use HasFactory<PlayerScoreFactory> */
    use HasFactory;

    protected $fillable = ['attended', 'score', 'player_id', 'tournament_id'];

    protected function casts(): array
    {
        return [
            'attended' => 'boolean',
        ];
    }
}
