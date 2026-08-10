import { useQuery } from '@tanstack/react-query'
import { citiesApi } from '../api/citiesApi'

export function useMonitoredCitiesWithClimate() {
    const {
        data: cities = [],
        isPending,
        isError,
        error,
    } = useQuery({
        queryKey: ['monitored-cities', 'climate'],
        queryFn: citiesApi.getMonitoredCitiesWithClimate,
    })

    return {
        cities,
        isPending,
        isError,
        error,
    }
}