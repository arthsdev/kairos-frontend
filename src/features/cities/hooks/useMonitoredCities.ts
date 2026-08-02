import { useQuery } from '@tanstack/react-query'
import { citiesApi } from '../api/citiesApi'

export function useMonitoredCities() {
    const {
        data: cities = [],
        isPending,
        isError,
        error,
    } = useQuery({
        queryKey: ['monitored-cities'],
        queryFn: citiesApi.getMonitoredCities,
    })

    return {
        cities,
        isPending,
        isError,
        error,
    }
}