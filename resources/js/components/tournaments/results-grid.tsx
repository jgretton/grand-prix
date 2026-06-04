import type { FinalScore, Tournament } from '@/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table';

export default function ResultsGrid({
    tournament,
    finalScores,
}: {
    tournament: Tournament;
    finalScores: FinalScore[];
}) {
    return (
        <div className="overflow-auto rounded-md border">
            <Table>
                <TableHeader className="sticky top-0 z-20 bg-background">
                    <TableRow>
                        <TableHead
                            className="sticky left-0 z-10 w-px whitespace-nowrap bg-background"
                            style={{ boxShadow: '1px 0 0 0 var(--color-border)' }}
                        >
                            Team
                        </TableHead>
                        {tournament.rounds.map((round) => (
                            <TableHead
                                key={round.round_number}
                                className="w-32 text-center"
                            >
                                R{round.round_number}
                            </TableHead>
                        ))}
                        <TableHead className="sticky right-0 z-10 bg-background text-right font-semibold">
                            Total
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {finalScores.map((entry, idx) => (
                        <TableRow key={entry.team.id}>
                            <TableCell
                                className="sticky left-0 z-10 w-px whitespace-nowrap bg-background py-3 font-medium"
                                style={{ boxShadow: '1px 0 0 0 var(--color-border)' }}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-muted-foreground">
                                        {idx + 1}
                                    </span>
                                    {entry.team.name}
                                </div>
                            </TableCell>
                            {tournament.rounds.map((round, roundIdx) => (
                                <TableCell
                                    key={round.round_number}
                                    className="w-32 py-3 text-center"
                                >
                                    {entry.round_scores[roundIdx]?.score ?? '–'}
                                </TableCell>
                            ))}
                            <TableCell className="sticky right-0 z-10 bg-background py-3 text-right font-semibold">
                                {entry.final_score}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
