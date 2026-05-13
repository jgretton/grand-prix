import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Tournament } from '@/types';
import { Head } from '@inertiajs/react';
import { PlayIcon } from 'lucide-react';
import { useState } from 'react';

export default function TournamentPage({
    tournament,
}: {
    tournament: Tournament;
}) {
    const [rounds, setRounds] = useState([{ round: 1, team_scores: [] }]);

    console.log(tournament);

    const addRound = () => {
        setRounds((prev) => [
            ...prev,
            { round: rounds.length + 1, team_scores: [] },
        ]);
    };

    // const handleRoundScoreChange = (round, e) => {
    //     const idx = rounds.findIndex((a) => a.round === round);
    //     setRounds((prev) => [...prev, prev[round].team_scores:{ 'name' : 'hello'}]);
    // };

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

                <div
                    className="grid w-full gap-x-3 p-4 text-center"
                    style={{
                        gridTemplateColumns: `auto repeat(${rounds.length}, 3rem) 1fr auto`,
                    }}
                >
                    <div className="col-span-full grid grid-cols-subgrid border-b py-2">
                        <div />
                        {rounds.map((round) => (
                            <p className="">{round.round}</p>
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
                            {rounds.map((round) => (
                                <input
                                    className="rounded-sm border-2 px-2 py-0.5 text-center"
                                    // onChange={(e) =>
                                    //     handleRoundScoreChange(
                                    //         round.round,
                                    //         team.name,
                                    //         e,
                                    //     )
                                    // }
                                />
                            ))}
                            <div />
                            <p>23</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
