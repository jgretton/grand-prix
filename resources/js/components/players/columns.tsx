import { Link } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, ArrowUpRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import PlayersDropdownMenu from './players-dropdown-menu';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type PlayerHeadings = {
    id: number;
    name: string;
    is_active: boolean;
    current_season_total?: number;
};

export const columns: ColumnDef<PlayerHeadings>[] = [
    {
        accessorKey: 'name',
        size: 300,
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <Link
                    href={`/players/${row.original.id}`}
                    className="group inline-flex w-full flex-1 items-center gap-1 hover:underline"
                >
                    {row.original.name}
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
            );
        },
    },
    {
        accessorKey: 'current_season_total',
        size: 200,
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                    className="w-full justify-center"
                >
                    Current Season Total
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <p className="text-center">
                    {row.original.current_season_total}
                </p>
            );
        },
    },
    {
        accessorKey: 'is_active',
        size: 120,
        filterFn: 'equals',
        header: 'Status',
        cell: ({ row }) => {
            return (
                <Badge
                    variant={
                        row.original.is_active === true
                            ? 'default'
                            : 'secondary'
                    }
                >
                    {row.original.is_active === true ? 'Active' : 'Inactive'}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'actions',
        size: 100,
        header: () => <div className="mr-5 text-right">Actions</div>,
        cell: ({ row }) => {
            return (
                <div className="mr-5 text-right">
                    <PlayersDropdownMenu player={row.original} />
                </div>
            );
        },
    },
];
