export type OccurrenceStatus = 'PENDING' | 'VERIFIED' | 'RESOLVED'
export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface OccurrenceActions {
    canEdit: boolean
    canDelete: boolean
    canVerify: boolean
    canResolve: boolean
}

export interface Occurrence {
    id: string
    title: string
    description: string
    category: string
    severity: SeverityLevel
    status: OccurrenceStatus
    latitude: number
    longitude: number
    address?: string
    userId: string
    userName?: string
    createdAt: string
    updatedAt: string
    actions?: OccurrenceActions
}

export interface PaginatedResponse<T> {
    data: T[]
    currentPage: number
    totalPages: number
    totalItems: number
    pageSize: number
    hasNext: boolean
    hasPrevious: boolean
}