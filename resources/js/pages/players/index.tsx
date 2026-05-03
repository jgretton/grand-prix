import { AppContent } from '@/components/app-content';
import Heading from '@/components/heading';
import AddPlayerModal from '@/components/modals/add-player';
import { columns } from '@/components/players/columns';
import { DataTable } from '@/components/players/data-table';
import { Players } from '@/types/players';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

interface PlayersPageProps {
    players: Players;
}

export default function PlayersPage({ players }: PlayersPageProps) {
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    console.log(players);

    return (
        <>
            <Head title="Dashboard" />
            <div className="mt-4 flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full items-center justify-between">
                    <Heading
                        title="Players"
                        description="Here you can manage all players withing the application."
                    />
                    <AddPlayerModal
                        modalOpen={modalOpen}
                        setModalOpen={setModalOpen}
                    />
                </div>

                <AppContent>
                    <DataTable columns={columns} data={players} />
                </AppContent>
            </div>
        </>
    );
}
