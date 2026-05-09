// client/src/pages/careers/CareersSignupPage.tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import Logo from '@/components/layout/Logo'

export default function CareersSignupPage() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', location: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { role: 'candidate', full_name: form.fullName } },
      })
      if (signUpError) throw signUpError
      if (!data.user) throw new Error('Signup failed — please try again')

      // Create candidate profile row
      const { error: profileError } = await supabase.from('candidates').insert({
        user_id: data.user.id,
        full_name: form.fullName,
        email: form.email,
        phone: form.phone || null,
        location: form.location || null,
      })
      if (profileError) throw profileError

      navigate('/careers/profile')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const field = (label: string, key: string, type = 'text', placeholder = '', required = true) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
        {label}{!required && <span className="text-gray-400 font-normal ml-1">(optional)</span>}
      </label>
      <input type={type} required={required} value={(form as Record<string, string>)[key]}
        onChange={set(key)} placeholder={placeholder}
        className="w-full px-3.5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-navy-950 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-navy-500/30 focus:border-navy-500 transition" />
    </div>
  )

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-navy-950 px-6 pt-[100px] pb-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo className="text-navy-900 dark:text-white" />
          </div>
          <h1 className="text-xl font-bold text-navy-900 dark:text-white">Create Your Profile</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Join JTLD's talent network and upload your resume</p>
        </div>

        <form onSubmit={handleSubmit}
          className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-md">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">{error}</div>
          )}

          {field('Full Name', 'fullName', 'text', 'Jane Smith')}
          {field('Email Address', 'email', 'email', 'jane@example.com')}
          {field('Phone', 'phone', 'tel', '+1 (555) 000-0000', false)}
          {field('Location', 'location', 'text', 'Calgary, AB', false)}

          <div className="border-t border-gray-100 dark:border-navy-700 my-5" />

          {field('Password', 'password', 'password', 'Min. 8 characters')}
          {field('Confirm Password', 'confirm', 'password', 'Re-enter password')}

          <button type="submit" disabled={loading}
            className="w-full mt-2 py-3.5 rounded-lg font-semibold text-sm bg-navy-800 text-white hover:bg-navy-700 dark:bg-gold-400 dark:text-navy-950 dark:hover:bg-gold-300 disabled:opacity-60 disabled:cursor-not-allowed transition-all">
            {loading ? 'Creating profile...' : 'Create Profile'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
          Already have an account?{' '}
          <Link to="/careers/login" className="font-semibold text-navy-800 dark:text-gold-400 hover:underline">Sign in</Link>
        </p>
        <p className="text-center text-xs text-gray-400 mt-3">
          <Link to="/careers" className="hover:text-gray-600 dark:hover:text-gray-300 transition">&larr; Back to Careers</Link>
        </p>
      </div>
    </main>
  )
}
