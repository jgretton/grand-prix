<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Season extends Model
{
    //
    protected $fillable = ['name', 'is_current'];

    protected function casts(): array
    {
        return [
            'is_current' => 'boolean',
        ];
    }
}
