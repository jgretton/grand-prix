import Heading from '@/components/heading';
import { dashboard } from '@/routes';
import tournaments from '@/routes/tournaments';
import { Head } from '@inertiajs/react';

export default function CreateTournamentPage() {
    return (
        <div className="">
            <Head title="Dashboard" />
            <div className="mt-10 flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Create Tournament"
                    description="Follow the instructions below to create a tournament for the grand-prix"
                />

                {/*
                
                    Create a form
                    - name (could be made from the date?)
                    - some way to decide how many teams are at this session.
                    - then under the teams we can press a btton to bring up all player names. and allocate them to that team
                        - once allocated they are removed from the list.
                        - if they are removed from team they are brought back into list.
                        - need to think about team names
                            - they will always be numbers. what if they want to remove all players? do we have a remove all playe rbutton or remove team button?
                            - do we allow for click and drag to move players around or have it sop they have to be unselected and selected?
                    - once teams are finalised they can start the tournament
                        - takes them to the singlular page for the tournament where they can still make changes to the teams here as playeres might not turn up.
                        - they set number of rounds for round robin, it generates team matches. Then 

                        WHAT IF:
                        for cannons specific problem they keep one team on a single court so that everyone rotates around them so they play everyone. I could allow for you to enter how many courts are in use so it can then generate games?
                        Allows for teams to be off if there is to omany teams for the courts or uneven number etc.
                
                */}
            </div>
        </div>
    );
}

CreateTournamentPage.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Create Tournament',
            href: tournaments.create,
        },
    ],
};
