import LeaderboardTable from '@/components/leaderboard/leaderboard-table';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { dashboard, login } from '@/routes';
import type { Players, Season, Seasons, Tournament } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { CalendarIcon, TrophyIcon } from 'lucide-react';

export default function Welcome({
    tournaments,
    players,
    seasons,
    season,
}: {
    tournaments: Tournament[];
    players: Players;
    seasons: Seasons;
    season: Season | null;
}) {
    const { auth } = usePage().props;

    const handleSeasonChange = (value: string) => {
        if (value) {
            router.get(
                '/',
                { season: value },
                { preserveState: true, preserveScroll: true },
            );
        }
    };

    return (
        <>
            <Head title="Grand Prix">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-3 text-[#1b1b18] lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-7xl text-sm">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={login()}
                                className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                            >
                                Log in
                            </Link>
                        )}
                    </nav>
                </header>
                <main className="w-full max-w-7xl">
                    <h1 className="mb-2 text-3xl font-bold">Grand Prix</h1>
                    <p className="mb-4 text-muted-foreground">
                        Current season leaderboard
                    </p>

                    {seasons.length === 0 ? (
                        <Empty className="mt-10">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <CalendarIcon />
                                </EmptyMedia>
                                <EmptyTitle>No season yet</EmptyTitle>
                                <EmptyDescription>
                                    The first season hasn't kicked off yet —
                                    check back soon!
                                    {!auth.user && (
                                        <>
                                            {' '}
                                            <Link href={login()}>
                                                Log in
                                            </Link>{' '}
                                            if you're setting things up.
                                        </>
                                    )}
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    ) : (
                        <>
                            <ToggleGroup
                                type="single"
                                value={season ? String(season.id) : ''}
                                onValueChange={handleSeasonChange}
                                variant="outline"
                                spacing={2}
                                className="mt-10"
                            >
                                {seasons.map((s) => (
                                    <ToggleGroupItem
                                        key={s.id}
                                        value={String(s.id)}
                                    >
                                        {s.name}
                                    </ToggleGroupItem>
                                ))}
                            </ToggleGroup>
                            <div className="mt-3">
                                {players.length === 0 ? (
                                    <Empty className="mt-4">
                                        <EmptyHeader>
                                            <EmptyMedia variant="icon">
                                                <TrophyIcon />
                                            </EmptyMedia>
                                            <EmptyTitle>
                                                No results yet for{' '}
                                                {season?.name}
                                            </EmptyTitle>
                                            <EmptyDescription>
                                                Tournaments for this season
                                                haven't been played yet. Check
                                                back once things get underway!
                                                {!auth.user && (
                                                    <>
                                                        {' '}
                                                        <Link href={login()}>
                                                            Log in
                                                        </Link>{' '}
                                                        if you're setting things
                                                        up.
                                                    </>
                                                )}
                                            </EmptyDescription>
                                        </EmptyHeader>
                                    </Empty>
                                ) : (
                                    <LeaderboardTable
                                        players={players}
                                        tournaments={tournaments}
                                    />
                                )}
                            </div>
                        </>
                    )}
                </main>
            </div>
        </>
    );
}
