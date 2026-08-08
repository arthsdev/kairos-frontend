import { useMemo } from 'react'
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

import type { MapOccurrenceDTO } from '../types'
import { createCustomMarkerHtml } from '../utils/occurrenceMarkerStyle'

interface OccurrenceMapMarkerProps {
    occurrence: MapOccurrenceDTO
    onSelect?: (id: string) => void
}

export function OccurrenceMapMarker({ occurrence, onSelect }: OccurrenceMapMarkerProps) {
    const customIcon = useMemo(() => {
        return L.divIcon({
            html: createCustomMarkerHtml(
                occurrence.category,
                occurrence.severity,
                occurrence.status
            ),
            className: '',
            iconSize: [36, 36],
            iconAnchor: [18, 18],
            popupAnchor: [0, -20],
        })
    }, [occurrence.category, occurrence.severity, occurrence.status])

    return (
        <Marker position={[occurrence.latitude, occurrence.longitude]} icon={customIcon}>
            <Popup className="occurrence-map-popup">
                <div className="p-1 space-y-2 text-slate-900 max-w-xs">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                            {occurrence.category}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500">
                            {occurrence.status}
                        </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-700">
                        Gravidade: <span className="font-bold">{occurrence.severity}</span>
                    </p>

                    {onSelect && (
                        <div className="pt-1 border-t border-slate-100 flex justify-end">
                            <button
                                type="button"
                                onClick={() => onSelect(occurrence.id)}
                                className="text-xs font-medium text-blue-600 hover:text-blue-700 underline underline-offset-2 transition-colors focus:outline-none"
                            >
                                Ver detalhes &rarr;
                            </button>
                        </div>
                    )}
                </div>
            </Popup>
        </Marker>
    )
}