import type { Player } from '@/types';

export default function SinglePlayerPage({ player }: { player: Player }) {
    return (
        <div className="">
            <div className="">Single Player Page - {player.name}</div>
        </div>
    );
}
