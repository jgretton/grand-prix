<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Team extends Model
{
    //
    use HasFactory;

    protected $fillable = ['name', 'tournament_id'];

    public function tournament(): BelongsTo
    {
        return $this->belongsTo(Tournament::class);
    }

    public function playerTeams(): HasMany
    {
        return $this->hasMany(PlayerTeam::class);
    }

    public function roundScores(): HasMany
    {
        return $this->hasMany(RoundScore::class);
    }
}
