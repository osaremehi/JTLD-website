import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ChevronLeft, Send, AlertCircle, CheckCircle } from 'lucide-react'
import { getJob, applyToJob } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import type { Job } from '@/types'

export default function ApplyPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [job, setJob] = useState<Job | null>(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/careers/login', { state: { redirect: `/jobs/${slug}/apply` } })
    }
  }, [user, authLoading, slug, navigate])

  useEffect(() => {
    if (!slug) return
    getJob(slug).then(res => {
      if (res.data) setJob(res.data)
      else navigate('/jobs')
    })
  }, [slug, navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!job) return
    setSubmitting(true)
    setError(null)

    const res = await applyToJob(job.id, { cover_letter: coverLetter || undefined })

    if (res.error) {
      setError(
        res.error.code === 'ALREADY_APPLIED'
          ? 'You have already applied to this position.'
          : res.error.message || 'Failed to submit application. Please try again.'
      )
      setSubmitting(false)
      return
    }

    setSuccess(true)
    setSubmitting(false)
  }

  if (authLoading || !job) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-navy-950 pt-[100px] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-navy-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-navy-950 pt-[100px] flex items-center justify-center px-4">
        <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 max-w-md w-full text-center">
          <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Application Submitted!</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Your application for <strong>{job.title}</strong> has been sent. We'll be in touch soon.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 mt-6">
            <Link
              to="/careers/dashboard"
              className="flex-1 px-4 py-2.5 bg-navy-800 dark:bg-gold-400 text-white dark:text-navy-900 rounded-lg text-sm font-semibold text-center hover:bg-navy-900 dark:hover:bg-gold-300 transition-colors"
            >
              View My Applications
            </Link>
            <Link
              to="/jobs"
              className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold text-center hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors"
            >
              Browse More Jobs
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 pt-[100px]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to={`/jobs/${slug}`} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-navy-600 dark:hover:text-gold-400 mb-6 transition-colors">
          <ChevronLeft size={16} /> Back to job
        </Link>

        <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">{job.title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{job.employers?.company_name} · {job.location}</p>
        </div>

        <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Submit Your Application</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Your profile information will be shared with the employer. A cover letter is optional but recommended.
          </p>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-5">
              <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Cover Letter <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
                rows={8}
                maxLength={5000}
                placeholder="Tell the employer why you're a great fit for this role…"
                className="w-full px-3.5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-500/30 resize-y"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{coverLetter.length}/5000</p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-navy-800 dark:bg-gold-400 text-white dark:text-navy-900 rounded-lg text-sm font-semibold hover:bg-navy-900 dark:hover:bg-gold-300 disabled:opacity-60 transition-colors"
            >
              {submitting ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting…</>
              ) : (
                <><Send size={15} /> Submit Application</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
