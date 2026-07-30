import { RouterProvider } from 'react-router'
import { router } from './routes'
import { AuthProvider } from '../features/auth/context/AuthContext'

function Providers() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default Providers