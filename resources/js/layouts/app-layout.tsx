// import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';
import AppHeaderLayout from './app/app-header-layout';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs}>{children}</AppHeaderLayout>
    );
}
