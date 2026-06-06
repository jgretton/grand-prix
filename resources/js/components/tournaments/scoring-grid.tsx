import type { Round, RoundScore, Tournament } from '@/types';
import { useForm } from '@inertiajs/react';
import { Loader2Icon, PlusIcon, XIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table';

export default function ScoringGrid({
    tournament,
}: {
    tournament: Tournament;
}) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const rawSaved = localStorage.getItem(
        `tournament-scoring-${tournament.id}`,
    );
    const savedScoring = rawSaved
        ? JSON.parse(rawSaved)
        : { rounds: [{ round_number: 1, round_scores: [] }] };

    const { data, setData, post, processing, errors } = useForm<{
        rounds: Round[];
    }>(`tournament-scoring-${tournament.id}`, savedScoring);

    const upsertScore = (
        roundScores: RoundScore[],
        teamId: number,
        score: number,
    ) => {
        const newArray = roundScores.some((rs) => rs.team_id === teamId)
            ? roundScores.map((rs) =>
                  rs.team_id === teamId
                      ? {
                            ...rs,
                            score: score,
                        }
                      : rs,
              )
            : [
                  ...roundScores,
                  {
                      team_id: teamId,
                      score: score,
                  },
              ];

        return newArray;
    };

    const handleRoundScoreChange = (
        roundNumber: number,
        teamId: number,
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const newRounds = data.rounds.map((round) =>
            round.round_number === roundNumber
                ? {
                      ...round,
                      round_scores: upsertScore(
                          round.round_scores,
                          teamId,
                          Number(e.target.value),
                      ),
                  }
                : round,
        );
        setData('rounds', newRounds);
        localStorage.setItem(
            `tournament-scoring-${tournament.id}`,
            JSON.stringify({ rounds: newRounds }),
        );
    };

    const submitRoundScores = () => {
        post(`/tournaments/${tournament.id}/submit`, {
            onSuccess: () => {
                localStorage.removeItem(`tournament-scoring-${tournament.id}`);
                localStorage.removeItem(`tournament-status-${tournament.id}`);
            },
        });
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

    useEffect(() => {
        const inner = scrollRef.current?.querySelector(
            '[data-slot="table-container"]',
        ) as HTMLElement | null;
        const target = inner ?? scrollRef.current;
        if (target) {
            target.scrollLeft = target.scrollWidth;
        }
    }, [data.rounds.length]);

    const addRound = () => {
        const newRounds = [
            ...data.rounds,
            { round_number: data.rounds.length + 1, round_scores: [] },
        ];
        setData('rounds', newRounds);

        localStorage.setItem(
            `tournament-scoring-${tournament.id}`,
            JSON.stringify({ rounds: newRounds }),
        );
    };

    const deleteRound = (roundNumber: number) => {
        const updatedRounds = data.rounds.filter(
            (round) => round.round_number !== roundNumber,
        );
        setData('rounds', updatedRounds);
        localStorage.setItem(
            `tournament-scoring-${tournament.id}`,
            JSON.stringify({ rounds: updatedRounds }),
        );
    };

    return (
        <>
            <div ref={scrollRef} className="overflow-auto rounded-md border">
                <Table>
                    <TableHeader className="sticky top-0 z-20 bg-background">
                        <TableRow>
                            <TableHead
                                className="sticky left-0 z-10 w-px bg-background whitespace-nowrap"
                                style={{
                                    boxShadow: '1px 0 0 0 var(--color-border)',
                                }}
                            >
                                Team
                            </TableHead>
                            {data.rounds.map((round, idx) => (
                                <TableHead
                                    key={round.round_number}
                                    className="w-32 text-center"
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        <span>Round {round.round_number}</span>
                                        {data.rounds.length === idx + 1 &&
                                            data.rounds.length > 1 && (
                                                <button
                                                    onClick={() =>
                                                        deleteRound(
                                                            round.round_number,
                                                        )
                                                    }
                                                    className="text-muted-foreground hover:text-destructive"
                                                >
                                                    <XIcon size={12} />
                                                </button>
                                            )}
                                    </div>
                                </TableHead>
                            ))}
                            <TableHead className="min-w-16 text-center">
                                <Button
                                    className="border-dashed"
                                    onClick={() => addRound()}
                                    variant="secondary"
                                    size="icon"
                                >
                                    <PlusIcon />
                                </Button>
                            </TableHead>
                            <TableHead className="sticky right-0 z-10 bg-background text-right font-semibold">
                                Total
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tournament.teams?.map((team) => (
                            <TableRow key={team.id}>
                                <TableCell
                                    className="sticky left-0 z-10 w-px bg-background py-3 font-medium whitespace-nowrap"
                                    style={{
                                        boxShadow:
                                            '1px 0 0 0 var(--color-border)',
                                    }}
                                >
                                    {team.name}
                                </TableCell>
                                {data.rounds.map((round, idx) => {
                                    const teamScore = round.round_scores.find(
                                        (t) =>
                                            Number(t.team_id) ===
                                            Number(team.id),
                                    )?.score;

                                    return (
                                        <TableCell
                                            key={round.round_number}
                                            className="w-20 py-3"
                                        >
                                            <Input
                                                type="number"
                                                className={`rounded-sm border-2 px-2 py-0.5 text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${(errors[`rounds.${idx}.round_scores`] || errors[`rounds.${idx}.round_scores.${team.id}`]) && 'border-red-500'} mx-auto w-20 text-center`}
                                                value={teamScore ?? ''}
                                                onChange={(e) =>
                                                    handleRoundScoreChange(
                                                        round.round_number,
                                                        Number(team.id),
                                                        e,
                                                    )
                                                }
                                            />
                                        </TableCell>
                                    );
                                })}
                                <TableCell />
                                <TableCell className="sticky right-0 z-10 bg-background py-3 text-right font-semibold">
                                    {teamSumScores(team.id)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {errors['tournament'] && (
                <p className="mt-2 text-sm text-red-500">
                    {errors['tournament']}
                </p>
            )}
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
                {processing ? (
                    <>
                        <Loader2Icon className="animate-spin" />
                        Submitting...
                    </>
                ) : (
                    'Submit score'
                )}
            </Button>
        </>
    );
}
