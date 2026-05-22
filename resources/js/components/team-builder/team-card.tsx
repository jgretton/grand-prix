import { useTeamBuilderContext } from '@/context/team-builder-context';
import { Team } from '@/types/players';
import { XIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import PlayerSelectModal from '../modals/player-select';
import { Button } from '../ui/button';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../ui/card';
import PlayerCard from './player-card';

import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import invariant from 'tiny-invariant';
import InputError from '../input-error';

interface TeamCardProps {
    team: Team;
    errorMessage: string;
}

export default function TeamCard({ team, errorMessage }: TeamCardProps) {
    const [openPLayerSelectModal, setOpenPlayerSelectModal] =
        useState<boolean>(false);

    const { removeTeam } = useTeamBuilderContext();

    const columnRef = useRef(null);
    const [isDraggedOver, setIsDraggedOver] = useState(false);

    useEffect(() => {
        const columnEl = columnRef.current;
        invariant(columnEl); // Ensure the column element exists

        // Set up the drop target for the column element
        return dropTargetForElements({
            element: columnEl,
            onDragStart: () => setIsDraggedOver(true),
            onDragEnter: () => setIsDraggedOver(true),
            onDragLeave: () => setIsDraggedOver(false),
            onDrop: () => setIsDraggedOver(false),
            getData: () => ({ team }),
        });
    }, [team.id]);

    return (
        <Card
            className={`flex h-full w-full shrink-0 justify-between ${errorMessage && 'border-red-500'} ${isDraggedOver && 'bg-blue-50 ring-2 ring-blue-400'}`}
            ref={columnRef}
        >
            <CardHeader>
                <CardTitle>{team.name}</CardTitle>
                <CardDescription>
                    {team.players.length} player(s) selected
                </CardDescription>
                <CardAction>
                    <Button size={'icon'} onClick={() => removeTeam(team.id)}>
                        <XIcon />
                    </Button>
                </CardAction>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-2">
                {team.players.length === 0 ? (
                    <div className="flex h-full items-center justify-center rounded-md border-2 border-dashed py-4 text-sm text-gray-400">
                        Drag players here
                    </div>
                ) : (
                    team.players.map((player, idx) => (
                        <PlayerCard
                            player={player}
                            key={idx}
                            teamId={team.id}
                        />
                    ))
                )}
            </CardContent>

            <CardFooter className="flex-end grid gap-2">
                <InputError message={errorMessage} />
                <PlayerSelectModal
                    team={team}
                    open={openPLayerSelectModal}
                    setOpen={setOpenPlayerSelectModal}
                />
                <p className="text-center text-xs text-muted-foreground">
                    Or drag players from another team
                </p>
            </CardFooter>
        </Card>
    );
}
