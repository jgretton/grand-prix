<?php

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
    test('can create a season', function () {

        $response = post('/seasons', ['name' => '23/24', 'is_current' => true]);
        assertDatabaseHas('seasons', ['name' => '23/24', 'is_current' => true]);
        $response->assertRedirect('/dashboard');
    });
    describe('Season Creation Validation', function () {

        test('name field is required', function () {
            $response = post('/seasons', ['is_current' => true]);
            $response->assertInvalid(['name']);
        });
        test('is_current field is required', function () {
            $response = post('/seasons', ['name' => '23/24']);
            $response->assertInvalid(['is_current']);
        });
        test('name field is unique', function () {
            post('/seasons', ['name' => '23/24', 'is_current' => true]);
            $response = post('/seasons', ['name' => '23/24', 'is_current' => true]);
            $response->assertInvalid(['name']);
        });
        test('name field is a string', function () {
            $response = post('/seasons', ['name' => 1, 'is_current' => true]);
            $response->assertInvalid(['name']);
        });
    });

    test('setting a new season deactivates the current one', function () {
        post('/seasons', ['name' => '23/24', 'is_current' => true]);
        post('/seasons', ['name' => '23/25', 'is_current' => true]);

        assertDatabaseHas('seasons', ['name' => '23/24', 'is_current' => false]);
        assertDatabaseHas('seasons', ['name' => '23/25', 'is_current' => true]);

    });

});
describe('Unauthenticated user', function () {

    test('cannot create a season', function () {
        $response = post('/seasons', ['name' => '23/24', 'is_current' => true]);
        assertDatabaseMissing('seasons', ['name' => '23/24', 'is_current' => true]);
        $response->assertRedirect('/login');
    });
});

describe('Get request', function () {
    test('for season data', function () {});
});
