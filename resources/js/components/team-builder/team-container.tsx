import { useTeamBuilderContext } from '@/context/team-builder-context';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import { PlusIcon } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { Button } from '../ui/button';
import TeamCard from './team-card';

export function TeamContainer({ errors }) {
    const { teams, addTeam, movePlayerToTeam } = useTeamBuilderContext();
    const handleDrop = useCallback(
        ({ source, location }) => {
            const destination = location.current.dropTargets.length;

            if (!destination) {
                return;
            }

            if (source.data.type === 'player') {
                const draggedPlayerId = source.data.playerId;

                const initialTeamCard = location.initial.dropTargets.find(
                    (target) => target.data.team,
                );

                if (!initialTeamCard) {
                    return;
                }

                const initialTeamId = initialTeamCard.data.team.id;

                const targetTeamCard = location.current.dropTargets.find(
                    (target) => target.data.team,
                );

                if (!targetTeamCard) {
                    return;
                }

                const targetTeamId = targetTeamCard.data.team.id;

                movePlayerToTeam(targetTeamId, draggedPlayerId, initialTeamId);
            }
        },
        [movePlayerToTeam],
    );

    useEffect(() => {
        return monitorForElements({
            onDrop: handleDrop,
        });
    }, [handleDrop]);

    return (
        <div className="grid size-full h-full grid-cols-3 gap-5 rounded-md border-2 border-dashed p-4 md:grid-cols-2">
            {teams.map((team, idx) => (
                <TeamCard
                    team={team}
                    key={idx}
                    errorMessage={errors[`teams.${idx}.players`]}
                />
            ))}
            <Button
                variant={'ghost'}
                className="flex h-full min-h-20 items-center justify-center rounded-md border-2 border-dashed"
                onClick={() => addTeam()}
            >
                <PlusIcon /> Add Another Team
            </Button>
        </div>
    );
}
