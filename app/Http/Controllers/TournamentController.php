<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTournamentRequest;
use App\Http\Requests\UpdateTournamentRequest;
use App\Models\Player;
use App\Models\PlayerTeam;
use App\Models\Season;
use App\Models\Team;
use App\Models\Tournament;
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
        // return Inertia::render('tournaments/index', []);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        $activePlayers = Player::where('is_active', true)->select(['name', 'id', 'is_active'])->get();

        $seasons = Season::get(['id', 'name', 'is_current']);

        return Inertia::render('tournaments/create', [
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

            Inertia::flash('toast', ['type' => 'success', 'message' => 'Tournament created.']);

            return redirect()->route('tournaments.show', $tournament);
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

        // get final results.
        $finalScores = [];
        if ($tournament->is_completed === true) {

            $t = $tournament->load('rounds.roundScores');
            $finalScores = $t->teams->map(function ($team) {
                return [
                    'team' => $team->only(['id', 'name']),
                    'round_scores' => $team->roundScores,
                    'final_score' => $team->roundScores->sum('score'),
                ];

            });

            $finalScores = $finalScores->sortByDesc('final_score')->values();
        }

        $fullTournament = $tournament->load(['teams.playerTeams.player'])->load('rounds.roundScores')->load('season:id,name');

        return Inertia::render('tournaments/index', [
            'tournament' => $fullTournament,
            'finalScores' => $finalScores,

        ]);

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tournament $tournament)
    {
        //
        $activePlayers = Player::where('is_active', true)->select(['name', 'id', 'is_active'])->get();

        $seasons = Season::get(['id', 'name', 'is_current']);

        return Inertia::render('tournaments/edit', [
            'tournament' => $tournament->load(['teams.playerTeams.player']),
            'seasons' => $seasons,
            'activePlayers' => $activePlayers,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTournamentRequest $request, Tournament $tournament)
    {
        $validated = $request->validated();

        if ($tournament->is_completed) {
            $tournament->update(['name' => $validated['name'], 'season_id' => $validated['season_id']]);

            Inertia::flash('toast', ['type' => 'success', 'message' => 'Tournament updated.']);

            return redirect()->route('tournaments.show', $tournament);
        }

        try {
            DB::beginTransaction();

            $tournament->delete();

            $newTournament = Tournament::create(['name' => $validated['name'], 'season_id' => $validated['season_id']]);

            foreach ($validated['teams'] as $team) {
                $createdTeam = Team::create(['name' => $team['name'], 'tournament_id' => $newTournament->id]);

                foreach ($team['players'] as $player) {
                    PlayerTeam::create(['team_id' => $createdTeam->id, 'player_id' => $player]);
                }
            }

            DB::commit();

            Inertia::flash('toast', ['type' => 'success', 'message' => 'Tournament updated.']);

            return redirect()->route('tournaments.show', $newTournament);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tournament $tournament)
    {
        $seasonId = $tournament->season_id;

        $tournament->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Tournament deleted.']);

        return redirect()->route('dashboard', ['season' => $seasonId]);
    }
}
