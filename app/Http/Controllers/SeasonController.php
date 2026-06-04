<?php

namespace App\Http\Controllers;

use App\Models\Season;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SeasonController extends Controller
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
    public function store(Request $request)
    {

        $validated = $request->validate([
            'name' => 'required|string|max:190|unique:seasons',
            'is_current' => 'required|boolean',
        ]);

        try {
            DB::beginTransaction();

            if (! Season::exists()) {
                $validated['is_current'] = true;
            }

            // check if there is a current season
            $currentSeason = Season::where('is_current', true)->first();

            if ($validated['is_current'] === true && $currentSeason) {
                $currentSeason->update(['is_current' => false]);
            }

            $season= Season::create($validated);

            DB::commit();

            Inertia::flash('toast', ['type' => 'success', 'message' => 'Season created.']);

            return redirect()->route('dashboard', ['season' => $season->id]);
        } catch (\Exception $e) {
            // DB::rollBack();
            Log::error('Unexpected error: '.$e->getMessage());

            return response()->json(['error' => 'An unexpected error occurred'], 500);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(Season $season)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Season $season)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Season $season)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Season $season)
    {
        //

        if ($season->is_current === true) {
            return redirect()->route('dashboard')->withErrors(['seasonError' => 'The active season cannot be deleted.']);

        } else {
            $season->delete();

            Inertia::flash('toast', ['type' => 'success', 'message' => 'Season deleted.']);

            return redirect()->route('dashboard');
        }
    }

    public function setCurrent(Season $season)
    {
        // dd($season);/

        if ($season->is_current === true) {
            return redirect()->route('dashboard')->withErrors(['error' => 'This is already the current season.']);
        } else {

            try {
                DB::beginTransaction();
                // find current season, set to false, set sent season to true.

                $currentSeason = Season::where('is_current', true)->firstOrFail();

                $currentSeason->update(['is_current' => false]);

                $season->update(['is_current' => true]);

                DB::commit();

                Inertia::flash('toast', ['type' => 'success', 'message' => 'Active season updated.']);

                return redirect()->route('dashboard');
            } catch (\Exception $e) {
                DB::rollBack();
                Log::error('Unexpected error: '.$e->getMessage());

                return response()->json(['error' => 'An unexpected error occurred'], 500);
            }
        }
    }
}
