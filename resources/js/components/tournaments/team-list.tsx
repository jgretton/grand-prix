import { Team } from '@/types/players';

export default function TeamList({
    team,
    borderless,
}: {
    team: Team;
    borderless?: boolean;
}) {
    return (
        <ul
            className={`grid min-w-3xs gap-2 rounded-md p-4 ${borderless ? 'border-none' : 'border'}`}
        >
            <li className="mb-1 text-base font-semibold">{team.name}</li>
            {team.player_teams.map((player) => (
                <li key={player.id} className="text-sm text-muted-foreground">
                    {player.player.name}
                </li>
            ))}
        </ul>
    );
}
