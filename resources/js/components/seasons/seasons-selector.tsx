import { DotIcon } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Season, Seasons } from '@/types';

interface SeasonsSelectorPageProps {
    season?: Season;
    seasons: Seasons;
    handleSeasonChange: (value: number) => void;
    tournamentSelect?: number;
    triggerClassName?: string;
}

export default function SeasonsSelector({
    season,
    handleSeasonChange,
    seasons,
    tournamentSelect,
    triggerClassName = 'w-full sm:w-1/2',
}: SeasonsSelectorPageProps) {
    return (
        <Select
            value={season?.id ? String(season.id) : String(tournamentSelect)}
            onValueChange={(value) => {
                handleSeasonChange(Number(value));
            }}
        >
            <SelectTrigger className={triggerClassName}>
                <SelectValue placeholder="Current Season" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {seasons.map((current, index) => (
                        <SelectItem
                            value={String(current.id)}
                            key={index}
                            className="inline-flex items-center"
                        >
                            {current.name}
                            {current.is_current && (
                                <span className="inline-flex items-center text-xs text-muted-foreground">
                                    <DotIcon className="size-6" /> active
                                </span>
                            )}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
