export type Season = {
    id: number;
    name: string;
    is_current: boolean;
    tournaments?: Tournaments[];
};

export type Tournaments = {
    id: number;
    name: string;
    season_id: number;
};

export type Seasons = Season[];
