import { LoaderCircleIcon, Trash2Icon } from 'lucide-react';

import SeasonController from '@/actions/App/Http/Controllers/SeasonController';
import { Season } from '@/types';
import { Form } from '@inertiajs/react';
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
interface DeleteSeasonModalPageProps {
    season: Season;
    setModalOpen: (value: boolean) => void;
    modalOpen: boolean;
}

export default function DeleteSeasonModal({
    season,
    setModalOpen,
    modalOpen,
}: DeleteSeasonModalPageProps) {
    return (
        <AlertDialog open={modalOpen} onOpenChange={setModalOpen}>
            <AlertDialogContent size="default">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                        <Trash2Icon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Delete season?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete this season and all data
                        associated with it. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel variant="outline">
                        Cancel
                    </AlertDialogCancel>
                    <Form
                        {...SeasonController.destroy.form({ season: season })}
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
                                            'Delete'
                                        )}
                                    </Button>
                                </AlertDialogAction>
                                {errors.seasonError && (
                                    <p className="text-sm text-red-500">
                                        {errors.seasonError}
                                    </p>
                                )}
                            </>
                        )}
                    </Form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
