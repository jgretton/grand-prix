<?php

use App\Models\Player;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\patch;

pest()->use(RefreshDatabase::class);

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

test('can toggle a players active state', function () {
    $player = Player::factory()->isActive()->create();
    $response = patch(route('players.toggle-active', $player));

    assertDatabaseHas('players', ['id' => $player->id, 'is_active' => false]);

    $response->assertRedirect();
});

test('can update players name', function () {
    $player = Player::factory()->isActive()->create();

    $response = patch(route('players.update', $player), ['name' => 'Updated Name']);

    assertDatabaseHas('players', ['id' => $player->id, 'name' => 'Updated Name']);

    $response->assertRedirect();

});
