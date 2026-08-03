import { createContext, useState, useEffect, type ReactNode } from 'react'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import { api } from '../../../shared/lib/axios'
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../lib/tokenStorage'
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
    async function initializeSession() {
      const token = getAccessToken()

      if (!token) {
        setIsLoading(false)
        return
      }

      if (!isTokenExpired(token)) {
        applySession(token)
        setIsLoading(false)
        return
      }

      // Token exists but is expired — try to silently refresh before giving up
      try {
        const refreshToken = getRefreshToken()
        if (!refreshToken) throw new Error('No refresh token available')

        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, {
          refreshToken,
        })

        const { accessToken, refreshToken: newRefreshToken } = response.data
        setTokens(accessToken, newRefreshToken)
        applySession(accessToken)
      } catch {
        clearTokens()
      } finally {
        setIsLoading(false)
      }
    }

    initializeSession()
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