import type { ReactNode } from 'react';

export default function Heading({
    title,
    description,
    action,
    variant = 'default',
}: {
    title: string;
    description?: string;
    action?: ReactNode;
    variant?: 'default' | 'small';
}) {
    return (
        <header className={variant === 'small' ? '' : 'mb-8 space-y-0.5'}>
            <div className="flex items-center justify-between">
                <h2
                    className={
                        variant === 'small'
                            ? 'mb-0.5 text-base font-medium'
                            : 'text-xl font-semibold tracking-tight'
                    }
                >
                    {title}
                </h2>
                {action && <div className="ml-4 shrink-0">{action}</div>}
            </div>
            {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
            )}
        </header>
    );
}
