import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, Table2Icon } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import AddSeasonModal from '@/components/modals/add-season';
import SeasonsDropdownMenu from '@/components/seasons/seasons-dropdown-menu';
import SeasonsSelector from '@/components/seasons/seasons-selector';
import TournamentList from '@/components/tournaments/tournament-list';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';

import { dashboard } from '@/routes';
import type { Season, Seasons } from '@/types';

interface DashboardPageProps {
    season: Season;
    seasons: Seasons;
}

export default function Dashboard({ seasons, season }: DashboardPageProps) {
    const [modalOpen, setModalOpen] = useState(false);

    const handleSeasonChange = (seasonId: number) => {
        router.get(
            'dashboard',
            { season: seasonId },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    if (seasons.length === 0) {
        return (
            <>
                <Head title="Dashboard" />
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <Table2Icon />
                            </EmptyMedia>
                            <EmptyTitle>No Current Season</EmptyTitle>
                            <EmptyDescription>
                                You have not created a season yet.
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent className="flex-row justify-center gap-2">
                            <AddSeasonModal
                                setModalOpen={setModalOpen}
                                modalOpen={modalOpen}
                                isFirstSeason
                            />
                        </EmptyContent>
                    </Empty>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Selected season</CardTitle>
                        <CardAction className="space-x-2">
                            <SeasonsDropdownMenu season={season} />
                            <AddSeasonModal
                                setModalOpen={setModalOpen}
                                modalOpen={modalOpen}
                            />
                        </CardAction>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-between gap-5 sm:flex-row">
                        <div className="flex flex-1 items-center gap-5">
                            <SeasonsSelector
                                season={season}
                                seasons={seasons}
                                handleSeasonChange={handleSeasonChange}
                            />
                            {season.is_current === true && (
                                <p className="inline-flex shrink-0 items-center gap-1 text-xs text-green-800">
                                    <span className="size-2 animate-pulse rounded-full bg-green-400" />
                                    active season
                                </p>
                            )}
                        </div>
                        <div className="flex-end space-x-2"></div>
                    </CardContent>
                </Card>

                <div className="mt-10">
                    <Heading
                        title="Tournaments"
                        action={
                            <Link href={'/tournaments/create'}>
                                <Button>
                                    <PlusIcon />
                                    <span className="hidden sm:inline">New Tournament</span>
                                </Button>
                            </Link>
                        }
                    />
                    {season.tournaments?.length === 0 ? (
                        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                            <Empty className="mx-auto w-full max-w-lg">
                                <EmptyHeader className="max-w-md">
                                    <EmptyMedia variant="icon">
                                        <Table2Icon />
                                    </EmptyMedia>
                                    <EmptyTitle className="">
                                        There are no tournaments for this
                                        selected seasons
                                    </EmptyTitle>
                                    <EmptyDescription>
                                        Please use the button below to start
                                        making your first tournament
                                    </EmptyDescription>
                                </EmptyHeader>
                                <EmptyContent className="flex-row justify-center gap-2">
                                    <Button
                                        onClick={() =>
                                            router.get('/tournaments/create')
                                        }
                                    >
                                        <PlusIcon /> New Tournament
                                    </Button>
                                </EmptyContent>
                            </Empty>
                        </div>
                    ) : (
                        <TournamentList tournaments={season.tournaments} />
                    )}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
