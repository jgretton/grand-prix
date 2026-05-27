import { Round, Tournament } from '@/types';
import { useForm } from '@inertiajs/react';
import { PlusIcon, XIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function ScoringGrid({
    tournament,
}: {
    tournament: Tournament;
}) {
    console.log(tournament);
    const { data, setData, post, processing, errors } = useForm<{
        rounds: Round[];
    }>({
        rounds: [{ round_number: 1, round_scores: [] }],
    });
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
                                            deleteRound(round.round_number)
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
                            <p className="font-medium">{team.name}</p>
                        </div>
                        {data.rounds.map((round, idx) => {
                            const teamScore = round.round_scores.find(
                                (t) => Number(t.team_id) === Number(team.id),
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
                {processing ? 'Submitting...' : 'Submit score'}
            </Button>
        </>
    );
}
