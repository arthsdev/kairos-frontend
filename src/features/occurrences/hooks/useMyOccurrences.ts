import { useQuery } from '@tanstack/react-query'
import { occurrencesApi } from '../api/occurrencesApi'
import { useAuth } from '../../auth/hooks/useAuth'
import type { Occurrence } from '../types'

export function useMyOccurrences() {
    const { userId } = useAuth()

    const { data: occurrences = [], isPending, isError, error } = useQuery<Occurrence[]>({
        queryKey: ['occurrences', 'me', userId],
        queryFn: () => occurrencesApi.getMyOccurrences(),
        enabled: !!userId,
    })

    return { occurrences, isPending, isError, error }
}