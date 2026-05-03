<?php

use App\Models\Player;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\post;

pest()->use(RefreshDatabase::class);

describe('Authenticated user', function () {
    beforeEach(function () {
        $this->actingAs(User::factory()->create());
    });

    test('can create a player', function () {
        $player = Player::factory()->create();
        $response = post('/players', $player->toArray());

        assertDatabaseHas('players', ['id' => $player->id]);

        $response->assertRedirect('/players');
    });

    describe('Season Creation Validation', function () {

        test('name field is a string', function () {
            $response = post('/players', ['name' => 1, 'is_active' => false]);
            $response->assertInvalid(['name']);
        });
        test('name field is required', function () {
            $response = post('/players', ['is_active' => false]);
            $response->assertInvalid(['name']);
        });
    });
});

// UnAuthenticated user cannot create season.
describe('Unauthenticated user', function () {
    test('cannot create a player', function () {
        $response = post('/players', ['name' => 'Josh', 'is_active' => false]);
        assertDatabaseMissing('players', ['name' => 'Josh']);
        $response->assertRedirect('/login');
    });
});
