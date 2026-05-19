import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import tournaments from '@/routes/tournaments';
import { Round, Tournament } from '@/types';
import { Head, router } from '@inertiajs/react';
import { PencilIcon, PlayIcon, PlusIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

export default function TournamentPage({
    tournament,
}: {
    tournament: Tournament;
}) {
    const [roundsData, setRoundsData] = useState<Round[]>([
        { round_number: 1, round_scores: [{ team_id: 1, score: 21 }] },
    ]);

    const [tournamentStatus, setTournamentStatus] = useState<
        'not-started' | 'in-progress' | 'completed'
    >(
        tournament.is_completed === true
            ? 'completed'
            : tournament.rounds.length > 1
              ? 'in-progress'
              : 'not-started',
    );

    const handleRoundScoreChange = (
        roundNumber: number,
        teamId: number,
        e: React.InputEvent,
    ) => {
        // console.log(roundNumber, teamId, e.target.value);
        setRoundsData((prev) =>
            prev.map((round) =>
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

    const submitroundScores = () => {
        router.post(`/tournaments/${tournament.id}/submit`, {
            rounds: roundsData,
        });
    };

    const teamSumScores = (teamId: number) => {
        let score = 0;

        roundsData.map((round) => {
            let teamScore = round.round_scores.find(
                (team) => team.team_id === teamId,
            )?.score;

            if (isNaN(teamScore)) teamScore = 0;

            return (score += Number(teamScore));
        });

        if (isNaN(score)) score = 0;

        return score;
    };
    const addRound = () => {
        setRoundsData((prev) => [
            ...prev,
            { round_number: roundsData.length + 1, round_scores: [] },
        ]);
    };

    const deleteRound = (roundNumber: number) => {
        setRoundsData((prev) =>
            prev.filter((round) => round.round_number !== roundNumber),
        );
    };

    const StatusBadge = () => {
        const StatusText = {
            'in-progress': 'In Progress',
            'not-started': 'Not Started',
            completed: 'Completed',
        };

        const BadgeClassName = {
            'in-progress':
                'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
            'not-started': '',
            completed:
                'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
        };

        return (
            <Badge
                variant={'secondary'}
                className={BadgeClassName[tournamentStatus]}
            >
                {tournamentStatus !== 'not-started' && (
                    <div
                        className={cn(
                            ` ${(tournamentStatus === 'completed' && 'bg-green-700') || (tournamentStatus === 'in-progress' && 'animate-pulse bg-blue-700')} size-2 rounded-full`,
                        )}
                    />
                )}

                {StatusText[tournamentStatus]}
            </Badge>
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
                        | <StatusBadge />
                    </div>
                    <div className="mt-10">
                        {tournamentStatus === 'not-started' ? (
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
                                            setTournamentStatus('in-progress')
                                        }
                                    >
                                        <PlayIcon />
                                        Start Tournament
                                    </Button>
                                </div>
                            </>
                        ) : (
                            // <div className="">Teams confirmed</div>
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
                                    onClick={() =>
                                        setTournamentStatus('not-started')
                                    }
                                >
                                    <PencilIcon /> Edit Teams
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
                {tournamentStatus === 'in-progress' && (
                    <div className="border-t pt-10">
                        <Heading title="Scoring" />
                        <div
                            className="grid w-full gap-x-3 rounded-md border text-center"
                            style={{
                                gridTemplateColumns: `auto repeat(${roundsData.length}, 3rem) 1fr auto`,
                            }}
                        >
                            <div className="col-span-full grid grid-cols-subgrid border-b bg-gray-100 px-4 py-2">
                                <div />
                                {roundsData.map((round, idx) => (
                                    <div
                                        className="inline-flex place-content-center items-center gap-1"
                                        key={round.round_number}
                                    >
                                        <p className="text-center text-sm font-medium text-muted-foreground">
                                            {round.round_number}
                                        </p>
                                        {roundsData.length === idx + 1 &&
                                            roundsData.length > 1 && (
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
                                    {roundsData.map((round) => {
                                        const teamScore =
                                            round.round_scores.find(
                                                (t) =>
                                                    Number(t.team_id) ===
                                                    Number(team.id),
                                            )?.score;

                                        return (
                                            <Input
                                                // type="number"
                                                className="rounded-sm border-2 px-2 py-0.5 text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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

                        <Button
                            className="mt-10 w-full md:w-fit md:self-end"
                            onClick={() => submitroundScores()}
                        >
                            Submit score
                        </Button>
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
