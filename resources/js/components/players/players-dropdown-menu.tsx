import { Player } from '@/types/players';
import { router } from '@inertiajs/react';
import {
    CheckCircleIcon,
    MoreHorizontal,
    PencilIcon,
    Trash2Icon,
    XCircleIcon,
} from 'lucide-react';
import { useState } from 'react';
import DeletePlayerModal from '../modals/delete-player';
import UpdatePlayerNameModal from '../modals/update-player-name';
import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export default function PlayersDropdownMenu({ player }: { player: Player }) {
    const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const toggleActive = () => {
        // console.log('player', player);
        router.patch(`players/${player.id}/toggle-active`);
    };

    const StatusText = player.is_active === true ? 'active' : 'inactive';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toggleActive()}>
                    {player.is_active ? <CheckCircleIcon /> : <XCircleIcon />}{' '}
                    Set player {StatusText}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setModalUpdateOpen(true)}>
                    <PencilIcon /> Update Players Name
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setModalOpen(true)}
                    variant="destructive"
                >
                    <Trash2Icon /> Delete Player
                </DropdownMenuItem>
            </DropdownMenuContent>
            <UpdatePlayerNameModal
                modalOpen={modalUpdateOpen}
                setModalOpen={setModalUpdateOpen}
                player={player}
            />
            <DeletePlayerModal
                player={player}
                setModalOpen={setModalOpen}
                modalOpen={modalOpen}
            />
        </DropdownMenu>
    );
}
