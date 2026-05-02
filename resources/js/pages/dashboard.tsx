import AddSeasonModal from '@/components/modals/add-season';
import SeasonsDropdownMenu from '@/components/seasons/seasons-dropdown-menu';
import SeasonsSelector from '@/components/seasons/seasons-selector';
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
import { Head, router } from '@inertiajs/react';
import { Table2Icon } from 'lucide-react';
import { useState } from 'react';

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
