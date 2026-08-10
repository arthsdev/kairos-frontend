import { Thermometer, Droplets, Wind, Loader2 } from 'lucide-react'
import { getRiskLevelColor } from '../utils/riskLevelStyle'
import type { MonitoredCityWithClimate } from '../types'

interface MonitoredCityCardProps {
    city: MonitoredCityWithClimate
}

export function MonitoredCityCard({ city }: MonitoredCityCardProps) {
    return (
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="font-semibold text-white text-lg">{city.name}</h2>
                    <p className="text-sm text-slate-400">
                        {city.state ? `${city.state}, ` : ''}{city.country}
                    </p>
                </div>
                <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${city.active ? 'bg-emerald-500' : 'bg-slate-600'}`}
                    title={city.active ? 'Active' : 'Inactive'}
                />
            </div>

            <div className="text-xs text-slate-500 font-mono">
                {city.latitude.toFixed(4)}°, {city.longitude.toFixed(4)}°
            </div>

            <div className="pt-3 border-t border-slate-800/80">
                {city.climate ? (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-white">
                                <Thermometer className="w-4 h-4 text-slate-400" />
                                <span className="text-xl font-bold">
                                    {city.climate.temperature.toFixed(1)}°C
                                </span>
                            </div>
                            <span
                                className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-white"
                                style={{ backgroundColor: getRiskLevelColor(city.climate.riskLevel) }}
                            >
                                {city.climate.riskLevel}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                                <Droplets className="w-3.5 h-3.5" />
                                {city.climate.rainVolume.toFixed(1)}mm
                            </span>
                            <span className="flex items-center gap-1">
                                <Wind className="w-3.5 h-3.5" />
                                {city.climate.windSpeed.toFixed(0)}km/h
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Collecting climate data...</span>
                    </div>
                )}
            </div>
        </div>
    )
}