import SeasonController from '@/actions/App/Http/Controllers/SeasonController';
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

export default function AddSeasonModal({
    setModalOpen,
    modalOpen,
}: AddSeasonModalPageProps) {
    return (
        <Dialog onOpenChange={setModalOpen} open={modalOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <PlusIcon /> New Season
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <Form
                    {...SeasonController.store.form()}
                    method="post"
                    disableWhileProcessing
                    resetOnSuccess
                    onSuccess={() => setModalOpen(false)}
                    transform={(data) => {
                        const newIsCurrent = data.is_current === 'on';
                        return {
                            ...data,
                            is_current: newIsCurrent,
                        };
                    }}
                >
                    {({ processing, errors }) => (
                        <>
                            <DialogHeader>
                                <DialogTitle>Create New Season</DialogTitle>
                                <DialogDescription>
                                    Type the name of the new season and if you
                                    would like to make it the current one.
                                </DialogDescription>
                            </DialogHeader>
                            <FieldGroup>
                                <Field>
                                    <Label htmlFor="name">Name *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="2024/2025"
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </Field>
                                <Field orientation={'horizontal'}>
                                    <Checkbox
                                        name="is_current"
                                        id="is_current"
                                        defaultChecked={false}
                                    />
                                    <Label htmlFor="is_current">
                                        Set as current season
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
