<?php

use App\Models\Round;
use App\Models\Season;
use App\Models\Team;
use App\Models\Tournament;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;

/**
 * @var Season $season
 * @var Tournament $tournament
 * @var Team $team
 * @var Round $round
 */
describe('Authorised user', function () {

    beforeEach(function () {
        actingAs(User::factory()->create());
        $this->season = Season::factory()->create();
        $this->tournament = Tournament::factory()->create(['season_id' => $this->season->id]);
        $this->team = Team::factory()->create(['tournament_id' => $this->tournament->id]);

        $this->round = Round::factory()->create(['tournament_id' => $this->tournament->id]);

    });

    test('can create roundScore', function () {

        $response = $this->post('/tournaments/'.$this->tournament->id.'/rounds/'.$this->round->id.'/roundscores', ['team_id' => $this->team->id, 'score' => 21]);

        assertDatabaseHas('round_scores', ['team_id' => $this->team->id, 'score' => 21]);

        $response->assertRedirect();

    });
    describe('Validation check', function () {
        test('score cannot be negative', function () {
            $response = $this->post('/tournaments/'.$this->tournament->id.'/rounds/'.$this->round->id.'/roundscores', ['team_id' => $this->team->id, 'score' => -1]);

            $response->assertInvalid(['score']);
        });
        test('score must be an integer', function () {
            $response = $this->post('/tournaments/'.$this->tournament->id.'/rounds/'.$this->round->id.'/roundscores', ['team_id' => $this->team->id, 'score' => 'test']);

            $response->assertInvalid(['score']);
        });
        test('a team cannot have more than one score per round', function () {
            $this->post('/tournaments/'.$this->tournament->id.'/rounds/'.$this->round->id.'/roundscores', ['team_id' => $this->team->id, 'score' => 20]);

            $response = $this->post('/tournaments/'.$this->tournament->id.'/rounds/'.$this->round->id.'/roundscores', ['team_id' => $this->team->id, 'score' => 20]);

            $response->assertSessionHasErrors(['team_id']);
        });

    });

});
