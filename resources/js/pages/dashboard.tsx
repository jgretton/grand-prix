import SeasonController from '@/actions/App/Http/Controllers/SeasonController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import {
    EllipsisVerticalIcon,
    Loader2Icon,
    PlusIcon,
    Table2Icon,
    Trash2Icon,
} from 'lucide-react';
import { useState } from 'react';

export default function Dashboard({ seasons, currentSeason }) {
    const [modalOpen, setModelOpen] = useState(false);

    const NewSeasonDialog = () => (
        <Dialog onOpenChange={setModelOpen} open={modalOpen}>
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
                    onSuccess={() => setModelOpen(false)}
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

    if (seasons.length === 0) {
        return (
            <>
                <Head title="Dashboard" />
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <Table2Icon />
                            </EmptyMedia>
                            <EmptyTitle>No Current Season</EmptyTitle>
                            <EmptyDescription>
                                You have not created a season yet.
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent className="flex-row justify-center gap-2">
                            <NewSeasonDialog />
                        </EmptyContent>
                    </Empty>
                </div>
            </>
        );
    } else {
        return (
            <>
                <Head title="Dashboard" />
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Current season</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-row justify-between">
                            <Select value={currentSeason[0].name}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Current Season" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {seasons.map((season, index) => (
                                            <SelectItem
                                                value={season.name}
                                                key={index}
                                            >
                                                {season.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <div className="flex-end space-x-2">
                                <NewSeasonDialog />
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="icon" variant="ghost">
                                            <EllipsisVerticalIcon />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem>
                                                Set as current season
                                            </DropdownMenuItem>
                                            <DropdownMenuItem variant="destructive">
                                                <Trash2Icon /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </>
        );
    }
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
