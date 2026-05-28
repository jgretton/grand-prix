import Heading from '@/components/heading';
import SeasonsSelector from '@/components/seasons/seasons-selector';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { Players, Season, Seasons, Tournament } from '@/types';
import { Head, router } from '@inertiajs/react';
import { TrophyIcon } from 'lucide-react';

type LeaderboardPageProps = {
    season: Season;
    seasons: Seasons;
    tournament: Tournament[];
    players: Players;
};

export default function LeaderboardPage({
    season,
    seasons,
    tournament,
    players,
}: LeaderboardPageProps) {
    const handleSeasonChange = (seasonId: number) => {
        router.get(
            'leaderboard',
            { season: seasonId },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    if (players.length === 0) {
        return (
            <>
                <Head title="Leaderboard" />
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <TrophyIcon />
                            </EmptyMedia>
                            <EmptyTitle>No leaderboard yet</EmptyTitle>
                            <EmptyDescription>
                                No players have completed a tournament in this season.
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent className="flex-row justify-center gap-2">
                            <SeasonsSelector
                                season={season}
                                seasons={seasons}
                                handleSeasonChange={handleSeasonChange}
                                triggerClassName="w-48"
                            />
                        </EmptyContent>
                    </Empty>
                </div>
            </>
        );
    }

    // using a shadow as borders scroll with the table. Shadow is part of the element that declaurs it.
    // all to do with border-collapse which means adjascent borders share their cell.
    const rankInsetShadow: Record<number, string> = {
        1: 'inset 4px 0 0 0 #fbbf24',
        2: 'inset 4px 0 0 0 #94a3b8',
        3: 'inset 4px 0 0 0 #fb923c',
    };

    const rankBadge: Record<number, string> = {
        1: 'bg-amber-100 text-amber-700 ring-1 ring-amber-300',
        2: 'bg-slate-100 text-slate-600 ring-1 ring-slate-300',
        3: 'bg-orange-100 text-orange-700 ring-1 ring-orange-300',
    };

    return (
        <>
            <Head title="Leaderboard" />
            <div className="mt-4 flex flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full flex-col items-start justify-between sm:flex-row sm:items-center">
                    <Heading
                        title="Leaderboard"
                        description="Current rankings for the selected season"
                    />

                    <SeasonsSelector
                        season={season}
                        seasons={seasons}
                        handleSeasonChange={handleSeasonChange}
                        triggerClassName="w-48"
                    />
                </div>

                <div className="mt-10 overflow-auto rounded-md border">
                    <Table className="">
                        <TableHeader className="sticky top-0 z-20 bg-background">
                            <TableRow>
                                <TableHead className="sticky left-0 z-10 bg-background">
                                    <div className="flex items-center gap-2">
                                        <span className="w-7 shrink-0 text-center text-muted-foreground">
                                            #
                                        </span>
                                        Name
                                    </div>
                                </TableHead>
                                {tournament.map((t) => (
                                    <TableHead
                                        key={t.id}
                                        className="max-w-24 truncate text-center"
                                    >
                                        {t.name}
                                    </TableHead>
                                ))}
                                <TableHead className="sticky right-0 z-10 bg-background text-right font-semibold">
                                    Total
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {players.map((player, idx) => (
                                <TableRow key={player.id}>
                                    <TableCell
                                        className="sticky left-0 z-10 bg-background font-medium"
                                        style={{
                                            boxShadow: [
                                                '1px 0 0 0 var(--color-border)',
                                                player.rank
                                                    ? rankInsetShadow[
                                                          player.rank
                                                      ]
                                                    : '',
                                            ]
                                                .filter(Boolean)
                                                .join(', '),
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            {players[idx - 1]?.rank ===
                                            player.rank ? (
                                                <span className="h-7 w-7 shrink-0" />
                                            ) : player.rank &&
                                              rankBadge[player.rank] ? (
                                                <span
                                                    className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${rankBadge[player.rank]}`}
                                                >
                                                    {player.rank}
                                                </span>
                                            ) : (
                                                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center text-sm text-muted-foreground">
                                                    {player.rank}
                                                </span>
                                            )}
                                            {player.name}
                                        </div>
                                    </TableCell>
                                    {tournament.map((t) => {
                                        const score =
                                            player.player_scores?.find(
                                                (p) => p.tournament_id === t.id,
                                            )?.score;
                                        return (
                                            <TableCell
                                                key={t.id}
                                                className="text-center"
                                            >
                                                {score ?? '-'}
                                            </TableCell>
                                        );
                                    })}
                                    <TableCell className="sticky right-0 z-10 bg-background text-right font-semibold">
                                        {player.player_scores_sum_score}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}
