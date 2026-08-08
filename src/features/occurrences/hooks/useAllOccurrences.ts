import { useQuery } from '@tanstack/react-query'
import { occurrencesApi } from '../api/occurrencesApi'

export function useAllOccurrences() {
    const { data: occurrences, isPending, isError, error } = useQuery({
        queryKey: ['occurrences', 'all'],
        queryFn: () => occurrencesApi.getAllOccurrences(),
        refetchInterval: 30000, // 30s
    })
    return { occurrences, isPending, isError, error }
}