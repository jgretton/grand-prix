import { Form } from '@inertiajs/react';
import { LoaderCircleIcon, Trash2Icon } from 'lucide-react';
import TournamentController from '@/actions/App/Http/Controllers/TournamentController';
import type { Tournament } from '@/types';
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
    tournament: Tournament;
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
}

export default function DeleteTournamentModal({
    tournament,
    modalOpen,
    setModalOpen,
}: Props) {
    return (
        <AlertDialog open={modalOpen} onOpenChange={setModalOpen}>
            <AlertDialogContent size="default">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                        <Trash2Icon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Delete Tournament</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete{' '}
                        <span className="font-semibold text-black">
                            {tournament.name}
                        </span>{' '}
                        and all teams and scores associated with it. This action
                        cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Form
                    {...TournamentController.destroy.form({ tournament: tournament })}
                    onSuccess={() => setModalOpen(false)}
                >
                    {({ processing }) => (
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
                                    'Delete Tournament'
                                )}
                            </Button>
                            <AlertDialogCancel variant="outline">
                                Cancel
                            </AlertDialogCancel>
                        </AlertDialogFooter>
                    )}
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    );
}