import Heading from '@/components/heading';
import { dashboard } from '@/routes';
import tournaments from '@/routes/tournaments';
import { Head } from '@inertiajs/react';

export default function EditTournamentPage({ tournament }) {
    return (
        <div className="">
            <Head title="Edit Tournament" />
            <div className="mt-10 flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading title="Edit Tournament" />
            </div>
        </div>
    );
}

EditTournamentPage.layout = ({
    tournament,
}: {
    tournament: { id: number };
}) => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Tournament',
            href: tournaments.show.url(tournament),
        },
        {
            title: 'Edit Tournament',
            href: tournaments.edit.url(tournament),
        },
    ],
});
