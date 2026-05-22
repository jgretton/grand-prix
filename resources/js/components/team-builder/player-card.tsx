import { useTeamBuilderContext } from '@/context/team-builder-context';
import { Player } from '@/types/players';
import { attachClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
    draggable,
    dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { GripVertical, XIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import invariant from 'tiny-invariant';
import { Button } from '../ui/button';

export default function PlayerCard({
    player,
    teamId,
}: {
    player: Partial<Player>;
    teamId: string;
}) {
    const { removePlayerFromTeam } = useTeamBuilderContext();
    const [isDragging, setIsDragging] = useState(false);

    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        invariant(el);

        return combine(
            draggable({
                element: el,
                getInitialData: () => ({ type: 'player', playerId: player.id }),
                onDragStart: () => setIsDragging(true),
                onDrop: () => setIsDragging(false),
            }),
            // Add dropTargetForElements to make the card a drop target
            dropTargetForElements({
                element: el,
                getData: ({ input, element }) => {
                    // To attach card data to a drop target
                    const data = { type: 'player', playerId: player.id };

                    // Attaches the closest edge (top or bottom) to the data object
                    // This data will be used to determine where to drop card relative
                    // to the target card.
                    return attachClosestEdge(data, {
                        input,
                        element,
                        allowedEdges: ['top', 'bottom'],
                    });
                },
                getIsSticky: () => true, // To make a drop target "sticky"
            }),
        );
    }, [player.id]);

    return (
        <div
            className={`flex w-full flex-row items-center justify-between rounded-md p-2 shadow-sm hover:bg-gray-100 ${isDragging && 'opacity-40'} cursor-grab active:cursor-grabbing`}
            ref={ref}
        >
            <div className="flex items-center gap-2">
                <GripVertical className="size-5" />
                <p className="text-wrap">{player.name}</p>
            </div>
            <Button
                size={'icon'}
                className=""
                variant={'ghost'}
                onClick={() => removePlayerFromTeam(teamId, player.id)}
            >
                <XIcon />
            </Button>
        </div>
    );
}
