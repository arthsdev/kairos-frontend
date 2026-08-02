import { useMutation, useQueryClient } from '@tanstack/react-query'
import { citiesApi } from '../api/citiesApi'

export function useAddCityMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: citiesApi.addCity,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['monitored-cities'] })
        },
    })
}