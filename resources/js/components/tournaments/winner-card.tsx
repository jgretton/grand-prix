import { FinalScore } from '@/types';
import { TrophyIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

export default function WinnerCard({
    finalScores,
}: {
    finalScores: FinalScore[];
}) {
    return (
        <Card className="mb-10 border-amber-300 bg-amber-50">
            <CardContent className="flex flex-row items-center justify-between gap-6">
                <TrophyIcon size={40} color="gold" />
                <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase">
                        Winner
                    </p>
                    <p className="text-lg">{finalScores[0].team.name}</p>
                </div>
                <p className="flex flex-col items-end text-2xl/tight font-medium">
                    {finalScores[0].final_score}
                    <span className="text-sm font-normal">points</span>
                </p>
            </CardContent>
        </Card>
    );
}
