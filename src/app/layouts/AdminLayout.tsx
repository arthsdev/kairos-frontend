import { Outlet } from 'react-router'
import { Sidebar, type SidebarItem } from '../../shared/components/Sidebar'

const adminMenuItems: SidebarItem[] = [
    {
        label: 'System Occurrences',
        path: '/admin',
    },
    {
        label: 'Manage Categories',
        path: '/admin/categories',
        disabled: true,
    },
    {
        label: 'System Audit',
        path: '/admin/audit',
        disabled: true,
    },
]

export function AdminLayout() {
    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-100">
            <Sidebar items={adminMenuItems} title="Kairos Admin" />
            <div className="flex-1 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    )
}