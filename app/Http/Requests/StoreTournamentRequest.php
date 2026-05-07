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
            'season_id' => 'exists:seasons,id|required',
            'teams' => 'array|required',
            'teams.name' => 'string|required',
            'teams.players' => 'array|required',
            'teams.players.*' => 'exists:players,id|integer',
        ];
    }
}
