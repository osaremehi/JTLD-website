import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Briefcase, Clock, DollarSign, SlidersHorizontal, X } from 'lucide-react'
import { getJobs, type JobFilters } from '@/lib/api'
import type { Job, Pagination } from '@/types'

const WORK_ARRANGEMENTS = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' },
]

const EMPLOYMENT_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'temp', label: 'Temporary' },
]

const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'executive', label: 'Executive' },
]

function formatSalary(min: number | null, max: number | null, currency: string) {
  if (!min && !max) return null
  const fmt = (n: number) => `$${(n / 1000).toFixed(0)}k`
  if (min && max) return `${fmt(min)} – ${fmt(max)} ${currency}`
  if (min) return `From ${fmt(min)} ${currency}`
  return `Up to ${fmt(max!)} ${currency}`
}

function JobCard({ job }: { job: Job }) {
  const employer = job.employers
  const salary = formatSalary(job.salary_min, job.salary_max, job.currency)

  return (
    <Link
      to={`/jobs/${job.slug}`}
      className="block bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md hover:border-navy-300 dark:hover:border-navy-500 transition-all"
    >
      <div className="flex items-start gap-4">
        {employer?.logo_url ? (
          <img src={employer.logo_url} alt={employer.company_name} className="w-12 h-12 rounded-lg object-contain border border-gray-100 dark:border-gray-700 shrink-0" />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-navy-100 dark:bg-navy-700 flex items-center justify-center shrink-0">
            <Briefcase size={20} className="text-navy-500 dark:text-navy-300" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">{job.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{employer?.company_name}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <MapPin size={12} /> {job.location}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Clock size={12} /> {job.employment_type}
            </span>
            {salary && (
              <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <DollarSign size={12} /> {salary}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
          job.work_arrangement === 'remote' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
          job.work_arrangement === 'hybrid' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
          'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
        }`}>
          {job.work_arrangement}
        </span>
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          {job.experience_level}
        </span>
      </div>
    </Link>
  )
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState<JobFilters>({ page: 1, limit: 20 })
  const [search, setSearch] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    getJobs(filters).then(res => {
      if (!controller.signal.aborted) {
        setJobs(res.data ?? [])
        setPagination(res.pagination ?? null)
        setLoading(false)
      }
    })
    return () => controller.abort()
  }, [filters])

  function applySearch() {
    setFilters(f => ({ ...f, q: search || undefined, page: 1 }))
  }

  function setFilter<K extends keyof JobFilters>(key: K, value: JobFilters[K] | undefined) {
    setFilters(f => ({ ...f, [key]: value, page: 1 }))
  }

  function clearFilters() {
    setFilters({ page: 1, limit: 20 })
    setSearch('')
  }

  const activeFilterCount = [filters.work_arrangement, filters.employment_type, filters.experience_level, filters.location].filter(Boolean).length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 pt-[100px]">
      {/* Header */}
      <div className="bg-white dark:bg-navy-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Browse Jobs</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {pagination ? `${pagination.total} positions available` : 'Finding opportunities…'}
          </p>
          {/* Search bar */}
          <div className="flex gap-2 mt-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search job title or keywords…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && applySearch()}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-navy-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-500/30"
              />
            </div>
            <button
              onClick={applySearch}
              className="px-4 py-2.5 bg-navy-800 dark:bg-gold-400 text-white dark:text-navy-900 rounded-lg text-sm font-semibold hover:bg-navy-900 dark:hover:bg-gold-300 transition-colors"
            >
              Search
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors"
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 bg-navy-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{activeFilterCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Filter sidebar */}
          {showFilters && (
            <aside className="w-56 shrink-0">
              <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-5 sticky top-[110px]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Filters</span>
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600">
                      <X size={12} /> Clear
                    </button>
                  )}
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Location</label>
                  <input
                    type="text"
                    placeholder="City or province…"
                    value={filters.location ?? ''}
                    onChange={e => setFilter('location', e.target.value || undefined)}
                    className="mt-1.5 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-500/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Work Arrangement</label>
                  <div className="mt-1.5 space-y-1">
                    {WORK_ARRANGEMENTS.map(opt => (
                      <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="work_arrangement"
                          checked={filters.work_arrangement === opt.value}
                          onChange={() => setFilter('work_arrangement', filters.work_arrangement === opt.value ? undefined : opt.value as any)}
                          className="accent-navy-600"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Job Type</label>
                  <div className="mt-1.5 space-y-1">
                    {EMPLOYMENT_TYPES.map(opt => (
                      <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="employment_type"
                          checked={filters.employment_type === opt.value}
                          onChange={() => setFilter('employment_type', filters.employment_type === opt.value ? undefined : opt.value as any)}
                          className="accent-navy-600"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Experience</label>
                  <div className="mt-1.5 space-y-1">
                    {EXPERIENCE_LEVELS.map(opt => (
                      <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="experience_level"
                          checked={filters.experience_level === opt.value}
                          onChange={() => setFilter('experience_level', filters.experience_level === opt.value ? undefined : opt.value as any)}
                          className="accent-navy-600"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Job list */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 animate-pulse h-28" />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-16">
                <Briefcase size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">No jobs found</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search or filters</p>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="mt-3 text-sm text-navy-600 dark:text-gold-400 hover:underline">
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {jobs.map(job => <JobCard key={job.id} job={job} />)}
                </div>
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                      disabled={filters.page === 1}
                      onClick={() => setFilter('page', (filters.page ?? 1) - 1)}
                      className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      disabled={filters.page === pagination.totalPages}
                      onClick={() => setFilter('page', (filters.page ?? 1) + 1)}
                      className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
