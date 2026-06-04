<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('player_scores', function (Blueprint $table) {
            $table->dropForeign(['tournament_id']);
            $table->foreign('tournament_id')->references('id')->on('tournaments')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('player_scores', function (Blueprint $table) {
            $table->dropForeign(['tournament_id']);
            $table->foreign('tournament_id')->references('id')->on('tournaments');
        });
    }
};
