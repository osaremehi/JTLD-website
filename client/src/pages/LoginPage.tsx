// client/src/pages/LoginPage.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Logo from '@/components/layout/Logo'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
      navigate('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-navy-950 px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo className="text-navy-900 dark:text-white" />
          </div>
          <h1 className="text-xl font-bold text-navy-900 dark:text-white">Admin Login</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to manage your site</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700
                     rounded-xl p-8 shadow-md"
        >
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Email
            </label>
            <input
              type="email" id="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-3.5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm
                         bg-white dark:bg-navy-950 text-gray-800 dark:text-gray-200
                         focus:outline-none focus:ring-2 focus:ring-navy-500/30 focus:border-navy-500 transition"
              placeholder="admin@jtldconsulting.com"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Password
            </label>
            <input
              type="password" id="password" required
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-3.5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm
                         bg-white dark:bg-navy-950 text-gray-800 dark:text-gray-200
                         focus:outline-none focus:ring-2 focus:ring-navy-500/30 focus:border-navy-500 transition"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-lg font-semibold text-sm bg-navy-800 text-white
                       hover:bg-navy-700 dark:bg-gold-400 dark:text-navy-950 dark:hover:bg-gold-300
                       disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          <a href="/" className="hover:text-gray-600 dark:hover:text-gray-300 transition">&larr; Back to website</a>
        </p>
      </div>
    </main>
  )
}
