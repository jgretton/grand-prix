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
        Schema::table('round_scores', function (Blueprint $table) {
            $table->dropForeign(['round_id']);
            $table->foreign('round_id')->references('id')->on('rounds')->cascadeOnDelete();
            $table->dropForeign(['team_id']);
            $table->foreign('team_id')->references('id')->on('teams')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('round_scores', function (Blueprint $table) {
            $table->dropForeign(['round_id']);
            $table->foreign('round_id')->references('id')->on('rounds');
            $table->dropForeign(['team_id']);
            $table->foreign('team_id')->references('id')->on('teams');
        });
    }
};
