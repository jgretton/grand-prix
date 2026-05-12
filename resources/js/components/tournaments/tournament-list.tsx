import { Tournament } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export default function TournamentList({
    tournaments,
}: {
    tournaments: Tournament[];
}) {
    return (
        <ul className="grid gap-5">
            {tournaments.map((tournament) => (
                <li key={tournament.id} className="rounded-md border-2 p-4">
                    <div className="flex flex-row items-center justify-between">
                        <p className="font-medium">{tournament.name}</p>
                        <Link
                            href={`/tournaments/${tournament.id}`}
                            className="inline-flex items-center gap-2 underline-offset-2 hover:underline"
                        >
                            View tournament <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="">
                        <p className="text-sm text-muted-foreground">
                            {tournament.player_count} players attended
                        </p>
                    </div>
                </li>
            ))}
        </ul>
    );
}
