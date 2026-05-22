import { Team } from './players';

export type Season = {
    id: number;
    name: string;
    is_current: boolean;
    tournaments?: Tournament[];
};

export type Tournament = {
    id: number;
    name: string;
    season_id: number;
    player_count?: number;
    teams?: Team[];
    rounds: Round[];
    is_completed: boolean;
    season?: Season;
};

export type Round = {
    id?: number;
    round_number: number;
    tournament_id?: number;
    round_scores: RoundScore[];
};

export type RoundScore = {
    id?: number;
    team_id: number;
    round_id?: number;
    score: number;
};
export type FinalScore = {
    team: Team;
    final_score: number;
    round_scores: RoundScore[];
};

export type Seasons = Season[];
