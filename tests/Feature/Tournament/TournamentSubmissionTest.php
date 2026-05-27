<?php

use App\Models\Player;
use App\Models\PlayerTeam;
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
        $this->player = Player::factory()->isActive()->create();
        $this->teamOne = Team::factory()->create(['tournament_id' => $this->tournament->id]);
        $this->teamTwo = Team::factory()->create(['tournament_id' => $this->tournament->id]);
        $this->playerTeam = PlayerTeam::factory()->create(['player_id' => $this->player->id, 'team_id' => $this->teamOne->id]);
    });
    test('can create tournament submission', function () {

        $absentPlayer = Player::factory()->isActive()->create();

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

        assertDatabaseHas('player_scores', ['score' => 39, 'player_id' => $this->player->id]);
        assertDatabaseHas('player_scores', ['score' => 0, 'player_id' => $absentPlayer->id, 'attended' => false]);

        $response->assertRedirect();
    });

    describe('Validation', function () {
        test('cannot submit a completed tournament', function () {
            $this->tournament->update(['is_completed' => true]);

            $response = post('/tournaments/'.$this->tournament->id.'/submit', [
                'rounds' => [
                    [
                        'round_number' => 1,
                        'round_scores' => [
                            ['team_id' => $this->teamOne->id, 'score' => 21],
                            ['team_id' => $this->teamTwo->id, 'score' => 15],
                        ],
                    ],
                ],
            ]);

            $response->assertSessionHasErrors(['tournament' => 'This tournament has already been submitted']);
        });
        test('rounds must be present', function () {
            $response = post('/tournaments/'.$this->tournament->id.'/submit', []);

            $response->assertInvalid(['rounds']);
        });
        test('rounds must not be empty', function () {
            $response = post('/tournaments/'.$this->tournament->id.'/submit', [
                'rounds' => [],
            ]);

            $response->assertInvalid(['rounds']);
        });
        test('round number is required', function () {
            $response = post('/tournaments/'.$this->tournament->id.'/submit', [
                'rounds' => [
                    [
                        'round_scores' => [
                            ['team_id' => $this->teamOne->id, 'score' => 21],
                            ['team_id' => $this->teamTwo->id, 'score' => 15],
                        ],
                    ],
                ],
            ]);

            $response->assertInvalid(['rounds.0.round_number']);
        });
        test('round number must be an integer', function () {
            $response = post('/tournaments/'.$this->tournament->id.'/submit', [
                'rounds' => [
                    [
                        'round_number' => 'one',
                        'round_scores' => [
                            ['team_id' => $this->teamOne->id, 'score' => 21],
                            ['team_id' => $this->teamTwo->id, 'score' => 15],
                        ],
                    ],
                ],
            ]);

            $response->assertInvalid(['rounds.0.round_number']);
        });
        test('round number must be greater than zero', function () {
            $response = post('/tournaments/'.$this->tournament->id.'/submit', [
                'rounds' => [
                    [
                        'round_number' => 0,
                        'round_scores' => [
                            ['team_id' => $this->teamOne->id, 'score' => 21],
                            ['team_id' => $this->teamTwo->id, 'score' => 15],
                        ],
                    ],
                ],
            ]);

            $response->assertInvalid(['rounds.0.round_number']);
        });
        test('round scores must be present', function () {
            $response = post('/tournaments/'.$this->tournament->id.'/submit', [
                'rounds' => [
                    [
                        'round_number' => 1,
                    ],
                ],
            ]);

            $response->assertInvalid(['rounds.0.round_scores']);
        });
        test('round scores must not be empty', function () {
            $response = post('/tournaments/'.$this->tournament->id.'/submit', [
                'rounds' => [
                    [
                        'round_number' => 1,
                        'round_scores' => [],
                    ],
                ],
            ]);

            $response->assertInvalid(['rounds.0.round_scores']);
        });
        test('team id is required', function () {
            $response = post('/tournaments/'.$this->tournament->id.'/submit', [
                'rounds' => [
                    [
                        'round_number' => 1,
                        'round_scores' => [
                            ['score' => 21],
                        ],
                    ],
                ],
            ]);

            $response->assertInvalid(['rounds.0.round_scores.0.team_id']);
        });
        test('team id must exist in teams table', function () {
            $response = post('/tournaments/'.$this->tournament->id.'/submit', [
                'rounds' => [
                    [
                        'round_number' => 1,
                        'round_scores' => [
                            ['team_id' => 99999, 'score' => 21],
                        ],
                    ],
                ],
            ]);

            $response->assertInvalid(['rounds.0.round_scores.0.team_id']);
        });
        test('score is required', function () {
            $response = post('/tournaments/'.$this->tournament->id.'/submit', [
                'rounds' => [
                    [
                        'round_number' => 1,
                        'round_scores' => [
                            ['team_id' => $this->teamOne->id],
                        ],
                    ],
                ],
            ]);

            $response->assertInvalid(['rounds.0.round_scores.0.score']);
        });
        test('score must be an integer', function () {
            $response = post('/tournaments/'.$this->tournament->id.'/submit', [
                'rounds' => [
                    [
                        'round_number' => 1,
                        'round_scores' => [
                            ['team_id' => $this->teamOne->id, 'score' => 'twenty'],
                        ],
                    ],
                ],
            ]);

            $response->assertInvalid(['rounds.0.round_scores.0.score']);
        });
        test('score cannot be negative', function () {
            $response = post('/tournaments/'.$this->tournament->id.'/submit', [
                'rounds' => [
                    [
                        'round_number' => 1,
                        'round_scores' => [
                            ['team_id' => $this->teamOne->id, 'score' => -1],
                        ],
                    ],
                ],
            ]);

            $response->assertInvalid(['rounds.0.round_scores.0.score']);
        });
        test('all teams must have a score in each round', function () {
            $response = post('/tournaments/'.$this->tournament->id.'/submit', [
                'rounds' => [
                    [
                        'round_number' => 1,
                        'round_scores' => [
                            ['team_id' => $this->teamOne->id, 'score' => 21],
                        ],
                    ],
                ],
            ]);

            $response->assertSessionHasErrors(['rounds.allTeams' => 'All teams require a score']);
        });
    });
});
