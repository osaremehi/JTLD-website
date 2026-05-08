// client/src/pages/admin/DashboardPage.tsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, FileText, Eye, Inbox, ArrowRight } from 'lucide-react'
import { getDashboard } from '@/lib/api'
import type { DashboardData } from '@/types'

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard().then(res => {
      setData(res.data ?? null)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-navy-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!data) {
    return <p className="text-gray-500 dark:text-gray-400">Failed to load dashboard data.</p>
  }

  const statCards = [
    { label: 'New Inquiries', value: data.stats.newInquiries, icon: Inbox, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Total Inquiries', value: data.stats.totalInquiries, icon: MessageSquare, color: 'text-green-500 bg-green-50 dark:bg-green-900/20' },
    { label: 'Published Posts', value: data.stats.publishedPosts, icon: FileText, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Page Views (30d)', value: data.stats.pageViews30d, icon: Eye, color: 'text-gold-500 bg-gold-400/10' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900 dark:text-white mb-8">Dashboard</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {statCards.map(card => (
          <div
            key={card.label}
            className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6"
          >
            <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
              <card.icon size={20} />
            </div>
            <div className="text-2xl font-bold text-navy-900 dark:text-white">{card.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Recent inquiries */}
      <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-navy-900 dark:text-white">Recent Inquiries</h2>
          <Link
            to="/admin/inquiries"
            className="text-sm font-medium text-navy-600 dark:text-gold-400 hover:underline flex items-center gap-1"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {data.recentSubmissions.length === 0 ? (
          <div className="p-6 text-center text-gray-400">No inquiries yet.</div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {data.recentSubmissions.map(sub => (
              <div key={sub.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <div className="text-sm font-semibold text-navy-900 dark:text-white">
                    {sub.first_name} {sub.last_name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {sub.email} &middot; {sub.service || 'General'}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full
                    ${sub.status === 'new' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                      sub.status === 'read' ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      sub.status === 'replied' ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                      'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                    {sub.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(sub.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
