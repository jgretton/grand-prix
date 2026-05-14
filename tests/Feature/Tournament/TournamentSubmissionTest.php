<?php

use App\Models\Season;
use App\Models\Team;
use App\Models\Tournament;
use App\Models\User;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\post;

describe('Authorised User', function () {
    beforeEach(function () {
        $this->actingAs(User::factory()->create());

        $this->season = Season::factory()->create();
        $this->tournament = Tournament::factory()->create(['season_id' => $this->season->id]);
        $this->teamOne = Team::factory()->create(['tournament_id' => $this->tournament->id]);
        $this->teamTwo = Team::factory()->create(['tournament_id' => $this->tournament->id]);
    });
    test('can create tournament submission', function () {

        $response = post('/tournaments/'.$this->tournament->id.'/submit', [
            'rounds' => [
                [
                    'round_number' => 1,
                    'round_scores' => [
                        ['team_id' => $this->teamOne->id, 'score' => 21],
                        ['team_id' => $this->teamTwo->id, 'score' => 15],
                    ],
                ],
                [
                    'round_number' => 2,
                    'round_scores' => [
                        ['team_id' => $this->teamOne->id, 'score' => 18],
                        ['team_id' => $this->teamTwo->id, 'score' => 21],
                    ],
                ],
            ],
        ]);

        assertDatabaseHas('rounds', ['round_number' => 1, 'tournament_id' => $this->tournament->id]);
        assertDatabaseHas('round_scores', ['team_id' => $this->teamOne->id, 'score' => 21]);
        assertDatabaseHas('round_scores', ['team_id' => $this->teamTwo->id, 'score' => 15]);
        assertDatabaseHas('round_scores', ['team_id' => $this->teamOne->id, 'score' => 18]);
        assertDatabaseHas('round_scores', ['team_id' => $this->teamTwo->id, 'score' => 21]);

        assertDatabaseHas('tournaments', ['id' => $this->tournament->id, 'is_completed' => true]);

        $response->assertRedirect();
    });

    describe('Validation', function () {
        test('rounds must be present', function () {});
        test('rounds must not be empty');
        test('round number is required');
        test('round number must be an integer');
        test('round number must be greater than zero');
        test('round scores must be present');
        test('round scores must not be empty');
        test('team id is required');
        test('team id must exist in teams table');
        test('score is required');
        test('score must be an integer');
        test('score cannot be negative');
    });
});
