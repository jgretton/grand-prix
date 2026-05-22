import type { FinalScore, Tournament } from '@/types';

export default function ResultsGrid({
    tournament,
    finalScores,
}: {
    tournament: Tournament;
    finalScores: FinalScore[];
}) {
    return (
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

                <p className="self-center px-2 text-center text-sm">Scores</p>
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
                        <p className="font-medium">{team.team.name}</p>
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
    );
}
