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
import { Head, router } from '@inertiajs/react';
import { Loader2Icon, PlusIcon } from 'lucide-react';
import { useState } from 'react';

const CreateTournamentForm = ({ seasons }: { seasons: Seasons }) => {
    const { teams, addTeam } = useTeamBuilderContext();
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
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const handleTournamentSubmission = () => {
        setProcessing(true);
        router.post(
            '/tournaments',
            {
                name: submissionData.name,
                season_id: submissionData.seasonId,
                teams: teams.map((team) => ({
                    name: team.name,
                    players: team.players.map((player) => player.id),
                })),
            },
            {
                onError: (errors) => setErrors(errors),
                onFinish: () => setProcessing(false),
            },
        );
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
                    <div className="grid w-full grid-cols-1 items-start gap-5 md:grid-cols-2">
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
                        <div className="flex items-center justify-between">
                            <Label>Teams</Label>
                            <Button variant={'ghost'} onClick={() => addTeam()}>
                                <PlusIcon /> Add Another Team
                            </Button>
                        </div>
                        <InputError message={errors.teams} />
                        <TeamContainer errors={errors} />
                    </div>

                    <div className="mt-10 border-t pt-10 text-right">
                        <Button
                            onClick={() => handleTournamentSubmission()}
                            disabled={processing}
                        >
                            {processing ? <Loader2Icon /> : 'Start Tournament'}
                        </Button>
                    </div>
                </div>
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
