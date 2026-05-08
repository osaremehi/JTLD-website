// client/src/pages/admin/InquiriesPage.tsx
import { useState, useEffect } from 'react'
import { Mail, X } from 'lucide-react'
import { getContacts, updateContactStatus } from '@/lib/api'
import type { ContactSubmission, Pagination } from '@/types'

const STATUS_OPTIONS = ['new', 'read', 'replied', 'archived'] as const

export default function InquiriesPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<ContactSubmission | null>(null)

  function fetchData() {
    setLoading(true)
    getContacts(page, 20).then(res => {
      setSubmissions(res.data ?? [])
      setPagination(res.pagination ?? null)
      setLoading(false)
    })
  }

  useEffect(() => { fetchData() }, [page])

  async function handleStatusChange(id: string, status: string) {
    await updateContactStatus(id, status)
    setSubmissions(prev =>
      prev.map(s => s.id === id ? { ...s, status: status as ContactSubmission['status'] } : s)
    )
    if (selected?.id === id) {
      setSelected(prev => prev ? { ...prev, status: status as ContactSubmission['status'] } : null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Inquiries</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {pagination?.total ?? 0} total submissions
        </span>
      </div>

      <div className="flex gap-6">
        {/* Table */}
        <div className="flex-1 bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-6 h-6 border-4 border-navy-500 border-t-transparent rounded-full" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <Mail size={40} className="mx-auto mb-3 opacity-40" />
              No inquiries yet.
            </div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-navy-900/50">
                    <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Name</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Email</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Service</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Status</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {submissions.map(sub => (
                    <tr
                      key={sub.id}
                      onClick={() => setSelected(sub)}
                      className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-700/50 transition
                        ${selected?.id === sub.id ? 'bg-blue-50/50 dark:bg-navy-700/30' : ''}`}
                    >
                      <td className="px-5 py-3 font-medium text-navy-900 dark:text-white">
                        {sub.first_name} {sub.last_name}
                      </td>
                      <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{sub.email}</td>
                      <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{sub.service || '—'}</td>
                      <td className="px-5 py-3">
                        <select
                          value={sub.status}
                          onClick={e => e.stopPropagation()}
                          onChange={e => handleStatusChange(sub.id, e.target.value)}
                          className="text-xs font-medium px-2 py-1 rounded-md border border-gray-200 dark:border-gray-600
                                     bg-white dark:bg-navy-900 text-gray-700 dark:text-gray-300"
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-3 text-gray-400 text-xs">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 dark:border-gray-700">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-40">Previous</button>
                  <span className="text-xs text-gray-400">Page {page} of {pagination.totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}
                    className="text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-40">Next</button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-96 bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 h-fit sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-navy-900 dark:text-white">Inquiry Details</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <div className="font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase mb-1">Name</div>
                <div className="text-navy-900 dark:text-white">{selected.first_name} {selected.last_name}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase mb-1">Email</div>
                <a href={`mailto:${selected.email}`} className="text-navy-600 dark:text-gold-400 hover:underline">
                  {selected.email}
                </a>
              </div>
              {selected.company && (
                <div>
                  <div className="font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase mb-1">Company</div>
                  <div className="text-navy-900 dark:text-white">{selected.company}</div>
                </div>
              )}
              <div>
                <div className="font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase mb-1">Service</div>
                <div className="text-navy-900 dark:text-white">{selected.service || 'General Inquiry'}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase mb-1">Message</div>
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </div>
              </div>
              <div>
                <div className="font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase mb-1">Received</div>
                <div className="text-gray-700 dark:text-gray-300">
                  {new Date(selected.created_at).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <a
                href={`mailto:${selected.email}?subject=Re: JTLD Consulting Inquiry`}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold
                           bg-navy-800 text-white hover:bg-navy-700 dark:bg-gold-400 dark:text-navy-950 transition"
              >
                <Mail size={14} /> Reply via Email
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
