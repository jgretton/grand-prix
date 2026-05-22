<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTournamentSubmissionRequest;
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

            Tournament::where('id', $tournament->id)->update(['is_completed' => true]);

            DB::commit();

            return redirect()->route('tournaments.show', $tournament);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
