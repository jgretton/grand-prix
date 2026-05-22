<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreTournamentRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:190',
            'season_id' => 'required|exists:seasons,id',
            'teams' => 'required|array|min:2',
            'teams.*.name' => 'required|string',
            'teams.*.players' => 'required|array',
            'teams.*.players.*' => 'required|integer|exists:players,id',
        ];
    }

    public function messages(): array
    {
        return [
            'teams.*.players.required' => 'You need to add players to the teams',
            'name.required' => 'Tournament name is required',
            'teams.required' => 'You need to add a team',
            'teams.min' => 'You need at least 2 teams',
        ];
    }
}
