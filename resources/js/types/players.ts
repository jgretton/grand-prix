export type PlayerScore = {
    id: number;
    player_id: number;
    tournament_id: number;
    score: number;
    attended: boolean;
};

export type Player = {
    id?: number;
    name: string;
    is_active: boolean;
    player_scores?: PlayerScore[];
    player_scores_sum_score?: number;
    rank?: number;
};

export type Players = Player[];

export type PlayerTeams = {
    id: number;
    player_id: number;
    team_id: number;
    player: Player;
};

export type Team = {
    id?: string;
    name: string;
    players: Players;
    player_teams: PlayerTeams[];
};
