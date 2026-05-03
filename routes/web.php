<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PlayerController;
use App\Http\Controllers\SeasonController;
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
    // Route::post('/players/create', [PlayerController::class, 'store']);
});

require __DIR__.'/settings.php';
