<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SeasonController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::post('/seasons', [SeasonController::class, 'store']);
});

require __DIR__.'/settings.php';
