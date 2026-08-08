import { useQuery } from '@tanstack/react-query'
import { occurrencesApi } from '../api/occurrencesApi'

export function useOccurrenceMapData() {
    const query = useQuery({
        queryKey: ['occurrences', 'map'],
        queryFn: occurrencesApi.getMapOccurrences,
        staleTime: 1000 * 60 * 2,
    })

    return {
        mapOccurrences: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    }
}