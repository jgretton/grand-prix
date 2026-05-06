import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import PlayersDropdownMenu from './players-dropdown-menu';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type PlayerHeadings = {
    id: number;
    name: string;
    is_active: boolean;
};

export const columns: ColumnDef<PlayerHeadings>[] = [
    {
        accessorKey: 'name',
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
    },
    {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) => {
            return (
                <Badge
                    variant={
                        row.original.is_active === true
                            ? 'secondary'
                            : 'default'
                    }
                >
                    {row.original.is_active === true ? 'Inactive' : 'Active'}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'actions',
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
