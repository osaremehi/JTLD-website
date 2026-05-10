import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { MapPin, Briefcase, Clock, DollarSign, Globe, ChevronLeft, CheckCircle } from 'lucide-react'
import { getJob } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import type { Job } from '@/types'

function formatSalary(min: number | null, max: number | null, currency: string) {
  if (!min && !max) return null
  const fmt = (n: number) => `$${n.toLocaleString()}`
  if (min && max) return `${fmt(min)} – ${fmt(max)} ${currency}/year`
  if (min) return `From ${fmt(min)} ${currency}/year`
  return `Up to ${fmt(max!)} ${currency}/year`
}

export default function JobDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    getJob(slug).then(res => {
      if (res.data) setJob(res.data)
      else setNotFound(true)
      setLoading(false)
    })
  }, [slug])

  function handleApply() {
    if (!user) {
      navigate('/careers/login', { state: { redirect: `/jobs/${slug}/apply` } })
    } else {
      navigate(`/jobs/${slug}/apply`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-navy-950 pt-[100px]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 dark:bg-navy-700 rounded w-1/3" />
            <div className="h-10 bg-gray-200 dark:bg-navy-700 rounded w-2/3" />
            <div className="h-48 bg-gray-200 dark:bg-navy-700 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (notFound || !job) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-navy-950 pt-[100px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Job not found</p>
          <Link to="/jobs" className="mt-3 inline-block text-sm text-navy-600 dark:text-gold-400 hover:underline">
            ← Back to all jobs
          </Link>
        </div>
      </div>
    )
  }

  const employer = job.employers
  const salary = formatSalary(job.salary_min, job.salary_max, job.currency)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 pt-[100px]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/jobs" className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-navy-600 dark:hover:text-gold-400 mb-6 transition-colors">
          <ChevronLeft size={16} /> Back to jobs
        </Link>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Header card */}
            <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <div className="flex items-start gap-4">
                {employer?.logo_url ? (
                  <img src={employer.logo_url} alt={employer.company_name} className="w-14 h-14 rounded-xl object-contain border border-gray-100 dark:border-gray-700 shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-navy-100 dark:bg-navy-700 flex items-center justify-center shrink-0">
                    <Briefcase size={24} className="text-navy-500 dark:text-navy-300" />
                  </div>
                )}
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">{job.title}</h1>
                  <p className="text-gray-500 dark:text-gray-400 mt-0.5">{employer?.company_name}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1.5"><MapPin size={14} /> {job.location}</span>
                <span className="flex items-center gap-1.5"><Clock size={14} /> {job.employment_type}</span>
                <span className="flex items-center gap-1.5"><Briefcase size={14} /> {job.experience_level} level</span>
                {salary && <span className="flex items-center gap-1.5"><DollarSign size={14} /> {salary}</span>}
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  job.work_arrangement === 'remote' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                  job.work_arrangement === 'hybrid' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                  'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {job.work_arrangement}
                </span>
              </div>

              <button
                onClick={handleApply}
                className="mt-5 w-full sm:w-auto px-6 py-3 bg-navy-800 dark:bg-gold-400 text-white dark:text-navy-900 rounded-lg text-sm font-semibold hover:bg-navy-900 dark:hover:bg-gold-300 transition-colors"
              >
                Apply Now
              </button>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">About this role</h2>
              <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {job.description}
              </div>
            </div>

            {/* Requirements */}
            {job.requirements.length > 0 && (
              <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Requirements</h2>
                <ul className="space-y-2">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {job.skills_required.length > 0 && (
              <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Skills Required</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills_required.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-navy-50 dark:bg-navy-700 text-navy-700 dark:text-navy-200 rounded-full text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0 space-y-4">
            {/* Apply CTA */}
            <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
              <button
                onClick={handleApply}
                className="w-full px-4 py-3 bg-navy-800 dark:bg-gold-400 text-white dark:text-navy-900 rounded-lg text-sm font-semibold hover:bg-navy-900 dark:hover:bg-gold-300 transition-colors"
              >
                Apply Now
              </button>
              {!user && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                  You'll be asked to sign in first
                </p>
              )}
            </div>

            {/* Employer info */}
            {employer && (
              <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">About the employer</h3>
                <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">{employer.company_name}</p>
                {employer.industry && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{employer.industry}</p>}
                {employer.location && (
                  <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <MapPin size={11} /> {employer.location}
                  </p>
                )}
                {employer.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-4">{employer.description}</p>
                )}
                {employer.website && (
                  <a
                    href={employer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-navy-600 dark:text-gold-400 hover:underline mt-2"
                  >
                    <Globe size={11} /> Visit website
                  </a>
                )}
              </div>
            )}

            {/* Job details summary */}
            <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Job details</h3>
              <dl className="space-y-2 text-xs">
                <div><dt className="text-gray-500 dark:text-gray-400">Type</dt><dd className="text-gray-800 dark:text-gray-200 font-medium capitalize">{job.employment_type}</dd></div>
                <div><dt className="text-gray-500 dark:text-gray-400">Arrangement</dt><dd className="text-gray-800 dark:text-gray-200 font-medium capitalize">{job.work_arrangement}</dd></div>
                <div><dt className="text-gray-500 dark:text-gray-400">Experience</dt><dd className="text-gray-800 dark:text-gray-200 font-medium capitalize">{job.experience_level}</dd></div>
                {salary && <div><dt className="text-gray-500 dark:text-gray-400">Salary</dt><dd className="text-gray-800 dark:text-gray-200 font-medium">{salary}</dd></div>}
                {job.expires_at && (
                  <div><dt className="text-gray-500 dark:text-gray-400">Apply by</dt><dd className="text-gray-800 dark:text-gray-200 font-medium">{new Date(job.expires_at).toLocaleDateString('en-CA')}</dd></div>
                )}
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
