export type Player = {
    id?: number;
    name: string;
    is_active: boolean;
};

export type Players = Player[];

export type Team = {
    id?: string;
    name: string;
    players: Players;
};
