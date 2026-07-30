import axios from 'axios'
import { getAccessToken } from '../../features/auth/lib/tokenStorage'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()

  if (token && !config.url?.includes('/auth/login')) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})