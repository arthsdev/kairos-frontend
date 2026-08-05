import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { PlanBadge } from '../../features/plans/components/PlanBadge'

export interface SidebarItem {
    label: string
    path: string
    icon?: ReactNode
    disabled?: boolean
}

interface SidebarProps {
    items: SidebarItem[]
    title?: string
    footerContent?: ReactNode
    isOpen: boolean
    onClose: () => void
}

export function Sidebar({ items, title = 'Kairos', footerContent, isOpen, onClose }: SidebarProps) {
    const location = useLocation()
    const { userName, role, logout } = useAuth()

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed md:sticky top-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen shrink-0 transition-transform duration-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0`}
            >
                {/* Top Section */}
                <div>
                    <div className="h-16 px-6 flex items-center justify-between">
                        <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
                        <div className="flex items-center gap-2">
                            {role === 'ADMIN' && (
                                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    Admin
                                </span>
                            )}
                            {/* Close button, mobile only */}
                            <button
                                type="button"
                                onClick={onClose}
                                className="md:hidden text-slate-400 hover:text-white"
                                aria-label="Close menu"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    <nav className="p-4 pt-2 space-y-1">
                        {items.map((item) => {
                            const isActive = location.pathname === item.path

                            if (item.disabled) {
                                return (
                                    <div
                                        key={item.path}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 cursor-not-allowed select-none"
                                    >
                                        {item.icon && <span className="text-slate-600">{item.icon}</span>}
                                        <span>{item.label}</span>
                                        <span className="ml-auto text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-500">
                                            Soon
                                        </span>
                                    </div>
                                )
                            }

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={onClose}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                                        }`}
                                >
                                    {item.icon && <span>{item.icon}</span>}
                                    <span>{item.label}</span>
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-900/50 space-y-4">
                    {footerContent && <div>{footerContent}</div>}

                    <div>
                        <div className="mb-3 px-2">
                            <div className="flex items-center justify-between gap-2 mb-1">
                                <p className="text-xs text-slate-500">Logged in as</p>
                                {role !== 'ADMIN' && <PlanBadge />}
                            </div>
                            <p className="text-sm font-medium text-slate-200 truncate">{userName ?? 'User'}</p>
                        </div>
                        <button
                            type="button"
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-rose-500/10 rounded-lg border border-slate-700 hover:border-rose-500/20 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}