import PlayerController from '@/actions/App/Http/Controllers/PlayerController';
import { Player } from '@/types/players';
import { Form } from '@inertiajs/react';
import { LoaderCircleIcon, Trash2Icon } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
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
                <AlertDialogFooter>
                    <AlertDialogCancel variant="outline">
                        Cancel
                    </AlertDialogCancel>
                    <Form
                        {...PlayerController.destroy.form({ player: player })}
                        options={{
                            preserveScroll: true,
                        }}
                        onSuccess={() => setModalOpen(false)}
                        onError={(errors) => {
                            setModalOpen(true);
                            console.log(errors);
                        }}
                    >
                        {({ errors, processing }) => (
                            <>
                                <AlertDialogAction
                                    variant="destructive"
                                    asChild
                                >
                                    <Button
                                        className="w-full"
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
                                </AlertDialogAction>
                                {/* {errors.seasonError && (
                                    <p className="text-sm text-red-500">
                                        {errors.seasonError}
                                    </p>
                                )} */}
                            </>
                        )}
                    </Form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
