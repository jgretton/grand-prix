<?php

use App\Models\Round;
use App\Models\Season;
use App\Models\Tournament;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\delete;

pest()->use(RefreshDatabase::class);
describe('Authorised user', function () {

    beforeEach(function () {
        $this->actingAs(User::factory()->create());
    });
    test('can delete round', function () {
        $season = Season::factory()->create();
        $tournament = Tournament::factory()->create(['season_id' => $season->id]);

        $round = Round::factory()->create(['tournament_id' => $tournament->id]);

        $response = delete('/tournaments/'.$tournament->id.'/rounds/'.$round->id);

        assertDatabaseMissing('rounds', ['id' => $round->id]);

        $response->assertRedirect();

    });
});
