<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Season extends Model
{
    //
    use HasFactory;

    protected $fillable = ['name', 'is_current'];

    protected function casts(): array
    {
        return [
            'is_current' => 'boolean',
        ];
    }

    public function tournaments(): HasMany
    {
        return $this->hasMany(Tournament::class);
    }
}
