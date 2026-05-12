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
    const [rounds, setRounds] = useState([{ round: 1, team_scores: {} }]);
    const [scores, setScores] = useState<
        Record<number, Record<number, number>>
    >({});

    const updateScore = (teamId: number, roundId: number, value: number) => {
        setScores((prev) => ({
            ...prev,
            [teamId]: { ...prev[teamId], [roundId]: value },
        }));
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
                <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
                    <table className="w-full min-w-[520px] border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 dark:bg-zinc-800/50">
                                <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-zinc-500 uppercase">
                                    Team
                                </th>
                                {rounds.map((round) => (
                                    <th
                                        key={round.round}
                                        className="min-w-[100px] px-4 py-3 text-center text-xs font-medium tracking-wide text-zinc-500 uppercase"
                                    >
                                        Round {round.round}
                                    </th>
                                ))}
                                <th className="w-14 px-4 py-3 text-center">
                                    <button
                                        // onClick={addRound}
                                        className="mx-auto flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-zinc-300 text-zinc-400 transition-colors hover:border-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:border-zinc-600 dark:hover:bg-zinc-700"
                                    >
                                        +
                                    </button>
                                </th>
                                <th className="min-w-[64px] bg-zinc-100 px-4 py-3 text-center text-xs font-medium tracking-wide text-zinc-500 uppercase dark:bg-zinc-800">
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tournament.teams.map((team, i) => (
                                <tr
                                    key={team.id}
                                    className="border-t border-zinc-100 transition-colors hover:bg-zinc-50/50 dark:border-zinc-800 dark:hover:bg-zinc-800/30"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2.5">
                                            <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" />
                                            <span className="text-sm font-medium">
                                                {team.name}
                                            </span>
                                        </div>
                                    </td>
                                    {rounds.map((round) => (
                                        <td
                                            key={round.round}
                                            className="px-4 py-3"
                                        >
                                            <input
                                                type="number"
                                                min={0}
                                                value={
                                                    scores[team.id]?.[
                                                        round.round
                                                    ] ?? ''
                                                }
                                                onChange={(e) =>
                                                    updateScore(
                                                        team.id,
                                                        round.round,
                                                        Number(e.target.value),
                                                    )
                                                }
                                                className="mx-auto block h-9 w-16 rounded-md border border-zinc-200 bg-white text-center text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
                                            />
                                        </td>
                                    ))}
                                    <td className="px-4 py-3" />
                                    <td className="bg-zinc-50 px-4 py-3 text-center text-sm font-semibold dark:bg-zinc-800/50">
                                        {Object.values(
                                            scores[team.id] ?? {},
                                        ).reduce((a, b) => a + b, 0)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
