import { Head, router } from '@inertiajs/react';
import { Loader2Icon, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import SeasonsSelector from '@/components/seasons/seasons-selector';
import { TeamContainer } from '@/components/team-builder/team-container';
import TeamList from '@/components/tournaments/team-list';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    TeamBuilderProvider,
    useTeamBuilderContext,
} from '@/context/team-builder-context';
import { dashboard } from '@/routes';
import tournaments from '@/routes/tournaments';
import type { Players, Season, Seasons, Tournament } from '@/types';

function EditTournamentForm({
    tournament,
    seasons,
}: {
    tournament: Tournament;
    seasons: Season[];
}) {
    // populate all data with curent tournament data.
    const { teams, addTeam } = useTeamBuilderContext();

    const [submissionData, setSubmissionData] = useState({
        name: tournament.name,
        seasonId: tournament.season_id,
    });
    const [errors, setErrors] = useState({});
    const handleSeasonSelect = (seasonId: number) => {
        setSubmissionData((prev) => ({ ...prev, seasonId: seasonId }));
    };
    const [processing, setProcessing] = useState(false);

    const handleTournamentSubmission = () => {
        setProcessing(true);
        router.patch(
            `/tournaments/${tournament.id}`,
            {
                name: submissionData.name,
                season_id: submissionData.seasonId,
                ...(!tournament.is_completed && {
                    teams: teams.map((team) => ({
                        name: team.name,
                        players: team.players.map((player) => player.id),
                    })),
                }),
            },
            {
                onError: (errors) => setErrors(errors),
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <div className="">
            <Head title="Edit Tournament" />
            <div className="mt-10 flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading title="Edit Tournament" />

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
                            {!tournament.is_completed && (
                                <Button
                                    variant={'ghost'}
                                    onClick={() => addTeam()}
                                >
                                    <PlusIcon /> Add Another Team
                                </Button>
                            )}
                        </div>
                        {tournament.is_completed ? (
                            <>
                                <p className="text-sm text-muted-foreground">
                                    Teams cannot be changed for a completed
                                    tournament.
                                </p>
                                <div className="flex flex-row flex-wrap gap-4">
                                    {tournament.teams?.map((team) => (
                                        <TeamList team={team} key={team.id} />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                <InputError message={errors.teams} />
                                <TeamContainer errors={errors} />
                            </>
                        )}
                    </div>

                    <div className="mt-10 border-t pt-10 text-right">
                        <Button
                            onClick={() => handleTournamentSubmission()}
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <Loader2Icon className="animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Update Tournament'
                            )}
                        </Button>
                        <InputError
                            message={errors.tournament}
                            className="mt-2"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function EditTournamentPage({
    activePlayers,
    seasons,
    tournament,
}: {
    activePlayers: Players;
    seasons: Seasons;
    tournament: Tournament;
}) {
    const initialTeams = tournament.teams?.map((team) => ({
        ...team,
        id: String(team.id),
        players:
            team.player_teams?.map((playerTeam) => playerTeam.player) ?? [],
    }));

    return (
        <TeamBuilderProvider
            activePlayers={activePlayers}
            initialTeams={initialTeams}
        >
            <EditTournamentForm tournament={tournament} seasons={seasons} />
        </TeamBuilderProvider>
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
