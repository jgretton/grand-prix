<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTournamentSubmissionRequest;
use App\Models\Player;
use App\Models\PlayerScore;
use App\Models\Round;
use App\Models\RoundScore;
use App\Models\Tournament;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TournamentSubmissionController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(StoreTournamentSubmissionRequest $request, Tournament $tournament)
    {
        try {
            DB::beginTransaction();

            $validated = $request->validated();

            foreach ($validated['rounds'] as $round) {
                $createdRound = Round::create([
                    'round_number' => $round['round_number'],
                    'tournament_id' => $tournament->id,
                ]);

                foreach ($round['round_scores'] as $roundScore) {
                    RoundScore::create([
                        'round_id' => $createdRound->id,
                        'team_id' => $roundScore['team_id'],
                        'score' => $roundScore['score'],
                    ]);
                }
            }

            // loop over each team, get final scores and then loop over players and create player scores
            $attendedPlayers = [];
            foreach ($tournament->teams as $team) {
                $score = $team->finalTournamentScore($tournament);
                foreach ($team->playerTeams as $player) {
                    PlayerScore::create([
                        'tournament_id' => $tournament->id,
                        'attended' => true,
                        'player_id' => $player->player_id,
                        'score' => $score,
                    ]);
                    $attendedPlayers[] = $player->player_id;
                }
            }
            $players = Player::where('is_active', true)->pluck('id')->toArray();
            $absentPlayers = array_diff($players, $attendedPlayers);

            foreach ($absentPlayers as $playerId) {
                $player = Player::find($playerId);
                $score = $player->unattendedScore();
                PlayerScore::create(['attended' => false, 'score' => $score, 'player_id' => $playerId, 'tournament_id' => $tournament->id]);
            }

            Tournament::where('id', $tournament->id)->update(['is_completed' => true]);

            DB::commit();

            return redirect()->route('tournaments.show', $tournament);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
