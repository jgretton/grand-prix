import { Head, router } from '@inertiajs/react';
import { TrophyIcon } from 'lucide-react';
import Heading from '@/components/heading';
import LeaderboardTable from '@/components/leaderboard/leaderboard-table';
import SeasonsSelector from '@/components/seasons/seasons-selector';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import type { Players, Season, Seasons, Tournament } from '@/types';

type LeaderboardPageProps = {
    season: Season | null;
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
                        {seasons.length > 0 && (
                            <EmptyContent className="flex-row justify-center gap-2">
                                <SeasonsSelector
                                    season={season ?? undefined}
                                    seasons={seasons}
                                    handleSeasonChange={handleSeasonChange}
                                    triggerClassName="w-48"
                                />
                            </EmptyContent>
                        )}
                    </Empty>
                </div>
            </>
        );
    }

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
                        season={season ?? undefined}
                        seasons={seasons}
                        handleSeasonChange={handleSeasonChange}
                        triggerClassName="w-48"
                    />
                </div>
                <div className="mt-10">
                    <LeaderboardTable players={players} tournaments={tournament} />
                </div>
            </div>
        </>
    );
}
