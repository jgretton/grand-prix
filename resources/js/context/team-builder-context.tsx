import { createContext, useContext, useState } from 'react';
import type { Player, Players, Team } from '@/types/players';

const initialTeams: Team[] = [
    {
        id: crypto.randomUUID(),
        name: 'Team 1',
        players: [],
    },
];

interface TeamBuilderProviderProps {
    activePlayers: Players;
    children: React.ReactNode;
}

interface TeamBuilderContextType {
    teams: Team[];
    availablePlayers: Players;
    addTeam: () => void;
    removeTeam: (teamId: string) => void;
    addPlayersToTeam: (teamId: string, players: Player[]) => void;
    removePlayerFromTeam: (teamId: string, playerId: number) => void;
    movePlayerToTeam: (
        targetTeamId: string,
        playerId: number,
        initialTeamId: string,
    ) => void;
}

const TeamBuilderContext = createContext<TeamBuilderContextType | null>(null);

export function TeamBuilderProvider({
    activePlayers,
    children,
}: TeamBuilderProviderProps) {
    const [teams, setTeams] = useState<Team[]>(initialTeams);

    const availablePlayers = activePlayers.filter(
        (player) =>
            !teams.some((team) => team.players.some((p) => p.id === player.id)),
    );

    const addTeam = () => {
        setTeams((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                name: `Team ${teams.length + 1}`,
                players: [],
            },
        ]);
    };

    const removeTeam = (teamId: string) => {
        const updatedTeams = teams
            .filter((a) => a.id !== teamId)
            .map((team, idx) => ({ ...team, name: `Team ${idx + 1}` }));

        setTeams(updatedTeams);
    };

    const addPlayersToTeam = (teamId: string, players: Player[]) => {
        setTeams((prev) =>
            prev.map((team) =>
                team.id === teamId
                    ? { ...team, players: [...team.players, ...players] }
                    : team,
            ),
        );
    };

    const removePlayerFromTeam = (teamId: string, playerId: number) => {
        setTeams((prev) =>
            prev.map((team) =>
                team.id === teamId
                    ? {
                          ...team,
                          players: team.players.filter(
                              (player) => player.id !== playerId,
                          ),
                      }
                    : team,
            ),
        );
    };

    const movePlayerToTeam = (
        targetTeamId: string,
        playerId: number,
        initialTeamId: string,
    ) => {
        if (targetTeamId === initialTeamId) {
return;
}

        const player = teams
            .find((team) => team.id === initialTeamId)
            ?.players.find((player) => player.id === playerId);

        if (!player) {
            return;
        }

        setTeams((prev) =>
            prev.map((team) =>
                team.id === initialTeamId
                    ? {
                          ...team,
                          players: team.players.filter(
                              (p) => p.id !== player?.id,
                          ),
                      }
                    : team.id === targetTeamId
                      ? { ...team, players: [...team.players, player] }
                      : team,
            ),
        );
    };

    return (
        <TeamBuilderContext.Provider
            value={{
                teams,
                availablePlayers,
                addTeam,
                removeTeam,
                addPlayersToTeam,
                removePlayerFromTeam,
                movePlayerToTeam,
            }}
        >
            {children}
        </TeamBuilderContext.Provider>
    );
}

export function useTeamBuilderContext() {
    const context = useContext(TeamBuilderContext);

    if (!context) {
        throw new Error(
            'useTeamBuilderContext must be used within a TeamBuilderProvider',
        );
    }

    return context;
}
