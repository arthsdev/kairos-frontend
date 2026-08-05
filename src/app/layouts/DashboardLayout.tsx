import { useState } from 'react'
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-100">
            <Sidebar
                items={userMenuItems}
                title="Kairos"
                footerContent={<UpgradeCard />}
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header / Topbar (hidden on desktop) */}
                <header className="h-16 border-b border-slate-800 bg-slate-900/50 px-4 flex items-center justify-between sticky top-0 backdrop-blur-md z-10 md:hidden">
                    <span className="text-lg font-bold text-white tracking-tight">Kairos</span>

                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
                        aria-label="Open navigation menu"
                    >
                        <span className="text-base leading-none">☰</span>
                        <span>Menu</span>
                    </button>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}