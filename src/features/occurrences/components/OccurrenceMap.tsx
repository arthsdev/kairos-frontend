import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { useOccurrenceMapData } from '../hooks/useOccurrenceMapData'
import { OccurrenceMapMarker } from './OccurrenceMapMarker'
import type { OccurrenceCategory, SeverityLevel, OccurrenceStatus, MapOccurrenceDTO } from '../types'

export interface OccurrenceMapFilters {
    category?: OccurrenceCategory | ''
    severity?: SeverityLevel | ''
    status?: OccurrenceStatus | ''
}

interface OccurrenceMapProps {
    filters?: OccurrenceMapFilters
    onSelectOccurrence?: (id: string) => void
    canEditLookup?: (id: string) => boolean
    defaultCenter?: [number, number]
    defaultZoom?: number
}

// Auxiliary component: fits the map view to contain all visible markers,
// avoiding the "meaningless midpoint" problem of averaging coordinates
// across geographically distant occurrences.
function FitBoundsToMarkers({ occurrences }: { occurrences: MapOccurrenceDTO[] }) {
    const map = useMap()

    useEffect(() => {
        if (occurrences.length === 0) return

        if (occurrences.length === 1) {
            const [occ] = occurrences
            map.flyTo([occ.latitude, occ.longitude], 12, { duration: 0.8 })
            return
        }

        const bounds = L.latLngBounds(
            occurrences.map((occ) => [occ.latitude, occ.longitude] as [number, number])
        )

        map.flyToBounds(bounds, {
            padding: [50, 50],
            maxZoom: 14,
            duration: 0.8,
        })
    }, [occurrences, map])

    return null
}

export function OccurrenceMap({
    filters,
    onSelectOccurrence,
    defaultCenter = [-23.5505, -46.6333], // Default coordinates (São Paulo) — used only before bounds are calculated
    defaultZoom = 5,
}: OccurrenceMapProps) {
    const { mapOccurrences, isLoading, isError, refetch } = useOccurrenceMapData()

    // Client-side filtering in memory
    const filteredOccurrences = mapOccurrences.filter((item) => {
        if (filters?.category && item.category !== filters.category) return false
        if (filters?.severity && item.severity !== filters.severity) return false
        if (filters?.status && item.status !== filters.status) return false
        return true
    })

    // State 1: Loading
    if (isLoading) {
        return (
            <div className="h-full w-full min-h-[400px] bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
                <span className="animate-pulse text-sm">Loading occurrence map...</span>
            </div>
        )
    }

    // State 2: Fetch Error
    if (isError) {
        return (
            <div className="h-full w-full min-h-[400px] bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-3 p-4">
                <p className="text-sm text-red-400">Failed to load map data.</p>
                <button
                    type="button"
                    onClick={() => refetch()}
                    className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                    Try again
                </button>
            </div>
        )
    }

    return (
        <div className="relative h-full w-full min-h-[400px] rounded-2xl overflow-hidden border border-slate-800 z-0">
            {/* State 3: Empty Filter Result */}
            {filteredOccurrences.length === 0 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900/90 border border-slate-700 backdrop-blur-md px-4 py-2 rounded-xl shadow-xl text-xs text-slate-300">
                    No occurrences found matching the selected filters.
                </div>
            )}

            <MapContainer
                center={defaultCenter}
                zoom={defaultZoom}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                {/* Tile Provider - CartoDB Dark Matter / Positron recommended for production */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Fits view to contain all visible markers */}
                <FitBoundsToMarkers occurrences={filteredOccurrences} />

                {filteredOccurrences.map((occurrence) => (
                    <OccurrenceMapMarker
                        key={occurrence.id}
                        occurrence={occurrence}
                        onSelect={onSelectOccurrence}
                    />
                ))}
            </MapContainer>
        </div>
    )
}