import { api } from '../../../shared/lib/axios'
import type { CreateOccurrenceRequest, MapOccurrenceDTO, Occurrence, PaginatedResponse } from '../types'

export interface UpdateOccurrencePayload {
    title?: string
    description?: string
}

export const occurrencesApi = {
    /**
     * Creates a new occurrence -> POST /occurrences
     */
    createOccurrence: async (payload: CreateOccurrenceRequest): Promise<Occurrence> => {
        const response = await api.post<Occurrence>('/occurrences', payload)
        return response.data
    },

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

    /**
     * Updates an occurrence (USER/ADMIN) -> PATCH /occurrences/:id
     */
    updateOccurrence: async ({
        id,
        payload,
    }: {
        id: string
        payload: UpdateOccurrencePayload
    }): Promise<Occurrence> => {
        const response = await api.patch<Occurrence>(`/occurrences/${id}`, payload)
        return response.data
    },

    /**
     * Verifies an occurrence (ADMIN) -> POST /occurrences/:id/verify
     */
    verifyOccurrence: async (id: string): Promise<Occurrence> => {
        const response = await api.post<Occurrence>(`/occurrences/${id}/verify`)
        return response.data
    },

    /**
     * Resolves an occurrence (ADMIN) -> POST /occurrences/:id/resolve
     */
    resolveOccurrence: async (id: string): Promise<Occurrence> => {
        const response = await api.post<Occurrence>(`/occurrences/${id}/resolve`)
        return response.data
    },

    /**
     * Soft-deletes an occurrence -> DELETE /occurrences/:id
     */
    deleteOccurrence: async (id: string): Promise<void> => {
        await api.delete(`/occurrences/${id}`)
    },

    /**
     * Fetches lightweight occurrences for map view -> GET /occurrences/map
     */
    getMapOccurrences: async (): Promise<MapOccurrenceDTO[]> => {
        const response = await api.get<MapOccurrenceDTO[]>('/occurrences/map')
        return response.data
    },
}