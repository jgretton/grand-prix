<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTournamentRequest;
use App\Models\Player;
use App\Models\PlayerTeam;
use App\Models\Season;
use App\Models\Team;
use App\Models\Tournament;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TournamentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return Inertia::render('tournaments.index', []);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        $activePlayers = Player::where('is_active', true)->select(['name', 'id', 'is_active'])->get();

        $seasons = Season::get(['id', 'name', 'is_current']);

        return Inertia::render('tournaments/create/index', [
            'activePlayers' => $activePlayers,
            'seasons' => $seasons,
        ]);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTournamentRequest $request)
    {
        try {
            DB::beginTransaction();
            $validated = $request->validated();
            $tournament = Tournament::create(['name' => $validated['name'], 'season_id' => $validated['season_id']]);

            // map over the teams, add the teams names.

            foreach ($validated['teams'] as $team) {

                $createdTeam = Team::create(['name' => $team['name'], 'tournament_id' => $tournament->id]);

                foreach ($team['players'] as $player) {
                    PlayerTeam::create(['team_id' => $createdTeam->id, 'player_id' => $player]);
                }
            }
            DB::commit();

            return redirect()->route('dashboard');
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(Tournament $tournament)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tournament $tournament)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tournament $tournament)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tournament $tournament)
    {
        //
    }
}
