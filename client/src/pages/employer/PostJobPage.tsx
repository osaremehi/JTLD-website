import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ChevronLeft, Plus, X, AlertCircle } from 'lucide-react'
import { createJob, updateJob, getEmployerJobs } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import type { Job } from '@/types'

const inputCls = 'w-full px-3.5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-500/30'
const selectCls = inputCls

export default function PostJobPage() {
  const { id } = useParams<{ id?: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()

  const [form, setForm] = useState({
    title: '', description: '', location: '',
    work_arrangement: 'hybrid' as Job['work_arrangement'],
    employment_type: 'full-time' as Job['employment_type'],
    experience_level: 'mid' as Job['experience_level'],
    salary_min: '', salary_max: '',
    expires_at: '',
  })
  const [requirements, setRequirements] = useState<string[]>([''])
  const [skills, setSkills] = useState<string[]>([''])
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) navigate('/employer/login')
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (!isEdit || !id) return
    getEmployerJobs().then(res => {
      const job = res.data?.find(j => j.id === id)
      if (!job) return
      setForm({
        title: job.title,
        description: job.description,
        location: job.location,
        work_arrangement: job.work_arrangement,
        employment_type: job.employment_type,
        experience_level: job.experience_level,
        salary_min: job.salary_min ? String(job.salary_min) : '',
        salary_max: job.salary_max ? String(job.salary_max) : '',
        expires_at: job.expires_at ? job.expires_at.split('T')[0] : '',
      })
      setRequirements(job.requirements.length ? job.requirements : [''])
      setSkills(job.skills_required.length ? job.skills_required : [''])
    })
  }, [id, isEdit])

  function setField<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function updateList(list: string[], setList: (l: string[]) => void, idx: number, value: string) {
    const next = [...list]; next[idx] = value; setList(next)
  }
  function addItem(list: string[], setList: (l: string[]) => void) { setList([...list, '']) }
  function removeItem(list: string[], setList: (l: string[]) => void, idx: number) {
    setList(list.filter((_, i) => i !== idx))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const payload = {
      ...form,
      salary_min: form.salary_min ? parseFloat(form.salary_min) : null,
      salary_max: form.salary_max ? parseFloat(form.salary_max) : null,
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
      requirements: requirements.filter(Boolean),
      skills_required: skills.filter(Boolean),
    }

    const res = isEdit && id ? await updateJob(id, payload) : await createJob(payload)

    if (res.error) {
      setError(res.error.message || 'Failed to save job')
      setSubmitting(false)
      return
    }

    navigate('/employer/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 pt-[100px]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/employer/dashboard" className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-navy-600 dark:hover:text-gold-400 mb-6 transition-colors">
          <ChevronLeft size={16} /> Back to dashboard
        </Link>

        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{isEdit ? 'Edit Job' : 'Post a New Job'}</h1>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-6">
            <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic info */}
          <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Basic Information</h2>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Job Title *</label>
              <input required type="text" value={form.title} onChange={e => setField('title', e.target.value)} placeholder="e.g. Senior Software Engineer" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Location *</label>
              <input required type="text" value={form.location} onChange={e => setField('location', e.target.value)} placeholder="e.g. Toronto, ON or Remote – Canada" className={inputCls} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Work Arrangement *</label>
                <select value={form.work_arrangement} onChange={e => setField('work_arrangement', e.target.value as any)} className={selectCls}>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Job Type *</label>
                <select value={form.employment_type} onChange={e => setField('employment_type', e.target.value as any)} className={selectCls}>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="temp">Temporary</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Experience Level *</label>
                <select value={form.experience_level} onChange={e => setField('experience_level', e.target.value as any)} className={selectCls}>
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior</option>
                  <option value="executive">Executive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Job Description *</h2>
            <textarea required value={form.description} onChange={e => setField('description', e.target.value)} rows={10}
              placeholder="Describe the role, responsibilities, team, and what success looks like…"
              className={`${inputCls} resize-y`} />
          </div>

          {/* Requirements */}
          <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-3">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Requirements</h2>
            {requirements.map((req, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={req} onChange={e => updateList(requirements, setRequirements, i, e.target.value)}
                  placeholder={`Requirement ${i + 1}…`} className={`${inputCls} flex-1`} />
                {requirements.length > 1 && (
                  <button type="button" onClick={() => removeItem(requirements, setRequirements, i)}
                    className="text-gray-400 hover:text-red-500 transition-colors"><X size={16} /></button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => addItem(requirements, setRequirements)}
              className="flex items-center gap-1.5 text-sm text-navy-600 dark:text-gold-400 hover:underline">
              <Plus size={14} /> Add requirement
            </button>
          </div>

          {/* Skills */}
          <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-3">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Skills Required</h2>
            {skills.map((skill, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={skill} onChange={e => updateList(skills, setSkills, i, e.target.value)}
                  placeholder={`e.g. TypeScript, React, AWS…`} className={`${inputCls} flex-1`} />
                {skills.length > 1 && (
                  <button type="button" onClick={() => removeItem(skills, setSkills, i)}
                    className="text-gray-400 hover:text-red-500 transition-colors"><X size={16} /></button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => addItem(skills, setSkills)}
              className="flex items-center gap-1.5 text-sm text-navy-600 dark:text-gold-400 hover:underline">
              <Plus size={14} /> Add skill
            </button>
          </div>

          {/* Compensation & Expiry */}
          <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Compensation & Deadline</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Min Salary (CAD/yr)</label>
                <input type="number" min={0} value={form.salary_min} onChange={e => setField('salary_min', e.target.value)} placeholder="60000" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Max Salary (CAD/yr)</label>
                <input type="number" min={0} value={form.salary_max} onChange={e => setField('salary_max', e.target.value)} placeholder="90000" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Apply-by Date</label>
                <input type="date" value={form.expires_at} onChange={e => setField('expires_at', e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Link to="/employer/dashboard"
              className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors">
              Cancel
            </Link>
            <button type="submit" disabled={submitting}
              className="px-6 py-2.5 bg-navy-800 dark:bg-gold-400 text-white dark:text-navy-900 rounded-lg text-sm font-semibold hover:bg-navy-900 dark:hover:bg-gold-300 disabled:opacity-60 transition-colors">
              {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Publish Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
