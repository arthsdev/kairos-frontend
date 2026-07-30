// app/ProtectedRoute.tsx
import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useAuth } from '../features/auth/hooks/useAuth'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: 'ADMIN' | 'USER'
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, role } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-slate-100">
        <span className="text-sm font-medium">Carregando sessão...</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}