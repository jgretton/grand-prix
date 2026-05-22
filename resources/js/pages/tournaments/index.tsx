import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import tournaments from '@/routes/tournaments';
import type { FinalScore, Round, Tournament } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import {
    CollapsibleContent,
    CollapsibleTrigger,
} from '@radix-ui/react-collapsible';
import {
    ChevronDownIcon,
    PencilIcon,
    PlayIcon,
    PlusIcon,
    TrophyIcon,
    XIcon,
} from 'lucide-react';
import { useState } from 'react';

type TournamentStatus = 'not-started' | 'in-progress' | 'completed';

const StatusText: Record<TournamentStatus, string> = {
    'in-progress': 'In Progress',
    'not-started': 'Not Started',
    completed: 'Completed',
};

const BadgeClassName: Record<TournamentStatus, string> = {
    'in-progress':
        'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    'not-started': '',
    completed:
        'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
};

function StatusBadge({ status }: { status: TournamentStatus }) {
    return (
        <Badge variant={'secondary'} className={BadgeClassName[status]}>
            {status !== 'not-started' && (
                <div
                    className={cn(
                        ` ${(status === 'completed' && 'bg-green-700') || (status === 'in-progress' && 'animate-pulse bg-blue-700')} size-2 rounded-full`,
                    )}
                />
            )}
            {StatusText[status]}
        </Badge>
    );
}

