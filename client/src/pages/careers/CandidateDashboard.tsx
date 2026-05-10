import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, User, Clock, CheckCircle, XCircle, AlertCircle, ChevronRight, Plus } from 'lucide-react'
import { getMyApplications, getCandidateProfile, updateCandidateProfile } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import type { Application, CandidateProfile } from '@/types'

const STATUS_CONFIG: Record<Application['status'], { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400', icon: Clock },
  reviewed: { label: 'Reviewed', color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400', icon: AlertCircle },
  shortlisted: { label: 'Shortlisted', color: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400', icon: CheckCircle },
  rejected: { label: 'Not Selected', color: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400', icon: XCircle },
  hired: { label: 'Hired!', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400', icon: CheckCircle },
}

type Tab = 'applications' | 'profile'

export default function CandidateDashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState<Tab>('applications')
  const [applications, setApplications] = useState<Application[]>([])
  const [profile, setProfile] = useState<CandidateProfile | null>(null)
  const [loadingApps, setLoadingApps] = useState(true)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  // Profile edit state
  const [editBio, setEditBio] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editLocation, setEditLocation] = useState('')
  const [editLinkedin, setEditLinkedin] = useState('')
  const [editSkills, setEditSkills] = useState('')
  const [editAvailability, setEditAvailability] = useState<CandidateProfile['availability']>(null)
  const [editWorkArrangement, setEditWorkArrangement] = useState<CandidateProfile['work_arrangement']>(null)
  const [editDesiredRate, setEditDesiredRate] = useState('')

  useEffect(() => {
    getMyApplications().then(res => {
      setApplications(res.data ?? [])
      setLoadingApps(false)
    })
    getCandidateProfile().then(res => {
      if (res.data) {
        const p = res.data
        setProfile(p)
        setEditBio(p.bio ?? '')
        setEditPhone(p.phone ?? '')
        setEditLocation(p.location ?? '')
        setEditLinkedin(p.linkedin_url ?? '')
        setEditSkills((p.skills ?? []).join(', '))
        setEditAvailability(p.availability)
        setEditWorkArrangement(p.work_arrangement)
        setEditDesiredRate(p.desired_rate ? String(p.desired_rate) : '')
      }
      setLoadingProfile(false)
    })
  }, [])

  function showToast(type: 'success' | 'error', msg: string) {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 4000)
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await updateCandidateProfile({
      bio: editBio || null,
      phone: editPhone || null,
      location: editLocation || null,
      linkedin_url: editLinkedin || null,
      skills: editSkills ? editSkills.split(',').map(s => s.trim()).filter(Boolean) : [],
      availability: editAvailability,
      work_arrangement: editWorkArrangement,
      desired_rate: editDesiredRate ? parseFloat(editDesiredRate) : null,
    })
    setSaving(false)
    if (res.error) {
      showToast('error', 'Failed to save profile.')
    } else {
      setProfile(res.data!)
      showToast('success', 'Profile updated successfully.')
    }
  }

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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{user?.email}</p>
          </div>
          <Link to="/jobs" className="flex items-center gap-1.5 px-4 py-2 bg-navy-800 dark:bg-gold-400 text-white dark:text-navy-900 rounded-lg text-sm font-semibold hover:bg-navy-900 dark:hover:bg-gold-300 transition-colors">
            <Plus size={14} /> Browse Jobs
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700 mb-6">
          {(['applications', 'profile'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t
                  ? 'border-navy-600 dark:border-gold-400 text-navy-600 dark:text-gold-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {t === 'applications' ? <><Briefcase size={15} /> Applications {applications.length > 0 && `(${applications.length})`}</> : <><User size={15} /> Profile</>}
            </button>
          ))}
        </div>

        {/* Applications tab */}
        {tab === 'applications' && (
          <div>
            {loadingApps ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => <div key={i} className="bg-white dark:bg-navy-800 rounded-xl h-20 animate-pulse" />)}
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                <Briefcase size={36} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p className="font-medium text-gray-600 dark:text-gray-400">No applications yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Start browsing jobs and apply to positions you like.</p>
                <Link to="/jobs" className="mt-4 inline-block px-4 py-2 bg-navy-800 dark:bg-gold-400 text-white dark:text-navy-900 rounded-lg text-sm font-semibold hover:bg-navy-900 dark:hover:bg-gold-300 transition-colors">
                  Browse Jobs
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map(app => {
                  const cfg = STATUS_CONFIG[app.status]
                  const StatusIcon = cfg.icon
                  const job = app.jobs
                  return (
                    <div key={app.id} className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{job?.title ?? '—'}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{job?.employers?.company_name ?? ''} · {job?.location ?? ''}</p>
                          </div>
                          <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${cfg.color}`}>
                            <StatusIcon size={11} /> {cfg.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Applied {new Date(app.applied_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      {job?.slug && (
                        <Link to={`/jobs/${job.slug}`} className="text-gray-400 hover:text-navy-600 dark:hover:text-gold-400 transition-colors">
                          <ChevronRight size={16} />
                        </Link>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Profile tab */}
        {tab === 'profile' && (
          <div>
            {loadingProfile ? (
              <div className="bg-white dark:bg-navy-800 rounded-xl h-64 animate-pulse" />
            ) : (
              <form onSubmit={handleSaveProfile} className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-5">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Profile Information</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Phone</label>
                    <input type="tel" value={editPhone} onChange={e => setEditPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-500/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Location</label>
                    <input type="text" value={editLocation} onChange={e => setEditLocation(e.target.value)} placeholder="City, Province"
                      className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-500/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">LinkedIn URL</label>
                    <input type="url" value={editLinkedin} onChange={e => setEditLinkedin(e.target.value)} placeholder="https://linkedin.com/in/…"
                      className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-500/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Desired Rate (CAD/year)</label>
                    <input type="number" value={editDesiredRate} onChange={e => setEditDesiredRate(e.target.value)} min={0}
                      className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-500/30" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Bio</label>
                  <textarea value={editBio} onChange={e => setEditBio(e.target.value)} rows={3} maxLength={1000}
                    placeholder="Tell employers about yourself…"
                    className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-500/30 resize-y" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Skills <span className="font-normal text-gray-400">(comma-separated)</span></label>
                  <input type="text" value={editSkills} onChange={e => setEditSkills(e.target.value)} placeholder="React, TypeScript, Node.js…"
                    className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-500/30" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Availability</label>
                    <select value={editAvailability ?? ''} onChange={e => setEditAvailability(e.target.value as any || null)}
                      className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-500/30">
                      <option value="">Select…</option>
                      <option value="immediate">Immediately</option>
                      <option value="2-weeks">2 Weeks</option>
                      <option value="1-month">1 Month</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Work Preference</label>
                    <select value={editWorkArrangement ?? ''} onChange={e => setEditWorkArrangement(e.target.value as any || null)}
                      className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-500/30">
                      <option value="">Select…</option>
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="onsite">On-site</option>
                      <option value="any">Any</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="submit" disabled={saving}
                    className="px-5 py-2.5 bg-navy-800 dark:bg-gold-400 text-white dark:text-navy-900 rounded-lg text-sm font-semibold hover:bg-navy-900 dark:hover:bg-gold-300 disabled:opacity-60 transition-colors">
                    {saving ? 'Saving…' : 'Save Profile'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
