<?php

namespace App\Http\Controllers;

use App\Models\Round;
use App\Models\RoundScore;
use App\Models\Tournament;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class RoundScoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Tournament $tournament, Round $round)
    {
        //

        $validated = $request->validate([
            'team_id' => ['required', 'exists:teams,id', Rule::unique('round_scores')->where('round_id', $round->id)->where('team_id', $request->team_id)],
            'score' => 'required|integer|min:0',
        ]);

        RoundScore::create([
            'round_id' => $round->id,
            'team_id' => $validated['team_id'],
            'score' => $validated['score'],
        ]);

        return redirect()->back();
    }

    /**
     * Display the specified resource.
     */
    public function show(RoundScore $roundScore)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RoundScore $roundScore)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, RoundScore $roundScore)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RoundScore $roundScore)
    {
        //
    }
}
