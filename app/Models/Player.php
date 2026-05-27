<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    //
    use HasFactory;

    protected $fillable = ['name', 'is_active'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function lowestAttendedScore(): int
    {
        return PlayerScore::where('player_id', $this->id)->where('attended', true)->orderByDesc('score')->value('score') ?? 0;
    }
}
