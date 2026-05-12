<?php

namespace App\Http\Controllers;

use App\Models\Season;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $season = $request->has('season') ? Season::where('id', request()->season)->with('tournaments.teams.playerTeams')->first() : Season::where('is_current', true)->select(['id', 'name', 'is_current'])->with('tournaments.teams.playerTeams')->first();

        $seasons = Season::get(['id', 'name', 'is_current']);

        return Inertia::render('dashboard', [
            'season' => $season,
            'seasons' => $seasons,
        ]);
    }
}
