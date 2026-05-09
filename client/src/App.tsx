// client/src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HomePage from '@/pages/HomePage'
import BlogPage from '@/pages/BlogPage'
import BlogPostPage from '@/pages/BlogPostPage'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/admin/DashboardPage'
import InquiriesPage from '@/pages/admin/InquiriesPage'
import BlogEditorPage from '@/pages/admin/BlogEditorPage'
import AdminLayout from '@/components/admin/AdminLayout'
import ServicesPage from '@/pages/ServicesPage'
import AboutPage from '@/pages/AboutPage'
import IndustriesPage from '@/pages/IndustriesPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-navy-500 border-t-transparent rounded-full" />
      </div>
    )
  }
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<><Navbar /><HomePage /><Footer /></>} />
      <Route path="/services" element={<><Navbar /><ServicesPage /><Footer /></>} />
      <Route path="/about" element={<><Navbar /><AboutPage /><Footer /></>} />
      <Route path="/industries" element={<><Navbar /><IndustriesPage /><Footer /></>} />
      <Route path="/blog" element={<><Navbar /><BlogPage /><Footer /></>} />
      <Route path="/blog/:slug" element={<><Navbar /><BlogPostPage /><Footer /></>} />
      <Route path="/login" element={<LoginPage />} />

      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute><AdminLayout /></ProtectedRoute>
      }>
        <Route index element={<DashboardPage />} />
        <Route path="inquiries" element={<InquiriesPage />} />
        <Route path="blog" element={<BlogEditorPage />} />
        <Route path="blog/new" element={<BlogEditorPage />} />
        <Route path="blog/:id" element={<BlogEditorPage />} />
      </Route>
    </Routes>
  )
}
