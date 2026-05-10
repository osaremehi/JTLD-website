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
import CareersPage from '@/pages/CareersPage'
import CareersLoginPage from '@/pages/careers/CareersLoginPage'
import CareersSignupPage from '@/pages/careers/CareersSignupPage'
import CareersProfilePage from '@/pages/careers/CareersProfilePage'
import CandidateDashboard from '@/pages/careers/CandidateDashboard'
import ApplyPage from '@/pages/careers/ApplyPage'
import JobsPage from '@/pages/JobsPage'
import JobDetailPage from '@/pages/JobDetailPage'
import EmployerLoginPage from '@/pages/employer/EmployerLoginPage'
import EmployerSignupPage from '@/pages/employer/EmployerSignupPage'
import EmployerDashboard from '@/pages/employer/EmployerDashboard'
import PostJobPage from '@/pages/employer/PostJobPage'
import JobApplicantsPage from '@/pages/employer/JobApplicantsPage'

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
      <Route path="/careers" element={<><Navbar /><CareersPage /><Footer /></>} />
      <Route path="/blog" element={<><Navbar /><BlogPage /><Footer /></>} />
      <Route path="/blog/:slug" element={<><Navbar /><BlogPostPage /><Footer /></>} />
      <Route path="/login" element={<LoginPage />} />

      {/* Job board — public */}
      <Route path="/jobs" element={<><Navbar /><JobsPage /><Footer /></>} />
      <Route path="/jobs/:slug" element={<><Navbar /><JobDetailPage /><Footer /></>} />

      {/* Candidate auth */}
      <Route path="/careers/login" element={<CareersLoginPage />} />
      <Route path="/careers/signup" element={<CareersSignupPage />} />

      {/* Candidate protected */}
      <Route path="/careers/profile" element={<CareersProfilePage />} />
      <Route path="/careers/dashboard" element={<><Navbar /><CandidateDashboard /><Footer /></>} />
      <Route path="/jobs/:slug/apply" element={<><Navbar /><ApplyPage /><Footer /></>} />

      {/* Employer auth */}
      <Route path="/employer/login" element={<EmployerLoginPage />} />
      <Route path="/employer/signup" element={<EmployerSignupPage />} />

      {/* Employer protected */}
      <Route path="/employer/dashboard" element={<><Navbar /><EmployerDashboard /><Footer /></>} />
      <Route path="/employer/jobs/new" element={<><Navbar /><PostJobPage /><Footer /></>} />
      <Route path="/employer/jobs/:id/edit" element={<><Navbar /><PostJobPage /><Footer /></>} />
      <Route path="/employer/jobs/:id/applicants" element={<><Navbar /><JobApplicantsPage /><Footer /></>} />

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
