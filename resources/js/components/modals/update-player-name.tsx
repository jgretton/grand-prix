import PlayerController from '@/actions/App/Http/Controllers/PlayerController';
import { Player } from '@/types/players';
import { Form } from '@inertiajs/react';
import { Loader2Icon } from 'lucide-react';
import InputError from '../input-error';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface Props {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    player: Player;
}

export default function UpdatePlayerNameModal({
    modalOpen,
    setModalOpen,
    player,
}: Props) {
    console.log(player);

    return (
        <Dialog onOpenChange={setModalOpen} open={modalOpen}>
            <DialogContent className="sm:max-w-sm">
                <Form
                    {...PlayerController.update.form({ player: player })}
                    method="patch"
                    disableWhileProcessing
                    resetOnSuccess
                    onSuccess={() => setModalOpen(false)}
                >
                    {({ processing, errors }) => (
                        <>
                            {console.log(errors)}
                            <DialogHeader>
                                <DialogTitle>Update Players Name</DialogTitle>
                                <DialogDescription>
                                    Type the name of the player and if you would
                                    like to make them currently active within
                                    the application.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="my-5 space-y-2">
                                <Label htmlFor="name">Name *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={player.name}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" disabled={processing}>
                                    {processing ? (
                                        <Loader2Icon className="animate-spin" />
                                    ) : (
                                        'Update'
                                    )}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
