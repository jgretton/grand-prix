<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\PlayerController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\SeasonController;
use App\Http\Controllers\TournamentController;
use App\Http\Controllers\TournamentSubmissionController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PublicController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('/seasons', SeasonController::class);
    Route::patch('/seasons/{season}/set-current', [SeasonController::class, 'setCurrent'])->name('season.set-current');

    Route::resource('/players', PlayerController::class);
    Route::get('/players/{player}', [PlayerController::class, 'show'])->name('player.show');
    Route::patch('/players/{player}/toggle-active', [PlayerController::class, 'toggleActive'])->name('players.toggle-active');

    Route::resource('tournaments', TournamentController::class);
    Route::post('/tournaments/{tournament}/submit', TournamentSubmissionController::class);

    Route::get('/leaderboard', [LeaderboardController::class, 'index'])->name('leaderboard');
});

require __DIR__.'/settings.php';
