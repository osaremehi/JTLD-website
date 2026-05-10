import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, User, MapPin, Phone, ChevronDown } from 'lucide-react'
import { getJobApplications, updateApplicationStatus } from '@/lib/api'
import type { Application } from '@/types'

const STATUSES: Array<{ value: Application['status']; label: string; color: string }> = [
  { value: 'pending', label: 'Pending', color: 'text-yellow-700 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20' },
  { value: 'reviewed', label: 'Reviewed', color: 'text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20' },
  { value: 'shortlisted', label: 'Shortlisted', color: 'text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-900/20' },
  { value: 'rejected', label: 'Rejected', color: 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/20' },
  { value: 'hired', label: 'Hired', color: 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20' },
]

export default function JobApplicantsPage() {
  const { id } = useParams<{ id: string }>()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  useEffect(() => {
    if (!id) return
    getJobApplications(id).then(res => {
      setApplications(res.data ?? [])
      setLoading(false)
    })
  }, [id])

  function showToast(type: 'success' | 'error', msg: string) {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 4000)
  }

  async function handleStatusChange(appId: string, status: Application['status']) {
    const res = await updateApplicationStatus(appId, status)
    if (res.error) {
      showToast('error', 'Failed to update status.')
    } else {
      setApplications(apps => apps.map(a => a.id === appId ? { ...a, status } : a))
      showToast('success', `Status updated to "${status}".`)
    }
  }

  const statusCounts = STATUSES.reduce((acc, s) => {
    acc[s.value] = applications.filter(a => a.status === s.value).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 pt-[100px]">
      {toast && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/employer/dashboard" className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-navy-600 dark:hover:text-gold-400 mb-6 transition-colors">
          <ChevronLeft size={16} /> Back to dashboard
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Applicants</h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">{applications.length} total</span>
        </div>

        {/* Status summary pills */}
        {!loading && applications.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {STATUSES.map(s => statusCounts[s.value] > 0 && (
              <span key={s.value} className={`px-2.5 py-1 rounded-full text-xs font-medium ${s.color}`}>
                {s.label}: {statusCounts[s.value]}
              </span>
            ))}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="bg-white dark:bg-navy-800 rounded-xl h-24 animate-pulse" />)}
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            <User size={36} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="font-medium text-gray-600 dark:text-gray-400">No applicants yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Applications will appear here once candidates apply.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map(app => {
              const candidate = app.candidates
              const isExpanded = expanded === app.id
              const currentStatus = STATUSES.find(s => s.value === app.status)

              return (
                <div key={app.id} className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <div className="p-4 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-navy-100 dark:bg-navy-700 flex items-center justify-center shrink-0">
                      <User size={18} className="text-navy-500 dark:text-navy-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-sm text-gray-900 dark:text-white">{candidate?.full_name ?? 'Unknown'}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{candidate?.email}</p>
                          <div className="flex flex-wrap gap-x-3 mt-1">
                            {candidate?.phone && (
                              <span className="flex items-center gap-1 text-xs text-gray-400"><Phone size={10} /> {candidate.phone}</span>
                            )}
                            {candidate?.location && (
                              <span className="flex items-center gap-1 text-xs text-gray-400"><MapPin size={10} /> {candidate.location}</span>
                            )}
                          </div>
                          {(candidate?.skills ?? []).length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {(candidate!.skills ?? []).slice(0, 4).map(s => (
                                <span key={s} className="px-1.5 py-0.5 bg-gray-100 dark:bg-navy-700 text-gray-600 dark:text-gray-300 rounded text-xs">{s}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Status dropdown */}
                          <div className="relative">
                            <select
                              value={app.status}
                              onChange={e => handleStatusChange(app.id, e.target.value as Application['status'])}
                              className={`appearance-none pl-2.5 pr-6 py-1.5 rounded-full text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-navy-500/30 cursor-pointer ${currentStatus?.color}`}
                            >
                              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                            <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                          <button
                            onClick={() => setExpanded(isExpanded ? null : app.id)}
                            className="text-xs text-gray-500 dark:text-gray-400 hover:text-navy-600 dark:hover:text-gold-400 transition-colors"
                          >
                            {isExpanded ? 'Less' : 'More'}
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Applied {new Date(app.applied_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {isExpanded && app.cover_letter && (
                    <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-3">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Cover Letter</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{app.cover_letter}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
