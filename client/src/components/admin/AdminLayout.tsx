// client/src/components/admin/AdminLayout.tsx
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, MessageSquare, FileText, LogOut, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Logo from '@/components/layout/Logo'
import ThemeToggle from '@/components/layout/ThemeToggle'

const ADMIN_LINKS = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/inquiries', icon: MessageSquare, label: 'Inquiries', end: false },
  { to: '/admin/blog', icon: FileText, label: 'Blog Posts', end: false },
]

export default function AdminLayout() {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-navy-900 border-r border-gray-200 dark:border-gray-700 flex flex-col fixed h-full">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <Logo className="text-navy-900 dark:text-white" />
          <p className="text-xs text-gray-400 mt-2">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {ADMIN_LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-navy-50 dark:bg-navy-800 text-navy-800 dark:text-gold-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-navy-800 hover:text-navy-800 dark:hover:text-gray-200'}`
              }
            >
              <link.icon size={18} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <a
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
                       text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors"
          >
            <ArrowLeft size={18} /> View Site
          </a>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
                       text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-64">
        {/* Top bar */}
        <header className="h-16 bg-white dark:bg-navy-900 border-b border-gray-200 dark:border-gray-700
                          flex items-center justify-between px-8 sticky top-0 z-30">
          <div />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
