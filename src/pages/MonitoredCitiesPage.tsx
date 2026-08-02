import { useState } from 'react'
import { useMonitoredCities } from '../features/cities/hooks/useMonitoredCities'
import { AddCityModal } from '../features/cities/components/AddCityModal'

export function MonitoredCitiesPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const { cities, isPending, isError, error } = useMonitoredCities()

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            {/* Cabeçalho */}
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

            {/* Loading State */}
            {isPending && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-32 rounded-xl bg-slate-900 border border-slate-800 animate-pulse p-4 space-y-3"
                        >
                            <div className="h-5 bg-slate-800 rounded w-1/2"></div>
                            <div className="h-4 bg-slate-800 rounded w-1/3"></div>
                        </div>
                    ))}
                </div>
            )}

            {/* Estado de Erro */}
            {isError && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                    Failed to load monitored cities. {error?.message || 'Please try again later.'}
                </div>
            )}

            {/* Lista Vazia */}
            {!isPending && !isError && cities.length === 0 && (
                <div className="text-center py-16 px-4 border border-dashed border-slate-800 rounded-2xl bg-slate-900/50 space-y-3">
                    <p className="text-slate-400 text-base">No monitored cities yet.</p>
                    <p className="text-slate-500 text-sm">
                        Click the button above to search and track your first city.
                    </p>
                </div>
            )}

            {/* Grid de Cidades */}
            {!isPending && !isError && cities.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cities.map((city) => (
                        <div
                            key={city.id}
                            className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="font-semibold text-white text-lg">{city.name}</h2>
                                    <p className="text-sm text-slate-400">
                                        {city.state ? `${city.state}, ` : ''}{city.country}
                                    </p>
                                </div>
                                <span
                                    className={`inline-block w-2.5 h-2.5 rounded-full ${city.active ? 'bg-emerald-500' : 'bg-slate-600'
                                        }`}
                                    title={city.active ? 'Active' : 'Inactive'}
                                />
                            </div>

                            <div className="text-xs text-slate-500 font-mono">
                                {city.latitude.toFixed(4)}°, {city.longitude.toFixed(4)}°
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de Adição */}
            <AddCityModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    )
}