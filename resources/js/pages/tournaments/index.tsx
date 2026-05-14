import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Round, Tournament } from '@/types';
import { Head, router } from '@inertiajs/react';
import { MinusIcon, PlayIcon } from 'lucide-react';
import { useState } from 'react';

export default function TournamentPage({
    tournament,
}: {
    tournament: Tournament;
}) {
    console.log(tournament);
    const [roundsData, setRoundsData] = useState<Round[]>([
        { round_number: 1, round_scores: [{ team_id: 1, score: 21 }] },
        { round_number: 2, round_scores: [{ team_id: 1, score: 21 }] },
    ]);

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

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading title="Tournament Details" />

                <div className="flex w-full flex-col border-b-2 pb-20">
                    <p>{tournament.name}</p>

                    <div className="mt-10 flex w-full flex-row flex-wrap gap-10">
                        {tournament.teams?.map((team) => (
                            <ul key={team.id} className="grid gap-2 p-4">
                                <li className="mb-2 text-base font-medium">
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
                            Confirm that you are happy with the team and this
                            will start the tournament
                        </p>
                        <Button className="self-end">
                            <PlayIcon />
                            Start Tournament
                        </Button>
                    </div>
                </div>
                {tournament.is_completed
                    ? 'DO NOT ENTER'
                    : 'Tournament in progress'}
                <div
                    className="grid w-full gap-x-3 p-4 text-center"
                    style={{
                        gridTemplateColumns: `auto repeat(${roundsData.length}, 3rem) 1fr auto`,
                    }}
                >
                    <div className="col-span-full grid grid-cols-subgrid border-b py-2">
                        <div />
                        {roundsData.map((round) => (
                            <div className="inline-flex gap-3" key={round.id}>
                                <p className="">{round.round_number}</p>
                                {round.round_number > 1 && (
                                    <button
                                        onClick={() =>
                                            deleteRound(round.round_number)
                                        }
                                    >
                                        <MinusIcon size={12} />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            className="text-left"
                            onClick={() => addRound()}
                        >
                            Add round
                        </button>
                        <p>Scores</p>
                    </div>
                    {tournament.teams?.map((team) => (
                        <div
                            className="col-span-full grid grid-cols-subgrid border-b py-4"
                            key={team.id}
                        >
                            <div className="border-r-2 px-4">
                                <p>{team.name}</p>
                            </div>
                            {roundsData.map((round) => {
                                const teamScore = round.round_scores.find(
                                    (t) =>
                                        Number(t.team_id) === Number(team.id),
                                )?.score;

                                return (
                                    <input
                                        // type="number"
                                        className="rounded-sm border-2 px-2 py-0.5 text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                        value={teamScore}
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
                            <p>{teamSumScores(team.id)}</p>
                            {/* <p>0</p> */}
                        </div>
                    ))}
                </div>

                <button onClick={() => submitroundScores()}>
                    Submit score
                </button>
            </div>
        </>
    );
}
