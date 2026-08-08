import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'

// Static module-level icon instance — created once on module load, avoiding re-creation or re-memoization
const pickerIcon = L.divIcon({
    className: 'custom-picker-pin',
    html: `
    <div class="relative -translate-x-1/2 -translate-y-full flex items-center justify-center">
      <div class="w-8 h-8 rounded-full bg-indigo-600 border-2 border-white shadow-xl flex items-center justify-center text-white transition-transform hover:scale-110">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
      <div class="absolute -bottom-1 w-2.5 h-2.5 bg-indigo-600 rotate-45 border-r border-b border-white"></div>
    </div>
  `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
})

export interface LocationPickerMapProps {
    latitude: number | ''
    longitude: number | ''
    onChange: (lat: number, lng: number) => void
    initialCenter?: [number, number]
    height?: string
}

// Recenter controller: invalidates container size on mount and flies to new center only on subsequent updates
function MapRecenter({ center }: { center: [number, number] }) {
    const map = useMap()
    const isFirstRender = useRef(true)

    useEffect(() => {
        map.invalidateSize()

        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }

        map.flyTo(center, map.getZoom() < 13 ? 14 : map.getZoom(), { duration: 1 })
    }, [center, map])

    return null
}

// Click listener controller to update marker on map clicks
function MapClickHandler({ onChange }: { onChange: (lat: number, lng: number) => void }) {
    useMapEvents({
        click: (e) => {
            onChange(e.latlng.lat, e.latlng.lng)
        },
    })

    return null
}

export function LocationPickerMap({
    latitude,
    longitude,
    onChange,
    initialCenter,
    height = '280px',
}: LocationPickerMapProps) {
    const hasCoords = typeof latitude === 'number' && typeof longitude === 'number'

    // Default fallback (e.g., SP center) if neither coords nor initialCenter exist
    const fallbackCenter: [number, number] = [-23.55052, -46.633309]
    const center: [number, number] = hasCoords
        ? [latitude, longitude]
        : initialCenter ?? fallbackCenter

    return (
        <div style={{ height }} className="w-full rounded-xl overflow-hidden border border-slate-800 relative z-0">
            <MapContainer
                center={center}
                zoom={hasCoords ? 14 : 12}
                scrollWheelZoom={true}
                className="w-full h-full z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {initialCenter && <MapRecenter center={initialCenter} />}
                <MapClickHandler onChange={onChange} />

                {hasCoords && (
                    <Marker
                        position={[latitude, longitude]}
                        draggable={true}
                        icon={pickerIcon}
                        eventHandlers={{
                            dragend: (e) => {
                                const marker = e.target
                                const { lat, lng } = marker.getLatLng()
                                onChange(lat, lng)
                            },
                        }}
                    />
                )}
            </MapContainer>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[400] pointer-events-none">
                <span className="bg-slate-900/90 backdrop-blur-sm border border-slate-700/80 text-slate-300 text-[11px] px-3 py-1 rounded-full shadow-lg">
                    Click the map or drag the marker to adjust location
                </span>
            </div>
        </div>
    )
}