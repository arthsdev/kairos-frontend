export type OccurrenceStatus = 'PENDING' | 'VERIFIED' | 'RESOLVED'
export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type OccurrenceCategory =
    | 'FLOOD'
    | 'LANDSLIDE'
    | 'SEWAGE'
    | 'ILLEGAL_DUMPING'
    | 'MUDDY_WATER'
    | 'WILDFIRE'

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
    category: OccurrenceCategory
    severity: SeverityLevel
    status: OccurrenceStatus
    latitude: number
    longitude: number
    address?: string
    userId: string
    reporterDisplayId?: string
    createdAt: string
    updatedAt: string
    actions?: OccurrenceActions
}

export interface CreateOccurrenceRequest {
    title: string
    description: string
    category: OccurrenceCategory
    severity: SeverityLevel
    cityId: string
    latitude: number
    longitude: number
    imageUrl?: string
}

export interface CreateOccurrenceForm {
    title: string
    description: string
    category: OccurrenceCategory | ''
    severity: SeverityLevel | ''
    cityId: string
    latitude: number | ''
    longitude: number | ''
    imageUrl: string
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

export interface UpdateOccurrenceInput {
    title?: string
    description?: string
    latitude?: number
    longitude?: number
}

export interface MapOccurrenceDTO {
    id: string
    latitude: number
    longitude: number
    category: OccurrenceCategory
    severity: SeverityLevel
    status: OccurrenceStatus
}