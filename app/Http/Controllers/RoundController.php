<?php

namespace App\Http\Controllers;

use App\Models\Round;
use App\Models\Tournament;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class RoundController extends Controller
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
    public function store(Request $request, Tournament $tournament)
    {

        $validated = $request->validate([
            'round_number' => ['required', 'integer', 'gt:0', Rule::unique('rounds')->where('tournament_id', $tournament->id)],
        ]);

        Round::create(['round_number' => $validated['round_number'], 'tournament_id' => $tournament->id]);

        return redirect()->route('tournaments.index', $tournament);
    }

    /**
     * Display the specified resource.
     */
    public function show(Round $round)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Round $round)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Round $round)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tournament $tournament, Round $round)
    {
        //
        $round->delete();

        return redirect()->back();
    }
}
