import { api } from '../../../shared/lib/axios'

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

export const authApi = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('/auth/register', data)
    return response.data
  },
}