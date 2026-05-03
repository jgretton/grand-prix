<?php

use App\Models\Player;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

pest()->use(RefreshDatabase::class);

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

test('return player list for authenticated user', function () {
    $player = Player::factory()->create();

    $response = $this->get(route('players.index'));

    $response->assertInertia(fn ($page) => $page->component('players/index')->has('players', 1));
});
