import { useMutation, useQueryClient } from '@tanstack/react-query'
import { occurrencesApi } from '../api/occurrencesApi'
import type { CreateOccurrenceRequest, Occurrence } from '../types'

export function useCreateOccurrenceMutation() {
    const queryClient = useQueryClient()

    return useMutation<Occurrence, unknown, CreateOccurrenceRequest>({
        mutationFn: (payload: CreateOccurrenceRequest) => occurrencesApi.createOccurrence(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['occurrences'] })
        },
    })
}