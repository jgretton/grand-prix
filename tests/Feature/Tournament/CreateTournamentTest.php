<?php

use App\Models\Player;
use App\Models\Season;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\post;

pest()->use(RefreshDatabase::class);

describe('Authenticated user', function () {
    beforeEach(function () {
        $this->actingAs(User::factory()->create());
    });
    test('can create tournament', function () {
        $season = Season::factory()->create();
        Player::factory()->count(5)->create();

        $teams = [['name' => 'Team 1', 'players' => [1, 2, 3]], ['name' => 'Team 2', 'players' => [4, 5]]];

        $tournament = post('/tournaments', ['name' => '26/04/2026', 'season_id' => $season->id, 'teams' => $teams]);

        assertDatabaseHas('tournaments', ['name' => '26/04/2026']);
        assertDatabaseHas('teams', ['name' => 'Team 2']);
        assertDatabaseHas('player_teams', ['player_id' => 5]);

        $tournament->assertRedirect();

    });

    describe('Validation check', function () {
        test('for name as string', function () {
            $season = Season::factory()->create();

            $response = post('/tournaments', ['name' => 1, 'season_id' => $season->id]);

            $response->assertInvalid(['name']);
        });

        test('for valid season id', function () {
            $season = Season::factory()->create();

            $response = post('/tournaments', ['name' => 'Test', 'season_id' => 0]);

            $response->assertInvalid(['season_id']);
        });

    });

});
