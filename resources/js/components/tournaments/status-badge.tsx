import { cn } from '@/lib/utils';
import type { TournamentStatus } from '@/types';
import { Badge } from '../ui/badge';

export default function StatusBadge({ status }: { status: TournamentStatus }) {
    return (
        <Badge variant={'secondary'} className={BadgeClassName[status]}>
            {status !== 'not-started' && (
                <div
                    className={cn(
                        ` ${(status === 'completed' && 'bg-green-700') || (status === 'in-progress' && 'animate-pulse bg-blue-700')} size-2 rounded-full`,
                    )}
                />
            )}
            {StatusText[status]}
        </Badge>
    );
}

const StatusText: Record<TournamentStatus, string> = {
    'in-progress': 'In Progress',
    'not-started': 'Not Started',
    completed: 'Completed',
};

const BadgeClassName: Record<TournamentStatus, string> = {
    'in-progress':
        'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    'not-started': '',
    completed:
        'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
};
