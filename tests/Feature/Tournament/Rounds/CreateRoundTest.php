<?php

use App\Models\Season;
use App\Models\Tournament;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\assertDatabaseCount;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\post;

pest()->use(RefreshDatabase::class);

describe('Authorised user', function () {

    beforeEach(function () {
        $this->actingAs(User::factory()->create());
    });
    test('can create round', function () {
        $season = Season::factory()->create();
        $tournament = Tournament::factory()->create(['season_id' => $season->id]);

        $respone = post('/tournaments/'.$tournament->id.'/rounds', ['round_number' => 1]);

        assertDatabaseHas('rounds', ['round_number' => 1, 'tournament_id' => $tournament->id]);

        $respone->assertRedirect();

    });

    describe('Validation check', function () {
        test('for round_number is greater than 0', function () {
            $season = Season::factory()->create();
            $tournament = Tournament::factory()->create(['season_id' => $season->id]);

            $respone = post('/tournaments/'.$tournament->id.'/rounds', ['round_number' => 0]);

            $respone->assertInvalid(['round_number']);

            $respone->assertRedirect();
        });
        test('for round_number is an integer', function () {
            $season = Season::factory()->create();
            $tournament = Tournament::factory()->create(['season_id' => $season->id]);

            $respone = post('/tournaments/'.$tournament->id.'/rounds', ['round_number' => 'test']);

            $respone->assertInvalid(['round_number']);

            $respone->assertRedirect();
        });
        test('for round_number is required', function () {
            $season = Season::factory()->create();
            $tournament = Tournament::factory()->create(['season_id' => $season->id]);

            $respone = post('/tournaments/'.$tournament->id.'/rounds', []);

            $respone->assertInvalid(['round_number']);

            $respone->assertRedirect();
        });
        test('round number is unique to tournament', function () {
            $season = Season::factory()->create();
            $tournament = Tournament::factory()->create(['season_id' => $season->id]);

            post('/tournaments/'.$tournament->id.'/rounds', ['round_number' => 1]);

            $response = post('/tournaments/'.$tournament->id.'/rounds', ['round_number' => 1]);

            $response->assertSessionHasErrors(['round_number']);

            assertDatabaseCount('rounds', 1);

        });
    });
});
