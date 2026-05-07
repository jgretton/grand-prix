<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PlayerController;
use App\Http\Controllers\SeasonController;
use App\Http\Controllers\TournamentController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('/seasons', SeasonController::class);
    Route::patch('/seasons/{season}/set-current', [SeasonController::class, 'setCurrent'])->name('season.set-current');

    Route::resource('/players', PlayerController::class);
    Route::patch('/players/{player}/toggle-active', [PlayerController::class, 'toggleActive'])->name('players.toggle-active');

    // Route::post('/tournaments', [TournamentController::class, 'store'])->name('tournament.store');

    Route::resource('tournaments', TournamentController::class);
});

require __DIR__.'/settings.php';
