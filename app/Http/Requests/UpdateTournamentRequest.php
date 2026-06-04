<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTournamentRequest extends FormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:190',
            'season_id' => 'required|exists:seasons,id',
            'teams' => 'sometimes|array|min:2',
            'teams.*.name' => 'required_with:teams|string',
            'teams.*.players' => 'required_with:teams|array',
            'teams.*.players.*' => 'required|integer|exists:players,id',
        ];
    }

    public function messages(): array
    {
        return [
            'teams.*.players.required_with' => 'You need to add players to the teams',
            'name.required' => 'Tournament name is required',
            'teams.min' => 'You need at least 2 teams',
        ];
    }
}