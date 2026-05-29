import Heading from '@/components/heading';
import ResultsGrid from '@/components/tournaments/results-grid';
import ScoringGrid from '@/components/tournaments/scoring-grid';
import StatusBadge from '@/components/tournaments/status-badge';
import TeamList from '@/components/tournaments/team-list';
import WinnerCard from '@/components/tournaments/winner-card';
import { Button } from '@/components/ui/button';
import { Collapsible } from '@/components/ui/collapsible';
import { dashboard } from '@/routes';
import tournaments from '@/routes/tournaments';
import type { FinalScore, Tournament, TournamentStatus } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    CollapsibleContent,
    CollapsibleTrigger,
} from '@radix-ui/react-collapsible';
import { ChevronDownIcon, PencilIcon, PlayIcon, UsersIcon } from 'lucide-react';
import { useState } from 'react';

export default function TournamentPage({
    tournament,
    finalScores,
}: {
    tournament: Tournament;
    finalScores: FinalScore[];
}) {
    const [localStatus, setLocalStatus] = useState<
        'not-started' | 'in-progress'
    >(tournament.rounds.length > 0 ? 'in-progress' : 'not-started');

    const tournamentStatus: TournamentStatus = tournament.is_completed
        ? 'completed'
        : localStatus;

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                    <Heading title="Tournament Details" />
                    <Link href={`/tournaments/${tournament.id}/edit`}>
                        <Button variant="outline" className="w-full sm:w-auto">
                            <PencilIcon /> Edit Tournament
                        </Button>
                    </Link>
                </div>

                <div className="flex w-full flex-col">
                    <div className="flex flex-row items-center gap-2">
                        <p className="text-base font-medium">
                            Season:{' '}
                            <span className="text-sm font-light">
                                {tournament.season?.name}
                            </span>
                        </p>
                        | <StatusBadge status={tournamentStatus} />
                    </div>
                    <div className="mt-10">
                        {tournamentStatus === 'not-started' && (
                            <>
                                <Heading title="Teams" />
                                <div className="flex w-full flex-row flex-wrap gap-5">
                                    {tournament.teams?.map((team) => (
                                        <TeamList team={team} key={team.id} />
                                    ))}
                                </div>
                                <div className="mt-10 space-y-2 text-right">
                                    <p className="text-sm text-muted-foreground">
                                        Confirm that you are happy with the team
                                        and this will start the tournament
                                    </p>
                                    <Button
                                        className="self-end"
                                        onClick={() =>
                                            setLocalStatus('in-progress')
                                        }
                                    >
                                        <PlayIcon />
                                        Start Tournament
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                {tournamentStatus === 'in-progress' && (
                    <>
                        <div className="flex flex-col items-center justify-between sm:flex-row sm:gap-4">
                            <Heading
                                title="Teams"
                                description="Teams have been confirmed, you can now start
                                    scoring below. To change the teams click the
                                    edit button"
                            />
                            <Button
                                variant={'outline'}
                                className="w-full sm:w-auto"
                                onClick={() => setLocalStatus('not-started')}
                            >
                                <UsersIcon /> View Teams
                            </Button>
                        </div>
                        <div className="border-t pt-10">
                            <Heading title="Scoring" />
                            <ScoringGrid tournament={tournament} />
                        </div>
                    </>
                )}

                {tournamentStatus === 'completed' && (
                    <div>
                        <WinnerCard finalScores={finalScores} />

                        <Heading title="Final scores" />
                        <ResultsGrid
                            tournament={tournament}
                            finalScores={finalScores}
                        />
                        <div className="mt-10">
                            <Collapsible>
                                <CollapsibleTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        className="group w-full"
                                    >
                                        Teams
                                        <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
                                    </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <div className="mt-3 flex w-full flex-row flex-wrap">
                                        {tournament.teams?.map((team) => (
                                            <TeamList
                                                team={team}
                                                key={team.id}
                                                borderless
                                            />
                                        ))}
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

TournamentPage.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Tournament',
            href: tournaments.index,
        },
    ],
};
