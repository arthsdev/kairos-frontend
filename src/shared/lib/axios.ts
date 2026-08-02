import axios from 'axios'
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from '../../features/auth/lib/tokenStorage'

// Sanitize baseURL to prevent double slash issues (e.g. //auth/refresh)
const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string || '').replace(/\/$/, '')

export const api = axios.create({
  baseURL: BASE_URL,
})

/**
 * Request Interceptor:
 * Ensures requests targeting `/auth/` routes NEVER attach the Authorization header.
 * Prevents stale/invalid tokens in localStorage from blocking login or refresh attempts.
 */
api.interceptors.request.use((config) => {
  const isAuthEndpoint = config.url?.includes('/auth/')

  if (!isAuthEndpoint) {
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback)
}

function onRefreshed(newToken: string) {
  refreshSubscribers.forEach((callback) => callback(newToken))
  refreshSubscribers = []
}

/**
 * Catches 401 status on protected routes, queues concurrent requests,
 * and seamlessly refreshes the access token.
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    const isAuthEndpoint =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/refresh')

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            resolve(api(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = getRefreshToken()

        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        // Clean post request using bare axios instance (avoids attaching expired Authorization header)
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        })

        const { accessToken, refreshToken: newRefreshToken } = response.data

        setTokens(accessToken, newRefreshToken)
        onRefreshed(accessToken)

        // Update failed request header with new access token and retry
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        refreshSubscribers = []
        clearTokens()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)