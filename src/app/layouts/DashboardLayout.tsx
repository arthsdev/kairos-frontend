import { Outlet } from 'react-router'
import { Sidebar, type SidebarItem } from '../../shared/components/Sidebar'
import { UpgradeCard } from '../../features/plans/components/UpgradeCard'

const userMenuItems: SidebarItem[] = [
    { label: 'My Occurrences', path: '/dashboard' },
    { label: 'Monitored Cities', path: '/dashboard/cities' },
    { label: 'Map View', path: '/map', disabled: true },
    { label: 'Profile Settings', path: '/profile', disabled: true },
]

export function DashboardLayout() {
    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-100">
            <Sidebar items={userMenuItems} title="Kairos" footerContent={<UpgradeCard />} />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar / Header */}
                <header className="h-16 border-b border-slate-800 bg-slate-900/50 px-6 flex items-center justify-end gap-4 sticky top-0 backdrop-blur-md z-10" />

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}