<?php

use App\Models\Player;
use App\Models\PlayerScore;
use App\Models\Season;
use App\Models\Tournament;

beforeEach(function () {
    $this->season = Season::factory()->create();
    $this->tournament = Tournament::factory()->create(['season_id' => $this->season->id]);
    $this->tournamentTwo = Tournament::factory()->create(['season_id' => $this->season->id]);
    $this->tournamentThree = Tournament::factory()->create(['season_id' => $this->season->id]);
    $this->player = Player::factory()->create();
});

test('returns lowest attended score minus ten', function () {

    PlayerScore::factory()->create([
        'player_id' => $this->player->id,
        'tournament_id' => $this->tournament->id,
        'attended' => true,
        'score' => 25,
    ]);

    expect($this->player->unattendedScore())->toBe(15);
});

test('returns zero when player has no attended scores', function () {
    expect($this->player->unattendedScore())->toBe(0);
});

test('returns zero when lowest attended score is exactly 10', function () {
    PlayerScore::factory()->create([
        'player_id' => $this->player->id,
        'tournament_id' => $this->tournament->id,
        'attended' => true,
        'score' => 10,
    ]);

    expect($this->player->unattendedScore())->toBe(0);
});

test('returns lowest attended score minus ten when multiple scores exist', function () {
    PlayerScore::factory()->create([
        'player_id' => $this->player->id,
        'tournament_id' => $this->tournament->id,
        'attended' => true,
        'score' => 25,
    ]);
    PlayerScore::factory()->create([
        'player_id' => $this->player->id,
        'tournament_id' => $this->tournamentTwo->id,
        'attended' => true,
        'score' => 30,
    ]);
    PlayerScore::factory()->create([
        'player_id' => $this->player->id,
        'tournament_id' => $this->tournamentThree->id,
        'attended' => true,
        'score' => 15,
    ]);

    expect($this->player->unattendedScore())->toBe(5);

});
test('returns zero when lowest attended score is below ten', function () {
    PlayerScore::factory()->create([
        'player_id' => $this->player->id,
        'tournament_id' => $this->tournament->id,
        'attended' => true,
        'score' => 5,
    ]);

    expect($this->player->unattendedScore())->toBe(0);
});
test('ignores unattended scores when calculating result', function () {
    PlayerScore::factory()->create([
        'player_id' => $this->player->id,
        'tournament_id' => $this->tournament->id,
        'attended' => false,
        'score' => 25,
    ]);
    PlayerScore::factory()->create([
        'player_id' => $this->player->id,
        'tournament_id' => $this->tournamentTwo->id,
        'attended' => false,
        'score' => 30,
    ]);
    PlayerScore::factory()->create([
        'player_id' => $this->player->id,
        'tournament_id' => $this->tournamentThree->id,
        'attended' => true,
        'score' => 15,
    ]);

    expect($this->player->unattendedScore())->toBe(5);

});
