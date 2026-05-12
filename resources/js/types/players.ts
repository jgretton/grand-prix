export type Player = {
    id?: number;
    name: string;
    is_active: boolean;
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
