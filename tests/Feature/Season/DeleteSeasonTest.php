<?php

use App\Models\Season;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\delete;

pest()->use(RefreshDatabase::class);

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});
test('Delete season', function () {
    $season = Season::factory()->create();

    $response = delete('/seasons/'.$season->id);

    assertDatabaseMissing('seasons', ['id' => $season->id]);

    $response->assertRedirect('/dashboard');

});

test('Cannot delete current season', function () {
    // test to see if the data is still there, and a reponse is sent that cannot be deleted dude to being current season.
    $season = Season::factory()->isCurrent()->create();

    $response = delete('/seasons/'.$season->id);

    assertDatabaseHas('seasons', ['id' => $season->id]);

    $response->assertSessionHasErrors(['seasonError' => 'The current season cannot be deleted.']);

    $response->assertRedirect('/dashboard');

});
