import { useQuery } from '@tanstack/react-query'
import { occurrencesApi } from '../api/occurrencesApi'

export function useMyOccurrences() {
    const { data: occurrences, isPending, isError, error } = useQuery({
        queryKey: ['my-occurrences'],
        queryFn: () => occurrencesApi.getMyOccurrences(),
    })

    return { occurrences, isPending, isError, error }
}