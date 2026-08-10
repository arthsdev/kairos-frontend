import { useState } from 'react'
import { useMonitoredCitiesWithClimate } from '../features/cities/hooks/useMonitoredCitiesWithClimate'
import { AddCityModal } from '../features/cities/components/AddCityModal'
import { MonitoredCityCard } from '../features/cities/components/MonitoredCityCard'

export function MonitoredCitiesPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const { cities, isPending, isError, error } = useMonitoredCitiesWithClimate()

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Monitored Cities</h1>
                    <p className="text-sm text-slate-400">
                        Manage and view climate conditions for your saved locations.
                    </p>
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 self-start sm:self-auto"
                >
                    <span className="text-lg leading-none">+</span> Add City
                </button>
            </div>

            {isPending && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-40 rounded-xl bg-slate-900 border border-slate-800 animate-pulse p-4 space-y-3">
                            <div className="h-5 bg-slate-800 rounded w-1/2"></div>
                            <div className="h-4 bg-slate-800 rounded w-1/3"></div>
                        </div>
                    ))}
                </div>
            )}

            {isError && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                    Failed to load monitored cities. {error?.message || 'Please try again later.'}
                </div>
            )}

            {!isPending && !isError && cities.length === 0 && (
                <div className="text-center py-16 px-4 border border-dashed border-slate-800 rounded-2xl bg-slate-900/50 space-y-3">
                    <p className="text-slate-400 text-base">No monitored cities yet.</p>
                    <p className="text-slate-500 text-sm">
                        Click the button above to search and track your first city.
                    </p>
                </div>
            )}

            {!isPending && !isError && cities.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cities.map((city) => (
                        <MonitoredCityCard key={city.id} city={city} />
                    ))}
                </div>
            )}

            <AddCityModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    )
}