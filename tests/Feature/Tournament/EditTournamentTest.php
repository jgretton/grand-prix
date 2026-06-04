<?php

use App\Models\Player;
use App\Models\Season;
use App\Models\Tournament;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\patch;
use function Pest\Laravel\post;

pest()->use(RefreshDatabase::class);

describe('Authenticated user', function () {
    beforeEach(function () {
        $this->actingAs(User::factory()->create());
    });
    test('can edit tournament', function () {
        $season = Season::factory()->create();
        Player::factory()->count(5)->create();
        $teams = [['name' => 'Team 1', 'players' => [1, 2, 3]], ['name' => 'Team 2', 'players' => [4, 5]]];
        $tournament = post('/tournaments', ['name' => '26/04/2026', 'season_id' => $season->id, 'teams' => $teams]);

        $tournamentId = Tournament::latest()->first()->id;

        $tournamentEdit = patch('/tournaments/'.$tournamentId, ['name' => '26/04/2026', 'season_id' => $season->id, 'teams' => $teams]);
    });

});
