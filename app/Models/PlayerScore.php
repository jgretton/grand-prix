<?php

namespace App\Models;

use Database\Factories\PlayerScoreFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

    public function tournament(): BelongsTo
    {
        return $this->belongsTo(Tournament::class);
    }

    public function player(): BelongsTo
    {
        return $this->belongsTo(Player::class);
    }
}