import { useState } from 'react'
import { LayoutList, Map as MapIcon } from 'lucide-react'

import { OccurrenceMap, type OccurrenceMapFilters } from '../features/occurrences/components/OccurrenceMap'
import type { OccurrenceCategory, SeverityLevel, OccurrenceStatus } from '../features/occurrences/types'

type ViewMode = 'list' | 'map'

export function OccurrencesPage() {
    const [viewMode, setViewMode] = useState<ViewMode>('map')

    // Single source of truth for filters - pass directly into OccurrenceMap
    const [filters, setFilters] = useState<OccurrenceMapFilters>({
        category: '',
        severity: '',
        status: '',
    })

    const handleSelectOccurrence = (id: string) => {
        // Conecte aqui a função real de seleção/abertura de detalhe que a sua lista já utiliza
        console.log('Occurrence selected:', id)
    }

    return (
        <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full h-[calc(100vh-5rem)]">
            {/* Header & View Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Occurrences
                    </h1>
                    <p className="text-sm text-slate-400">
                        Monitor and manage reported incidents across the region.
                    </p>
                </div>

                {/* View Mode Toggle Controls */}
                <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl self-start sm:self-auto">
                    <button
                        type="button"
                        onClick={() => setViewMode('list')}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${viewMode === 'list'
                                ? 'bg-slate-800 text-white shadow-sm'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        <LayoutList className="w-4 h-4" />
                        List
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode('map')}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${viewMode === 'map'
                                ? 'bg-slate-800 text-white shadow-sm'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        <MapIcon className="w-4 h-4" />
                        Map
                    </button>
                </div>
            </div>

            {/* Shared Filter Controls */}
            <div className="flex flex-wrap items-center gap-3 bg-slate-900/60 border border-slate-800/80 p-3 rounded-xl">
                <select
                    value={filters.category}
                    onChange={(e) =>
                        setFilters((prev) => ({
                            ...prev,
                            category: e.target.value as OccurrenceCategory | '',
                        }))
                    }
                    className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-slate-500"
                >
                    <option value="">All Categories</option>
                    <option value="FLOOD">Flood</option>
                    <option value="LANDSLIDE">Landslide</option>
                    <option value="SEWAGE">Sewage</option>
                    <option value="ILLEGAL_DUMPING">Illegal Dumping</option>
                    <option value="MUDDY_WATER">Muddy Water</option>
                    <option value="WILDFIRE">Wildfire</option>
                </select>

                <select
                    value={filters.severity}
                    onChange={(e) =>
                        setFilters((prev) => ({
                            ...prev,
                            severity: e.target.value as SeverityLevel | '',
                        }))
                    }
                    className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-slate-500"
                >
                    <option value="">All Severities</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                </select>

                <select
                    value={filters.status}
                    onChange={(e) =>
                        setFilters((prev) => ({
                            ...prev,
                            status: e.target.value as OccurrenceStatus | '',
                        }))
                    }
                    className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-slate-500"
                >
                    <option value="">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="VERIFIED">Verified</option>
                    <option value="RESOLVED">Resolved</option>
                </select>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 w-full min-h-0">
                {viewMode === 'map' ? (
                    <OccurrenceMap
                        filters={filters}
                        onSelectOccurrence={handleSelectOccurrence}
                    />
                ) : (
                    /* Cole aqui a renderização original do seu container de Lista / Tabela */
                    <div>{/* Conteúdo original da Lista */}</div>
                )}
            </div>
        </div>
    )
}