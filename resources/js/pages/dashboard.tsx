import Heading from '@/components/heading';
import AddSeasonModal from '@/components/modals/add-season';
import SeasonsDropdownMenu from '@/components/seasons/seasons-dropdown-menu';
import SeasonsSelector from '@/components/seasons/seasons-selector';
import TournamentList from '@/components/tournaments/tournament-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';

import { dashboard } from '@/routes';
import { Season, Seasons } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, Table2Icon } from 'lucide-react';
import { useState } from 'react';

interface DashboardPageProps {
    season: Season;
    seasons: Seasons;
}

export default function Dashboard({ seasons, season }: DashboardPageProps) {
    const [modalOpen, setModalOpen] = useState(false);

    console.log(season);

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
                    <CardHeader>
                        <CardTitle>Selected season</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-row justify-between">
                        <div className="flex items-center gap-5">
                            <SeasonsSelector
                                season={season}
                                seasons={seasons}
                                handleSeasonChange={handleSeasonChange}
                            />
                            {season.is_current === true && (
                                <p className="inline-flex items-center gap-1 text-xs text-green-800">
                                    <span className="size-2 animate-pulse rounded-full bg-green-400" />
                                    current season
                                </p>
                            )}
                        </div>
                        <div className="flex-end space-x-2">
                            <AddSeasonModal
                                setModalOpen={setModalOpen}
                                modalOpen={modalOpen}
                            />
                            <SeasonsDropdownMenu season={season} />
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-10">
                    <div className="inline-flex w-full justify-between">
                        <Heading title="Tournaments" />
                        <Link href={'/tournaments/create'}>
                            <Button>
                                {' '}
                                <PlusIcon /> New Tournament
                            </Button>
                        </Link>
                    </div>
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
