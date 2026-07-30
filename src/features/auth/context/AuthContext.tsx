import { createContext, useState, useEffect, type ReactNode } from 'react'
import { jwtDecode } from 'jwt-decode'
import { api } from '../../../shared/lib/axios'
import { getAccessToken, setTokens, clearTokens } from '../lib/tokenStorage'
import { isTokenExpired } from '../lib/tokenUtils'

interface DecodedToken {
  realm_access?: {
    roles?: string[]
  }
  given_name?: string
}

export interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  role: string | null
  userName: string | null
  login: (username: string, password: string) => Promise<string>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [role, setRole] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)

  function applySession(token: string): string {
    const decoded = jwtDecode<DecodedToken>(token)
    const roles = decoded.realm_access?.roles || []
    const userRole = roles.includes('ROLE_ADMIN') ? 'ADMIN' : 'USER'

    setIsAuthenticated(true)
    setRole(userRole)
    setUserName(decoded.given_name ?? null)

    return userRole
  }

  useEffect(() => {
    const token = getAccessToken()
    if (token && !isTokenExpired(token)) {
      applySession(token)
    }
    setIsLoading(false)
  }, [])

  async function login(username: string, password: string): Promise<string> {
    const response = await api.post('/auth/login', { username, password })

    const { accessToken, refreshToken } = response.data

    setTokens(accessToken, refreshToken)
    const userRole = applySession(accessToken)
    return userRole
  }

  function logout() {
    clearTokens()
    setIsAuthenticated(false)
    setRole(null)
    setUserName(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, role, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}