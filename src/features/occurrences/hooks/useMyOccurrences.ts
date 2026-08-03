import { useQuery } from '@tanstack/react-query'
import { occurrencesApi } from '../api/occurrencesApi'
import type { Occurrence } from '../types'

export function useMyOccurrences() {
    const { data: occurrences = [], isPending, isError, error } = useQuery<Occurrence[]>({
        queryKey: ['occurrences', 'me'],
        queryFn: () => occurrencesApi.getMyOccurrences(),
    })

    return { occurrences, isPending, isError, error }
}