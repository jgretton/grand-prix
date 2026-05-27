import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useTeamBuilderContext } from '@/context/team-builder-context';
import type { Player, Players, Team } from '@/types/players';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import { Field } from '../ui/field';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface PlayerSelectModalProps {
    team: Team;
    open: boolean;
    setOpen: (value: boolean) => void;
}

export default function PlayerSelectModal({
    team,
    open,
    setOpen,
}: PlayerSelectModalProps) {
    const { availablePlayers, addPlayersToTeam } = useTeamBuilderContext();

    const [searchInput, setSearchInput] = useState<string>('');

    const [selectedPlayers, setSelectedPlayers] = useState<Players>([]);

    const handleCheckedPlayers = (checked: boolean, player: Player) => {
        setSelectedPlayers((prev) =>
            checked
                ? [...prev, player]
                : prev.filter((p) => p.id !== player.id),
        );
    };

    const filteredPlayers = availablePlayers.filter((player) =>
        player.name.toLowerCase().includes(searchInput.toLowerCase().trim()),
    );

    return (
        <Dialog
            open={open}
            onOpenChange={() => {
                setOpen(!open);
                setSelectedPlayers([]);
            }}
        >
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                    <PlusIcon /> Add Players
                </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-7xl">
                <DialogHeader>
                    <DialogTitle>Add players to {team.name}</DialogTitle>
                    <DialogDescription>
                        Select the players you want to add to this team.
                    </DialogDescription>
                </DialogHeader>
                <Field orientation="horizontal">
                    <Input
                        type="search"
                        placeholder="Search..."
                        onChange={(e) => setSearchInput(e.target.value)}
                        value={searchInput}
                    />
                </Field>
                {filteredPlayers.length === 0 ? (
                    <p>No players found</p>
                ) : (
                    <ul className="grid max-h-96 gap-3 overflow-y-auto">
                        {filteredPlayers.map((player) => {
                            const isChecked = selectedPlayers.some(
                                (a) => a.id === player.id,
                            );

                            return (
                                <li
                                    key={player.id}
                                    className="w-full rounded-md bg-gray-50"
                                >
                                    <Label
                                        className={`flex size-full items-center justify-between rounded-md border border-transparent p-4 ${isChecked && 'border-slate-800 bg-slate-300'}`}
                                    >
                                        {player.name}
                                        <Checkbox
                                            checked={isChecked}
                                            onCheckedChange={(
                                                checked: boolean,
                                            ) =>
                                                handleCheckedPlayers(
                                                    checked,
                                                    player,
                                                )
                                            }
                                        />
                                    </Label>
                                </li>
                            );
                        })}
                    </ul>
                )}
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        onClick={() => {
                            addPlayersToTeam(team.id, selectedPlayers);
                            setSelectedPlayers([]);
                            setOpen(false);
                        }}
                        disabled={selectedPlayers.length === 0}
                    >
                        Add {selectedPlayers.length} Player(s)
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
