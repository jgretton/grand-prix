<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTournamentSubmissionRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'rounds' => 'required|array|min:1',
            'rounds.*.round_number' => 'required|integer|gt:0',
            'rounds.*.round_scores' => 'required|array|min:1',
            'rounds.*.round_scores.*.team_id' => 'required|exists:teams,id',
            'rounds.*.round_scores.*.score' => 'required|integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'rounds.min' => 'You need to submit at least one round',
            'rounds.*.round_scores.*.score.required' => 'Scores are required',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }
            // fetch the teams from this tournamnet
            $tournament = $this->route('tournament');

            // pluck takes out only the ids.
            // to array turns it into a plain php array from a laravel collection.
            $expectedTeamIds = $tournament->teams->pluck('id')->toArray();
            sort($expectedTeamIds);

            // loop over the rounds input
            // pluck out the team ids as these are the ones submitted in the post request
            // map over them and convert them to ints
            // sort them the same as the expected team ids then we know the values will match up
            // check if the arrays are the same and if not then return the error response and message.

            if ($tournament->is_completed) {
                $validator->errors()->add('tournament', 'This tournament has already been submitted');
            }

            foreach ($this->input('rounds', []) as $index => $round) {

                $submittedTeamIds = collect($round['round_scores'])->pluck('team_id')->map(fn ($id) => (int) $id)->sort()->values()->toArray();
                if ($expectedTeamIds !== $submittedTeamIds) {
                    $missingTeamIds = array_diff($expectedTeamIds, $submittedTeamIds);
                    foreach ($missingTeamIds as $teamId) {
                        $validator->errors()->add("rounds.{$index}.round_scores.{$teamId}", 'Score required');
                    }
                    $validator->errors()->add('rounds.allTeams', 'All teams require a score');
                }
            }

        });
    }
}
