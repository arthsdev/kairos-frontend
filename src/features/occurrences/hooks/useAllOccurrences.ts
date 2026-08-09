import { useQuery } from '@tanstack/react-query'
import { occurrencesApi } from '../api/occurrencesApi'
import type { OccurrenceStatus } from '../types'

export function useAllOccurrences(status?: OccurrenceStatus | '') {
    const { data: occurrences, isPending, isError, error } = useQuery({
        queryKey: ['occurrences', 'all', { status: status || undefined }],
        queryFn: () => occurrencesApi.getAllOccurrences(status || undefined),
        refetchInterval: 30000, // 30s
    })

    return { occurrences, isPending, isError, error }
}