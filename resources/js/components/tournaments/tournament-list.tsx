import { Link } from '@inertiajs/react';
import { ArrowRight, UsersIcon } from 'lucide-react';
import type { Tournament } from '@/types';
import Heading from '../heading';

export default function TournamentList({
    tournaments,
}: {
    tournaments: Tournament[];
}) {
    const completedTournaments = tournaments.filter(
        (tournament) => tournament.is_completed === true,
    );
    const inProgressTournaments = tournaments.filter(
        (tournament) => tournament.is_completed === false,
    );

    return (
        <div>
            {inProgressTournaments.length > 0 ? (
                <div>
                    <Heading title="In progress" variant="small" />
                    <ul className="mt-2 grid gap-5">
                        {inProgressTournaments.map((tournament) => (
                            <li
                                key={tournament.id}
                                className="rounded-md border-2 bg-gray-50 p-4"
                            >
                                <div className="flex flex-row items-center justify-between">
                                    <p className="font-medium">
                                        {tournament.name}
                                    </p>
                                    <Link
                                        href={`/tournaments/${tournament.id}`}
                                        className="inline-flex items-center gap-2 underline-offset-2 hover:underline"
                                    >
                                        View tournament <ArrowRight size={16} />
                                    </Link>
                                </div>
                                <div className="mt-1">
                                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <UsersIcon className="size-4" />
                                        {tournament.player_count} attended
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div>
                    {' '}
                    <Heading title="In progress" variant="small" />
                    <p className="text-sm text-muted-foreground">
                        No tournaments are currently in progress
                    </p>
                </div>
            )}
            {completedTournaments.length > 0 && (
                <div className="mt-10">
                    <Heading title="Completed" variant="small" />
                    <ul className="mt-2 grid gap-5">
                        {completedTournaments.map((tournament) => (
                            <li
                                key={tournament.id}
                                className="rounded-md border-2 border-green-500 bg-green-50 p-4"
                            >
                                <div className="flex flex-row items-center justify-between">
                                    <p className="font-medium">
                                        {tournament.name}
                                    </p>
                                    <Link
                                        href={`/tournaments/${tournament.id}`}
                                        className="inline-flex items-center gap-2 underline-offset-2 hover:underline"
                                    >
                                        View tournament <ArrowRight size={16} />
                                    </Link>
                                </div>
                                <div className="mt-1">
                                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <UsersIcon className="size-4" />
                                        {tournament.player_count} attended
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
