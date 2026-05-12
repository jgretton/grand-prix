import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import SeasonsSelector from '@/components/seasons/seasons-selector';
import { TeamContainer } from '@/components/team-builder/team-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    TeamBuilderProvider,
    useTeamBuilderContext,
} from '@/context/team-builder-context';
import { dashboard } from '@/routes';
import tournaments from '@/routes/tournaments';
import { Seasons } from '@/types';
import { Players } from '@/types/players';
import { Head, useForm } from '@inertiajs/react';
import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';

const CreateTournamentForm = ({ seasons }: { seasons: Seasons }) => {
    const { teams } = useTeamBuilderContext();
    const currentSeason = seasons.find((season) => season.is_current === true);

    const today = new Date().toLocaleDateString('en-GB');
    const defaultSubmissionData = {
        name: today,
        seasonId: currentSeason?.id ?? null,
        // teams: teams,
    };

    const [submissionData, setSubmissionData] = useState(defaultSubmissionData);

    const handleSeasonSelect = (seasonId: number) => {
        setSubmissionData((prev) => ({ ...prev, seasonId: seasonId }));
    };

    const { post, processing, setData, errors } = useForm();

    const handleTournamentSubmission = () => {
        setData(() => ({
            season_id: submissionData.seasonId,
            name: submissionData.name,
            teams: teams.map((team) => ({
                name: team.name,
                players: team.players.map((player) => player.id),
            })),
        }));

        post('/tournaments', {
            preserveScroll: true,
            onSuccess: () => {
                setSubmissionData(defaultSubmissionData);
            },
            // onError: (error) => console.log(error),
        });
    };

    return (
        <div className="">
            <Head title="Dashboard" />
            <div className="mt-10 flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Create Tournament"
                    description="Follow the instructions below to create a tournament for the grand-prix"
                />

                <div className="">
                    <div className="grid max-w-lg gap-5">
                        <div className="grid gap-2">
                            <Label>Tournament Name</Label>
                            <Input
                                value={submissionData.name}
                                onChange={(e) =>
                                    setSubmissionData((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Season</Label>

                            <SeasonsSelector
                                handleSeasonChange={handleSeasonSelect}
                                seasons={seasons}
                                tournamentSelect={submissionData.seasonId}
                            />
                            <InputError message={errors.season} />
                        </div>
                    </div>
                    <div className="mt-10 grid size-full gap-2">
                        <Label>Teams</Label>
                        <InputError message={errors.teams} />
                        <TeamContainer errors={errors} />
                    </div>

                    <div className="mt-10 text-right">
                        <Button
                            onClick={() => handleTournamentSubmission()}
                            disabled={processing}
                        >
                            {processing ? <Loader2Icon /> : 'Start Tournament'}
                        </Button>
                    </div>
                </div>

                {/*
                
                Create a form
                - name (could be made from the date?)
                - Season seletor. (default to current season)
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
};

export default function CreateTournamentPage({
    activePlayers,
    seasons,
}: {
    activePlayers: Players;
    seasons: Seasons;
}) {
    return (
        <TeamBuilderProvider activePlayers={activePlayers}>
            <CreateTournamentForm seasons={seasons} />
        </TeamBuilderProvider>
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
