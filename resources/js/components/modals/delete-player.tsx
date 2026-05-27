import { Form } from '@inertiajs/react';
import { LoaderCircleIcon, Trash2Icon } from 'lucide-react';
import PlayerController from '@/actions/App/Http/Controllers/PlayerController';
import type { Player } from '@/types/players';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';

interface Props {
    player: Player;
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
}

export default function DeletePlayerModal({
    player,
    setModalOpen,
    modalOpen,
}: Props) {
    return (
        <AlertDialog open={modalOpen} onOpenChange={setModalOpen}>
            <AlertDialogContent size="default">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                        <Trash2Icon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Delete Player</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete{' '}
                        <span className="font-semibold text-black">
                            {player.name}
                        </span>{' '}
                        and all data associated with them. This action cannot be
                        undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Form
                    {...PlayerController.destroy.form({ player: player })}
                    options={{
                        preserveScroll: true,
                    }}
                    onSuccess={() => setModalOpen(false)}
                >
                    {({ errors, processing }) => (
                        <>
                            <AlertDialogFooter>
                                <Button
                                    className="w-full sm:w-auto"
                                    variant="destructive"
                                    disabled={processing}
                                    type="submit"
                                >
                                    {processing ? (
                                        <>
                                            <LoaderCircleIcon className="animate-spin" />{' '}
                                            Deleting
                                        </>
                                    ) : (
                                        'Delete Player'
                                    )}
                                </Button>
                                <AlertDialogCancel variant="outline">
                                    Cancel
                                </AlertDialogCancel>
                            </AlertDialogFooter>
                            {errors.playerError && (
                                <p className="mt-2 text-right text-sm text-red-500">
                                    {errors.playerError}
                                </p>
                            )}
                        </>
                    )}
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    );
}