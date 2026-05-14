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
}
