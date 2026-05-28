<?php

namespace App\Http\Controllers;

use App\Models\Player;
use App\Models\Season;
use App\Models\Tournament;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaderboardController extends Controller
{
    // 7

    public function index(Request $request)
    {
        $season = $request->has('season') ? Season::where('id', request()->season)->select(['id', 'name', 'is_current'])->first() : Season::where('is_current', true)->select(['id', 'name', 'is_current'])->first();

        $seasons = Season::get(['id', 'name', 'is_current']);

        if (! $season) {
            return Inertia::render('leaderboard/index', [
                'season' => null,
                'seasons' => $seasons,
                'tournament' => [],
                'players' => [],
            ]);
        }

        $tournament = Tournament::where('season_id', $season->id)->where('is_completed', true)->get();
        $players = Player::whereHas('playerScores', function ($query) use ($season) {
            $query->where('attended', true)
                ->whereHas('tournament', function ($query) use ($season) {
                    $query->where('season_id', $season->id);
                });
        })
            ->with(['playerScores' => function ($query) use ($season) {
                $query->whereHas('tournament', function ($query) use ($season) {
                    $query->where('season_id', $season->id);
                });
            }])
            ->withSum(['playerScores' => function ($query) use ($season) {
                $query->whereHas('tournament', function ($query) use ($season) {
                    $query->where('season_id', $season->id);
                });
            }], 'score')
            ->orderByDesc('player_scores_sum_score')
            ->get();

        // add rankings to players.

        $rank = 1;
        $previousScore = null;

        $players = $players->map(function ($player) use (&$rank, &$previousScore) {
            if ($previousScore !== null && $player->player_scores_sum_score < $previousScore) {
                $rank++;
                $player->rank = $rank;
                $previousScore = $player->player_scores_sum_score;
            } else {
                $player->rank = $rank;
                $previousScore = $player->player_scores_sum_score;
            }

            return $player;
        });

        return Inertia::render('leaderboard/index', [
            'season' => $season,
            'seasons' => $seasons,
            'tournament' => $tournament,
            'players' => $players,
        ]);
    }
}
