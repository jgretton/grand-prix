<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('player_scores', function (Blueprint $table) {
            $table->unique(['player_id', 'tournament_id']);
        });
    }

    public function down(): void
    {
        Schema::table('player_scores', function (Blueprint $table) {
            $table->dropUnique(['player_id', 'tournament_id']);
        });
    }
};