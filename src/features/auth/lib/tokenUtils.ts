import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  exp: number
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<DecodedToken>(token)
    const nowInSeconds = Date.now() / 1000
    return decoded.exp < nowInSeconds
  } catch {
    return true
  }
}