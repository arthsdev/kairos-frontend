import { Outlet } from 'react-router'
import { Sidebar, type SidebarItem } from '../../shared/components/Sidebar'

const userMenuItems: SidebarItem[] = [
    {
        label: 'My Occurrences',
        path: '/dashboard',
    },
    {
        label: 'Map View',
        path: '/dashboard/map',
        disabled: true,
    },
    {
        label: 'Profile Settings',
        path: '/dashboard/profile',
        disabled: true,
    },
]

export function DashboardLayout() {
    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-100">
            <Sidebar items={userMenuItems} title="Kairos" />
            <div className="flex-1 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    )
}