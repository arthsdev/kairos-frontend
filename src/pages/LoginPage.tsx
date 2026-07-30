import { useState, type SubmitEventHandler } from 'react'
import { useNavigate, useLocation, Link } from 'react-router'
import { isAxiosError } from 'axios'
import { useAuth } from '../features/auth/hooks/useAuth'
import { FormField } from '../shared/components/FormField'
import { parseBackendValidationError } from '../shared/lib/parseBackendError'

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const successMessage = location.state?.message as string | undefined

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      const userRole = await login(username, password)

      if (userRole === 'ADMIN') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          setErrorMessage('Invalid username or password.')
        } else if (error.response?.status === 400) {
          const validationError = parseBackendValidationError(error.response?.data)
          setErrorMessage(validationError || 'Invalid credentials or request data.')
        } else {
          setErrorMessage('Failed to connect to the service. Please try again later.')
        }
      } else {
        setErrorMessage('An unexpected error occurred.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        
        {/* Header */}
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-3 rounded-full bg-sky-500/10 p-3 text-sky-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 00-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Kairos Weather</h1>
          <p className="text-sm text-slate-400">Sign in to access the monitoring system</p>
        </div>

        {/* Banners */}
        {successMessage && (
          <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-sm text-emerald-400">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-400">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            id="username"
            label="Username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />

          <FormField
            id="password"
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-sky-600 py-2.5 font-medium text-white shadow-md transition-all hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:bg-sky-800/50"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-sky-400 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}