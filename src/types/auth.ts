export type UserRole = 'ADMIN' | 'USER'

export interface DecodedToken {
    sub?: string
    realm_access?: {
        roles?: string[]
    }
    given_name?: string
}

export interface AuthContextType {
    isAuthenticated: boolean
    isLoading: boolean
    role: UserRole | string | null
    userName: string | null
    userId: string | null
    login: (username: string, password: string) => Promise<string>
    logout: () => void
}

export interface RegisterRequest {
    username: string
    email: string
    password: string
    firstName: string
    lastName: string
}

export interface RegisterResponse {
    userId: string
    username: string
    email: string
}