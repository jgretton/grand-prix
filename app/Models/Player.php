<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Player extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'is_active'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function playerScores(): HasMany
    {
        return $this->hasMany(PlayerScore::class);
    }

    public function currentSeasonTotal(Season $season): int
    {
        return PlayerScore::where('player_id', $this->id)->whereHas('tournament', function ($query) use ($season) {
            $query->where('season_id', $season->id);
        })->sum('score');
    }

    public function unattendedScore(): int
    {
        $lowestScore = PlayerScore::where('player_id', $this->id)->where('attended', true)->orderBy('score', 'asc')->value('score');

        if ($lowestScore === null || $lowestScore <= 10) {
            return 0;
        }

        return $lowestScore - 10;

    }
}
