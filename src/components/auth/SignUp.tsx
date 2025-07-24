import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Loader2 } from 'lucide-react'

export function SignUp() {
  const { signUp, loading, error } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [validationError, setValidationError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match')
      return
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters long')
      return
    }
    
    try {
      await signUp(formData.email, formData.password)
      navigate('/bmr-calculator')
    } catch (err) {
      // Error is handled by the useAuth hook
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#10151a] via-[#19391a] via-40% to-[#0c1a13] to-90% font-sans text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-[#A8FFBA]/30 p-8 md:p-14">
        <h2 className="text-center text-3xl font-bold text-white font-display tracking-tight leading-tight mb-2">Create your account</h2>
        <p className="text-center text-sm text-gray-300 mb-6">
          Or{' '}
          <Link to="/signin" className="font-medium text-[#A8FFBA] hover:text-[#51B73B]">sign in to your existing account</Link>
        </p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {(error || validationError) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error || validationError}</span>
            </div>
          )}
          <div className="rounded-xl overflow-hidden">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-white/5 placeholder-gray-400 text-gray-100 rounded-t-xl focus:outline-none focus:ring-[#A8FFBA] focus:border-[#A8FFBA] focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-white/5 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-[#A8FFBA] focus:border-[#A8FFBA] focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-white/5 placeholder-gray-400 text-gray-100 rounded-b-xl focus:outline-none focus:ring-[#A8FFBA] focus:border-[#A8FFBA] focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-[#A8FFBA] hover:bg-[#51B73B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A8FFBA] shadow-lg transition-all"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5 text-white" />
              ) : (
                'Sign up'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 