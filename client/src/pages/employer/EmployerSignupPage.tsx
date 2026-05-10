import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { createEmployerProfile } from '@/lib/api'
import Logo from '@/components/layout/Logo'

const INDUSTRIES = [
  'Technology', 'Financial Services', 'Healthcare', 'Retail', 'Manufacturing',
  'Construction', 'Education', 'Government', 'Non-profit', 'Consulting', 'Other',
]

export default function EmployerSignupPage() {
  const [step, setStep] = useState<'account' | 'company'>('account')
  const [form, setForm] = useState({
    email: '', password: '', confirm: '',
    company_name: '', industry: '', website: '', location: '', description: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleAccountStep(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
    setStep('company')
  }

  async function handleCompanyStep(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { role: 'employer', company_name: form.company_name } },
      })
      if (signUpError) throw signUpError
      if (!data.user) throw new Error('Signup failed — please try again')

      const res = await createEmployerProfile({
        company_name: form.company_name,
        industry: form.industry,
        website: form.website || undefined,
        location: form.location || undefined,
        description: form.description || undefined,
      })
      if (res.error) throw new Error(res.error.message)

      navigate('/employer/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
      setStep('account')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full px-3.5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-navy-950 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-navy-500/30 focus:border-navy-500 transition'

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-navy-950 px-6 pt-[100px] pb-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo className="text-navy-900 dark:text-white" />
          </div>
          <h1 className="text-xl font-bold text-navy-900 dark:text-white">Register Your Company</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Post jobs and find top talent</p>
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className={`w-2 h-2 rounded-full ${step === 'account' ? 'bg-navy-600 dark:bg-gold-400' : 'bg-gray-300 dark:bg-gray-600'}`} />
            <span className={`w-2 h-2 rounded-full ${step === 'company' ? 'bg-navy-600 dark:bg-gold-400' : 'bg-gray-300 dark:bg-gray-600'}`} />
          </div>
        </div>

        <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-md">
          {error && <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">{error}</div>}

          {step === 'account' && (
            <form onSubmit={handleAccountStep} className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Step 1: Account Details</h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Work Email</label>
                <input type="email" required value={form.email} onChange={set('email')} placeholder="you@company.com" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                <input type="password" required value={form.password} onChange={set('password')} placeholder="Min. 8 characters" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
                <input type="password" required value={form.confirm} onChange={set('confirm')} placeholder="Re-enter password" className={inputCls} />
              </div>
              <button type="submit"
                className="w-full mt-2 py-3.5 rounded-lg font-semibold text-sm bg-navy-800 text-white hover:bg-navy-700 dark:bg-gold-400 dark:text-navy-950 dark:hover:bg-gold-300 transition-all">
                Continue
              </button>
            </form>
          )}

          {step === 'company' && (
            <form onSubmit={handleCompanyStep} className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Step 2: Company Details</h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Company Name</label>
                <input type="text" required value={form.company_name} onChange={set('company_name')} placeholder="Acme Corp" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Industry</label>
                <select required value={form.industry} onChange={set('industry')} className={inputCls}>
                  <option value="">Select industry…</option>
                  {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Location <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="text" value={form.location} onChange={set('location')} placeholder="Toronto, ON" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Website <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="url" value={form.website} onChange={set('website')} placeholder="https://yourcompany.com" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Company Description <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea value={form.description} onChange={set('description')} rows={3} maxLength={500}
                  placeholder="Brief description of your company…"
                  className={`${inputCls} resize-none`} />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setStep('account')}
                  className="flex-1 py-3.5 rounded-lg font-semibold text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-700 transition-all">
                  Back
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 py-3.5 rounded-lg font-semibold text-sm bg-navy-800 text-white hover:bg-navy-700 dark:bg-gold-400 dark:text-navy-950 dark:hover:bg-gold-300 disabled:opacity-60 transition-all">
                  {loading ? 'Creating account…' : 'Create Account'}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
          Already registered?{' '}
          <Link to="/employer/login" className="font-semibold text-navy-800 dark:text-gold-400 hover:underline">Sign in</Link>
        </p>
      </div>
    </main>
  )
}
