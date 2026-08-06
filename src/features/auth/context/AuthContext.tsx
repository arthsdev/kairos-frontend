import { createContext, useState, useEffect, type ReactNode } from 'react'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { api } from '../../../shared/lib/axios'
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../lib/tokenStorage'
import { isTokenExpired } from '../lib/tokenUtils'
import type { DecodedToken, AuthContextType, UserRole } from '../../../types/auth'

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [role, setRole] = useState<UserRole | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  function applySession(token: string): UserRole {
    const decoded = jwtDecode<DecodedToken>(token)
    const roles = decoded.realm_access?.roles || []
    const userRole: UserRole = roles.includes('ROLE_ADMIN') ? 'ADMIN' : 'USER'

    setIsAuthenticated(true)
    setRole(userRole)
    setUserName(decoded.given_name ?? null)
    setUserId(decoded.sub ?? null)

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
    queryClient.clear()

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
    setUserId(null)

    queryClient.clear()
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, role, userName, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}