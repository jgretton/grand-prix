<?php

use App\Models\Player;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\delete;

pest()->use(RefreshDatabase::class);

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

test('can delete player', function () {
    $player = Player::factory()->create();

    $response = delete('/players/'.$player->id);

    assertDatabaseMissing('players', ['id' => $player->id]);

    $response->assertRedirect();
});
