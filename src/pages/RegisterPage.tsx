import { useState, type SubmitEventHandler, type ChangeEvent } from 'react'
import { useNavigate, Link } from 'react-router'
import { isAxiosError } from 'axios'
import { authApi, type RegisterRequest } from '../features/auth/api/authApi'
import { FormField } from '../shared/components/FormField'
import { parseBackendValidationError } from '../shared/lib/parseBackendError'

export function RegisterPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  })

  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await authApi.register(formData)

      navigate('/login', {
        state: { message: 'Account created successfully! Please sign in.' },
      })
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.response?.status === 409) {
          setError('Username or email already registered.')
        } else if (err.response?.status === 400) {
          const validationError = parseBackendValidationError(err.response?.data)
          setError(validationError || 'Invalid data. Please check the fields and try again.')
        } else {
          setError('An unexpected error occurred while creating the account.')
        }
      } else {
        setError('Failed to connect to the server. Please try again later.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-slate-100">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">Create Account</h1>
          <p className="text-sm text-slate-400">Enter your details to register in Kairos Weather</p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-center text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              id="firstName"
              name="firstName"
              label="First Name"
              type="text"
              required
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
            />

            <FormField
              id="lastName"
              name="lastName"
              label="Last Name"
              type="text"
              required
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
            />
          </div>

          <FormField
            id="username"
            name="username"
            label="Username"
            type="text"
            required
            value={formData.username}
            onChange={handleChange}
            placeholder="johndoe"
          />

          <FormField
            id="email"
            name="email"
            label="Email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
          />

          <FormField
            id="password"
            name="password"
            label="Password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-sky-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-sky-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}