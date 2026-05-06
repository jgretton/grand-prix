<?php

namespace App\Http\Controllers;

use App\Models\Player;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlayerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //

        $players = Player::all();

        return Inertia::render('players/index', [
            'players' => $players,
        ]);
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
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:190',
            'is_active' => 'boolean',
        ]);

        Player::create($validated);

        return redirect()->route('players.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Player $player)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Player $player)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Player $player)
    {
        //
        $validated = $request->validate([
            'name' => 'required|string|max:190',
        ]);

        $player->update($validated);

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Player $player)
    {
        //
        $player->delete();

        return redirect()->back();
    }

    public function toggleActive(Player $player)
    {
        $player->update(['is_active' => ! $player->is_active]);

        return redirect()->back();
    }
}
