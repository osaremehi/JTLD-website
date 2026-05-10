import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Briefcase, Plus, Users, Eye, EyeOff, ChevronRight } from 'lucide-react'
import { getEmployerJobs, deactivateJob } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import type { Job } from '@/types'

export default function EmployerDashboard() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  useEffect(() => {
    if (!authLoading && !user) navigate('/employer/login')
  }, [user, authLoading, navigate])

  useEffect(() => {
    getEmployerJobs().then(res => {
      setJobs(res.data ?? [])
      setLoading(false)
    })
  }, [])

  function showToast(type: 'success' | 'error', msg: string) {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 4000)
  }

  async function handleDeactivate(jobId: string) {
    const res = await deactivateJob(jobId)
    if (res.error) {
      showToast('error', 'Failed to deactivate job.')
    } else {
      setJobs(j => j.map(job => job.id === jobId ? { ...job, is_active: false } : job))
      showToast('success', 'Job deactivated.')
    }
  }

  const activeJobs = jobs.filter(j => j.is_active)
  const inactiveJobs = jobs.filter(j => !j.is_active)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 pt-[100px]">
      {toast && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Employer Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{user?.email}</p>
          </div>
          <Link
            to="/employer/jobs/new"
            className="flex items-center gap-1.5 px-4 py-2 bg-navy-800 dark:bg-gold-400 text-white dark:text-navy-900 rounded-lg text-sm font-semibold hover:bg-navy-900 dark:hover:bg-gold-300 transition-colors"
          >
            <Plus size={14} /> Post a Job
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Active Jobs', value: activeJobs.length, icon: Briefcase },
            { label: 'Total Jobs', value: jobs.length, icon: Eye },
            { label: 'Total Applicants', value: jobs.reduce((sum, j) => sum + ((j as any).applications?.[0]?.count ?? 0), 0), icon: Users },
          ].map(stat => (
            <div key={stat.label} className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                <stat.icon size={14} />
                <span className="text-xs">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Active Jobs */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Eye size={14} className="text-green-500" /> Active Postings
          </h2>
          {loading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => <div key={i} className="bg-white dark:bg-navy-800 rounded-xl h-20 animate-pulse" />)}
            </div>
          ) : activeJobs.length === 0 ? (
            <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center">
              <Briefcase size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No active jobs. Post your first job to get started.</p>
              <Link to="/employer/jobs/new" className="mt-3 inline-block px-4 py-2 bg-navy-800 dark:bg-gold-400 text-white dark:text-navy-900 rounded-lg text-sm font-semibold hover:bg-navy-900 dark:hover:bg-gold-300 transition-colors">
                Post a Job
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {activeJobs.map(job => <JobRow key={job.id} job={job} onDeactivate={handleDeactivate} />)}
            </div>
          )}
        </div>

        {/* Inactive Jobs */}
        {inactiveJobs.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <EyeOff size={14} className="text-gray-400" /> Closed Postings
            </h2>
            <div className="space-y-3 opacity-70">
              {inactiveJobs.map(job => <JobRow key={job.id} job={job} onDeactivate={handleDeactivate} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function JobRow({ job, onDeactivate }: { job: Job; onDeactivate: (id: string) => void }) {
  return (
    <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{job.title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{job.location} · {job.employment_type} · {job.work_arrangement}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          Posted {new Date(job.posted_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link
          to={`/employer/jobs/${job.id}/applicants`}
          className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors"
        >
          <Users size={12} /> Applicants
        </Link>
        <Link
          to={`/employer/jobs/${job.id}/edit`}
          className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors"
        >
          Edit
        </Link>
        {job.is_active && (
          <button
            onClick={() => onDeactivate(job.id)}
            className="px-3 py-1.5 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Close
          </button>
        )}
        <Link to={`/jobs/${job.slug}`} className="text-gray-400 hover:text-navy-600 dark:hover:text-gold-400 transition-colors">
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  )
}
