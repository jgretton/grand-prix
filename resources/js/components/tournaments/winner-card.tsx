import type { FinalScore } from '@/types';
import { TrophyIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

export default function WinnerCard({
    finalScores,
}: {
    finalScores: FinalScore[];
}) {
   
    const highestScore = finalScores[0].final_score;
    const winners = finalScores.filter(fs => fs.final_score === highestScore).map(team =>team.team.name);

    return (
        <Card className="mb-10 border-amber-300 bg-amber-50">
            <CardContent className="flex flex-row items-center justify-between gap-6">
                <TrophyIcon size={40} color="gold" />
                <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase">
                        {winners.length > 1 ? 'Winners' : 'Winner'}
                    </p>
                        <p className="text-lg">{winners.join(' & ')}</p>
                </div>
                <p className="flex flex-col items-end text-2xl/tight font-medium">
                    {finalScores[0].final_score}
                    <span className="text-sm font-normal">points</span>
                </p>
            </CardContent>
        </Card>
    );
}
