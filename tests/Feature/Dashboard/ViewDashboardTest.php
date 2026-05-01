<?php

use App\Models\Season;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

pest()->use(RefreshDatabase::class);

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});
test('return current season when no query parameter is provided', function () {
    $season = Season::factory()->isCurrent()->create();

    $response = $this->get(route('dashboard'));

    $response->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->where('season.id', $season->id)
    );

});

test('return selected season when query parameter is provided', function () {
    $current = Season::factory()->isCurrent()->create(['name' => '2001/2002']);
    $selected = Season::factory()->create();

    $response = $this->get(route('dashboard', ['season' => $selected->id]));

    $response->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->where('season.id', $selected->id)
    );
});