export default function TournamentPage({
    tournament,
    finalScores,
}: {
    tournament: Tournament;
    finalScores: FinalScore[];
}) {
    const { data, setData, post, processing, errors } = useForm<{
        rounds: Round[];
    }>({
        rounds: [{ round_number: 1, round_scores: [] }],
    });

    console.log(errors);

    const [localStatus, setLocalStatus] = useState<
        'not-started' | 'in-progress'
    >(tournament.rounds.length > 1 ? 'in-progress' : 'not-started');

    const tournamentStatus: TournamentStatus = tournament.is_completed
        ? 'completed'
        : localStatus;

    const handleRoundScoreChange = (
        roundNumber: number,
        teamId: number,
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setData(
            'rounds',
            data.rounds.map((round) =>
                round.round_number === roundNumber
                    ? {
                          ...round,
                          round_scores: round.round_scores.some(
                              (rs) => rs.team_id === teamId,
                          )
                              ? round.round_scores.map((rs) =>
                                    rs.team_id === teamId
                                        ? {
                                              ...rs,
                                              score: Number(e.target.value),
                                          }
                                        : rs,
                                )
                              : [
                                    ...round.round_scores,
                                    {
                                        team_id: teamId,
                                        score: Number(e.target.value),
                                    },
                                ],
                      }
                    : round,
            ),
        );
    };

    const submitRoundScores = () => {
        post(`/tournaments/${tournament.id}/submit`);
    };

    const teamSumScores = (teamId: number) => {
        let score = 0;

        data.rounds.forEach((round) => {
            let teamScore = round.round_scores.find(
                (team) => team.team_id === teamId,
            )?.score;

            if (isNaN(teamScore as number)) {
                teamScore = 0;
            }

            score += Number(teamScore);
        });

        if (isNaN(score)) {
            score = 0;
        }

        return score;
    };

    const addRound = () => {
        setData('rounds', [
            ...data.rounds,
            { round_number: data.rounds.length + 1, round_scores: [] },
        ]);
    };

    const deleteRound = (roundNumber: number) => {
        setData(
            'rounds',
            data.rounds.filter((round) => round.round_number !== roundNumber),
        );
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading title="Tournament Details" />

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
                                        <ul
                                            key={team.id}
                                            className="grid min-w-3xs gap-2 rounded-md border p-4"
                                        >
                                            <li className="mb-1 text-base font-semibold">
                                                {team.name}
                                            </li>
                                            {team.player_teams.map((player) => (
                                                <li
                                                    key={player.id}
                                                    className="text-sm text-muted-foreground"
                                                >
                                                    {player.player.name}
                                                </li>
                                            ))}
                                        </ul>
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
                                <PencilIcon /> Edit Teams
                            </Button>
                        </div>
                        <div className="border-t pt-10">
                            <Heading title="Scoring" />
                            <div
                                className="grid w-full gap-x-3 rounded-md border text-center"
                                style={{
                                    gridTemplateColumns: `auto repeat(${data.rounds.length}, 3rem) 1fr auto`,
                                }}
                            >
                                <div className="col-span-full grid grid-cols-subgrid border-b bg-gray-100 px-4 py-2">
                                    <div />
                                    {data.rounds.map((round, idx) => (
                                        <div
                                            className="inline-flex place-content-center items-center gap-1"
                                            key={round.round_number}
                                        >
                                            <p className="text-center text-sm font-semibold text-muted-foreground">
                                                R{round.round_number}
                                            </p>
                                            {data.rounds.length === idx + 1 &&
                                                data.rounds.length > 1 && (
                                                    <Button
                                                        size={'icon'}
                                                        className="shrink-0"
                                                        variant={'ghost'}
                                                        onClick={() =>
                                                            deleteRound(
                                                                round.round_number,
                                                            )
                                                        }
                                                    >
                                                        <XIcon size={12} />
                                                    </Button>
                                                )}
                                        </div>
                                    ))}
                                    <Button
                                        className="border-dashed bg-none text-left"
                                        onClick={() => addRound()}
                                        variant={'secondary'}
                                        size={'icon'}
                                    >
                                        <PlusIcon />
                                    </Button>
                                    <p className="self-center px-2 text-center text-sm">
                                        Scores
                                    </p>
                                </div>
                                {tournament.teams?.map((team) => (
                                    <div
                                        className="col-span-full grid grid-cols-subgrid border-b py-4"
                                        key={team.id}
                                    >
                                        <div className="place-content-center border-r-2 px-4">
                                            <p className="font-medium">
                                                {team.name}
                                            </p>
                                        </div>
                                        {data.rounds.map((round, idx) => {
                                            const teamScore =
                                                round.round_scores.find(
                                                    (t) =>
                                                        Number(t.team_id) ===
                                                        Number(team.id),
                                                )?.score;

                                            return (
                                                <Input
                                                    className={`rounded-sm border-2 px-2 py-0.5 text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${(errors[`rounds.${idx}.round_scores`] || errors[`rounds.${idx}.round_scores.${team.id}`]) && 'border-red-500'}`}
                                                    value={teamScore}
                                                    key={round.round_number}
                                                    onChange={(e) =>
                                                        handleRoundScoreChange(
                                                            round.round_number,
                                                            Number(team.id),
                                                            e,
                                                        )
                                                    }
                                                />
                                            );
                                        })}
                                        <div />
                                        <p className="sticky self-center border-l font-medium">
                                            {teamSumScores(team.id)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            {errors['rounds.allTeams'] && (
                                <p className="mt-2 text-sm text-red-500">
                                    {errors['rounds.allTeams']}
                                </p>
                            )}

                            <Button
                                className="mt-3 w-full md:w-fit md:self-end"
                                onClick={submitRoundScores}
                                disabled={processing}
                            >
                                {processing ? 'Submitting...' : 'Submit score'}
                            </Button>
                        </div>
                    </>
                )}

                {tournamentStatus === 'completed' && (
                    <div>
                        <Card className="mb-10 border-amber-300 bg-amber-50">
                            <CardContent className="flex flex-row items-center justify-between gap-6">
                                <TrophyIcon size={40} color="gold" />
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase">
                                        Winner
                                    </p>
                                    <p className="text-lg">
                                        {finalScores[0].team.name}
                                    </p>
                                </div>
                                <p className="flex flex-col items-end text-2xl/tight font-medium">
                                    {finalScores[0].final_score}
                                    <span className="text-sm font-normal">
                                        points
                                    </span>
                                </p>
                            </CardContent>
                        </Card>
                        <Heading title="Final scores" />
                        <div
                            className="grid w-full gap-x-3 rounded-md border text-center"
                            style={{
                                gridTemplateColumns: `auto 1fr repeat(${tournament.rounds.length}, 3rem)  auto`,
                            }}
                        >
                            <div className="col-span-full grid grid-cols-subgrid border-b bg-gray-100 px-4 py-2">
                                <div className="text-center">#</div>
                                <div />
                                {tournament.rounds.map((round) => (
                                    <div
                                        className="inline-flex place-content-center items-center gap-1"
                                        key={round.round_number}
                                    >
                                        <p className="text-center text-sm font-semibold text-muted-foreground">
                                            R{round.round_number}
                                        </p>
                                    </div>
                                ))}

                                <p className="self-center px-2 text-center text-sm">
                                    Scores
                                </p>
                            </div>
                            {finalScores.map((team, idx) => (
                                <div
                                    className="col-span-full grid grid-cols-subgrid border-b px-4 py-4"
                                    key={team.team.id}
                                >
                                    <div className="place-content-center text-center">
                                        {idx + 1}
                                    </div>
                                    <div className="border-r-2 px-4 text-left">
                                        <p className="font-medium">
                                            {team.team.name}
                                        </p>
                                    </div>
                                    {team.round_scores.map((round) => (
                                        <p>{round.score}</p>
                                    ))}

                                    <p className="sticky self-center border-l font-medium">
                                        {team.final_score}
                                    </p>
                                </div>
                            ))}
                        </div>
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
                                    <div className="flex w-full flex-row flex-wrap">
                                        {tournament.teams?.map((team) => (
                                            <ul
                                                key={team.id}
                                                className="grid min-w-3xs gap-2 p-4"
                                            >
                                                <li className="mb-1 text-base font-semibold">
                                                    {team.name}
                                                </li>
                                                {team.player_teams.map(
                                                    (player) => (
                                                        <li
                                                            key={player.id}
                                                            className="text-sm text-muted-foreground"
                                                        >
                                                            {player.player.name}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
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
