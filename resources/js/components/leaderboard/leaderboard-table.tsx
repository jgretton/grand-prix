import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { Players, Tournament } from '@/types';
import { UserX } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

const rankInsetShadow: Record<number, string> = {
    1: 'inset 4px 0 0 0 #fbbf24',
    2: 'inset 4px 0 0 0 #94a3b8',
    3: 'inset 4px 0 0 0 #fb923c',
};

const rankBadge: Record<number, string> = {
    1: 'bg-amber-100 text-amber-700 ring-1 ring-amber-300',
    2: 'bg-slate-100 text-slate-600 ring-1 ring-slate-300',
    3: 'bg-orange-100 text-orange-700 ring-1 ring-orange-300',
};

export default function LeaderboardTable({
    players,
    tournaments,
}: {
    players: Players;
    tournaments: Tournament[];
}) {
    return (
        <div className="overflow-auto rounded-md border">
            <Table>
                <TableHeader className="sticky top-0 z-20 bg-background">
                    <TableRow>
                        <TableHead className="sticky left-0 z-10 bg-background">
                            <div className="flex items-center gap-2">
                                <span className="mr-4 w-7 shrink-0 text-center text-muted-foreground">
                                    #
                                </span>
                                Name
                            </div>
                        </TableHead>
                        {tournaments.map((t) => (
                            <TableHead
                                key={t.id}
                                className="max-w-24 truncate text-center"
                            >
                                {t.name}
                            </TableHead>
                        ))}
                        <TableHead className="sticky right-0 z-10 bg-background text-right font-semibold">
                            Total
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {players.map((player, idx) => (
                        <TableRow key={player.id}>
                            <TableCell
                                className="sticky left-0 z-10 bg-background py-3 font-medium"
                                style={{
                                    boxShadow: [
                                        '1px 0 0 0 var(--color-border)',
                                        player.rank
                                            ? rankInsetShadow[player.rank]
                                            : '',
                                    ]
                                        .filter(Boolean)
                                        .join(', '),
                                }}
                            >
                                <div className="flex items-center gap-5">
                                    <span className="ml-2 inline-flex h-7 w-7 shrink-0 items-center justify-center">
                                        {players[idx - 1]?.rank ===
                                        player.rank ? (
                                            <span className="h-7 w-7 shrink-0" />
                                        ) : player.rank &&
                                          rankBadge[player.rank] ? (
                                            <span
                                                className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${rankBadge[player.rank]}`}
                                            >
                                                {player.rank}
                                            </span>
                                        ) : (
                                            <span className="ml-2 inline-flex h-7 w-7 shrink-0 items-center justify-center text-sm text-muted-foreground">
                                                {player.rank}
                                            </span>
                                        )}
                                    </span>
                                    {player.name}
                                </div>
                            </TableCell>
                            {tournaments.map((t) => {
                                const playerScore = player.player_scores?.find(
                                    (p) => p.tournament_id === t.id,
                                );

                                if (!playerScore) {
                                    return (
                                        <TableCell
                                            key={t.id}
                                            className="py-3 text-center tabular-nums"
                                        >
                                            -
                                        </TableCell>
                                    );
                                }

                                const { score, attended } = playerScore;

                                return (
                                    <TableCell
                                        key={t.id}
                                        className="py-3 text-center tabular-nums"
                                    >
                                        {attended ? (
                                            score
                                        ) : (
                                            <span className="relative inline-block text-muted-foreground">
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        {score}
                                                        <UserX
                                                            aria-hidden
                                                            className="absolute -top-1 -right-4 size-3.5"
                                                        />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            Absence penalty (-10
                                                            lowest attended
                                                            score)
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </span>
                                        )}
                                    </TableCell>
                                );
                            })}
                            <TableCell className="sticky right-0 z-10 bg-background py-3 text-right font-semibold">
                                {player.player_scores_sum_score}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
