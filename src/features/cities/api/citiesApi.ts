import { api } from '../../../shared/lib/axios'
import type {
    CitySearchResult,
    AddCityPayload,
    GeocodingResponse,
    MonitoredCity,
} from '../types'

export const citiesApi = {
    getMonitoredCities: async (): Promise<MonitoredCity[]> => {
        const response = await api.get<MonitoredCity[]>('/monitored-cities')
        return response.data
    },

    searchCities: async (name: string): Promise<CitySearchResult[]> => {
        const response = await api.get<GeocodingResponse>('/monitored-cities/search', {
            params: { name },
        })
        return response.data.results ?? []
    },

    addCity: async (payload: AddCityPayload): Promise<void> => {
        await api.post('/monitored-cities', payload)
    },
}