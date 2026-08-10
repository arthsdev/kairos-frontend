export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface CitySearchResult {
    name: string
    latitude: number
    longitude: number
    admin1?: string
    country?: string
}

export interface GeocodingResponse {
    results: CitySearchResult[]
}

export interface AddCityPayload {
    name: string
    latitude: number
    longitude: number
    admin1?: string
    country?: string
}

export interface MonitoredCity {
    id: string
    name: string
    state: string
    latitude: number
    longitude: number
    country: string
    active: boolean
}

export interface ClimateDataSummary {
    temperature: number
    humidity: number
    rainVolume: number
    windSpeed: number
    riskLevel: RiskLevel
    collectedAt: string
}

export interface MonitoredCityWithClimate extends MonitoredCity {
    climate: ClimateDataSummary | null
}