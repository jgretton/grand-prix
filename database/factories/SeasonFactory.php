<?php

namespace Database\Factories;

use App\Models\Season;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Season>
 */
class SeasonFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            //
            'name' => '2025/2026',
            'is_current' => false,
        ];
    }

    public function isCurrent(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'is_current' => true,
            ];
        });
    }
}
