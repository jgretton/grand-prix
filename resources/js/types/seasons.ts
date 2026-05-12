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
};

export type Seasons = Season[];
