import { createBrowserRouter, Navigate } from 'react-router'
import { LoginPage } from '../pages/LoginPage'
import  DashboardPage from '../pages/DashboardPage'
import  AdminPage  from '../pages/AdminPage'
import  RegisterPage  from '../pages/RegisterPage'
import  HomePage  from '../pages/HomePage'
import { ProtectedRoute } from './ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <AdminPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
])