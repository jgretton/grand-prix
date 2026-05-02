import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Season, Seasons } from '@/types';

interface SeasonsSelectorPageProps {
    season: Season;
    seasons: Seasons;
    handleSeasonChange: (value: number) => void;
}

export default function SeasonsSelector({
    season,
    handleSeasonChange,
    seasons,
}: SeasonsSelectorPageProps) {
    return (
        <Select
            value={String(season.id)}
            onValueChange={(value) => {
                handleSeasonChange(Number(value));
            }}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Current Season" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {seasons.map((current, index) => (
                        <SelectItem value={String(current.id)} key={index}>
                            {current.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
