<?php

use App\Models\Season;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\patch;
use function Pest\Laravel\post;

pest()->use(RefreshDatabase::class);

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});
test('set new current season', function () {
    $season = Season::factory()->create();

    $seasonIsCurrent = Season::factory()->isCurrent()->create(['name' => '2000/2001']);

    $response = patch(route('season.set-current', $season));

    assertDatabaseHas('seasons', ['id' => $seasonIsCurrent->id, 'is_current' => false]);
    assertDatabaseHas('seasons', ['id' => $season->id, 'is_current' => true]);

    $response->assertRedirect('/dashboard');

    // create not current season and is current season
    // post to set is current with the season id
    // check if the iscurent is now false and the season is now set to is current.
    // check for redirect.

});
