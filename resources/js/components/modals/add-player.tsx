import PlayerController from '@/actions/App/Http/Controllers/PlayerController';
import { Form } from '@inertiajs/react';
import { Loader2Icon, PlusIcon } from 'lucide-react';
import InputError from '../input-error';
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
import { Field, FieldGroup } from '../ui/field';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface AddSeasonModalPageProps {
    setModalOpen: (value: boolean) => void;
    modalOpen: boolean;
}

export default function AddPlayerModal({
    setModalOpen,
    modalOpen,
}: AddSeasonModalPageProps) {
    return (
        <Dialog onOpenChange={setModalOpen} open={modalOpen}>
            <DialogTrigger asChild>
                <Button variant="default">
                    <PlusIcon /> Add Player
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <Form
                    {...PlayerController.store.form()}
                    method="post"
                    disableWhileProcessing
                    resetOnSuccess
                    onSuccess={() => setModalOpen(false)}
                    transform={(data) => {
                        const newIsActive = data.is_active === 'on';
                        return {
                            ...data,
                            is_active: newIsActive,
                        };
                    }}
                >
                    {({ processing, errors }) => (
                        <>
                            {console.log(errors)}
                            <DialogHeader>
                                <DialogTitle>Add New Player</DialogTitle>
                                <DialogDescription>
                                    Type the name of the player and if you would
                                    like to make them currently active within
                                    the application.
                                </DialogDescription>
                            </DialogHeader>
                            <FieldGroup className="my-5">
                                <Field>
                                    <Label htmlFor="name">Name *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="John Smith"
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </Field>
                                <Field orientation={'horizontal'}>
                                    <Checkbox
                                        name="is_active"
                                        id="is_active"
                                        defaultChecked={false}
                                    />
                                    <Label htmlFor="is_active">
                                        Set as active player
                                    </Label>
                                </Field>
                            </FieldGroup>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" disabled={processing}>
                                    {processing ? (
                                        <Loader2Icon className="animate-spin" />
                                    ) : (
                                        'Save changes'
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
