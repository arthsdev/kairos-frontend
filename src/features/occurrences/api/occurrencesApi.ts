import { api } from '../../../shared/lib/axios'
import type { Occurrence, PaginatedResponse } from '../types'

export const occurrencesApi = {
    /**
     * Fetches the logged-in user's occurrences (USER) -> GET /occurrences/me
     */
    getMyOccurrences: async (): Promise<Occurrence[]> => {
        const response = await api.get<PaginatedResponse<Occurrence>>('/occurrences/me')
        return response.data.data
    },

    /**
     * Fetches all occurrences in the system (ADMIN) -> GET /occurrences
     */
    getAllOccurrences: async (): Promise<Occurrence[]> => {
        const response = await api.get<PaginatedResponse<Occurrence>>('/occurrences')
        return response.data.data
    },
}