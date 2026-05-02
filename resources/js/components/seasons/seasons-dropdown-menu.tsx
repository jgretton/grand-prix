import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Season } from '@/types';
import { router } from '@inertiajs/react';
import { EllipsisVerticalIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import DeleteSeasonModal from '../modals/delete-season';
import { Button } from '../ui/button';

export default function SeasonsDropdownMenu({ season }: { season: Season }) {
    const [modalOpen, setModalOpen] = useState(false);

    const setCurrentSeason = () => {
        router.patch(`/seasons/${season.id}/set-current`);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                        <EllipsisVerticalIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            disabled={season.is_current === true}
                            variant="default"
                            onClick={() => setCurrentSeason()}
                        >
                            Set as current
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setModalOpen(true)}
                            variant="destructive"
                        >
                            <Trash2Icon /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            <DeleteSeasonModal
                season={season}
                setModalOpen={setModalOpen}
                modalOpen={modalOpen}
            />
        </>
    );
}
