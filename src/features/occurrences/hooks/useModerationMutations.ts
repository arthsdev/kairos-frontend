import { useMutation, useQueryClient } from '@tanstack/react-query'
import { occurrencesApi } from '../api/occurrencesApi'
import type { UpdateOccurrenceInput } from '../types'

export function useModerationMutations() {
    const queryClient = useQueryClient()

    const invalidateOccurrences = () => {
        queryClient.invalidateQueries({ queryKey: ['all-occurrences'] })
        queryClient.invalidateQueries({ queryKey: ['my-occurrences'] })
    }

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateOccurrenceInput }) =>
            occurrencesApi.updateOccurrence({ id, payload }),
        onSuccess: () => invalidateOccurrences(),
    })

    const verifyMutation = useMutation({
        mutationFn: (id: string) => occurrencesApi.verifyOccurrence(id),
        onSuccess: () => invalidateOccurrences(),
    })

    const resolveMutation = useMutation({
        mutationFn: (id: string) => occurrencesApi.resolveOccurrence(id),
        onSuccess: () => invalidateOccurrences(),
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => occurrencesApi.deleteOccurrence(id),
        onSuccess: () => invalidateOccurrences(),
    })

    return {
        updateOccAsync: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,

        verifyOcc: verifyMutation.mutate,
        isVerifying: verifyMutation.isPending,

        resolveOcc: resolveMutation.mutate,
        isResolving: resolveMutation.isPending,

        deleteOcc: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
    }
}