// client/src/lib/api.ts
import { supabase } from './supabase'
import type { ApiResponse, BlogPost, ContactSubmission, DashboardData, Job, Application, EmployerProfile, CandidateProfile, JobAlert } from '@/types'

const API_URL = import.meta.env.VITE_API_URL || '/api'

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...await getAuthHeaders(),
    ...(options.headers as Record<string, string> || {}),
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })
  if (res.status === 204) return {}
  return res.json()
}

// ── Public API ──

export async function submitContact(data: {
  first_name: string; last_name: string; email: string
  company?: string; service?: string; message: string
}) {
  return request<ContactSubmission>('/contacts', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getBlogPosts(page = 1, limit = 10) {
  return request<BlogPost[]>(`/blog?page=${page}&limit=${limit}`)
}

export async function getBlogPost(slug: string) {
  return request<BlogPost>(`/blog/${slug}`)
}

// ── Admin API ──

export async function getDashboard() {
  return request<DashboardData>('/admin/dashboard')
}

export async function getAdminBlogPosts(page = 1, limit = 20) {
  return request<BlogPost[]>(`/admin/blog?page=${page}&limit=${limit}`)
}

export async function getContacts(page = 1, limit = 20) {
  return request<ContactSubmission[]>(`/contacts?page=${page}&limit=${limit}`)
}

export async function getContact(id: string) {
  return request<ContactSubmission>(`/contacts/${id}`)
}

export async function updateContactStatus(id: string, status: string) {
  return request<ContactSubmission>(`/contacts/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export async function createBlogPost(data: Partial<BlogPost>) {
  return request<BlogPost>('/blog', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateBlogPost(id: string, data: Partial<BlogPost>) {
  return request<BlogPost>(`/blog/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function deleteBlogPost(id: string) {
  return request(`/blog/${id}`, { method: 'DELETE' })
}

export async function getAnalytics(days = 30) {
  return request(`/admin/analytics?days=${days}`)
}

// ── Jobs API ──

export interface JobFilters {
  q?: string
  location?: string
  work_arrangement?: 'remote' | 'hybrid' | 'onsite'
  employment_type?: 'full-time' | 'part-time' | 'contract' | 'temp'
  experience_level?: 'entry' | 'mid' | 'senior' | 'executive'
  page?: number
  limit?: number
}

export async function getJobs(filters: JobFilters = {}) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => { if (v !== undefined) params.set(k, String(v)) })
  return request<Job[]>(`/jobs?${params.toString()}`)
}

export async function getJob(slug: string) {
  return request<Job>(`/jobs/${slug}`)
}

export async function createJob(data: Partial<Job>) {
  return request<Job>('/jobs', { method: 'POST', body: JSON.stringify(data) })
}

export async function updateJob(id: string, data: Partial<Job>) {
  return request<Job>(`/jobs/${id}`, { method: 'PATCH', body: JSON.stringify(data) })
}

export async function deactivateJob(id: string) {
  return request(`/jobs/${id}`, { method: 'DELETE' })
}

export async function getEmployerJobs() {
  return request<Job[]>('/employers/jobs')
}

export async function getJobApplications(jobId: string) {
  return request<Application[]>(`/jobs/${jobId}/applications`)
}

// ── Applications API ──

export async function applyToJob(jobId: string, data: { cover_letter?: string }) {
  return request<Application>(`/applications/jobs/${jobId}/apply`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getMyApplications() {
  return request<Application[]>('/applications/mine')
}

export async function updateApplicationStatus(id: string, status: Application['status']) {
  return request<Application>(`/applications/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

// ── Employer Profile API ──

export async function getEmployerProfile() {
  return request<EmployerProfile>('/employers/profile')
}

export async function createEmployerProfile(data: Partial<EmployerProfile>) {
  return request<EmployerProfile>('/employers/profile', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateEmployerProfile(data: Partial<EmployerProfile>) {
  return request<EmployerProfile>('/employers/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

// ── Job Alerts API ──

export async function getMyJobAlerts() {
  return request<JobAlert[]>('/job-alerts')
}

export async function createJobAlert(data: {
  label?: string; q?: string; location?: string
  work_arrangement?: string; employment_type?: string
  experience_level?: string; frequency?: string
}) {
  return request<JobAlert>('/job-alerts', { method: 'POST', body: JSON.stringify(data) })
}

export async function deleteJobAlert(id: string) {
  return request(`/job-alerts/${id}`, { method: 'DELETE' })
}

// ── Candidate Profile API ──

export async function getCandidateProfile() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .eq('user_id', user.id)
    .single()
  return error ? { error: { code: 'DB_ERROR', message: error.message } } : { data: data as CandidateProfile }
}

export async function updateCandidateProfile(updates: Partial<CandidateProfile>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }
  const { data, error } = await supabase
    .from('candidates')
    .update(updates)
    .eq('user_id', user.id)
    .select()
    .single()
  return error ? { error: { code: 'DB_ERROR', message: error.message } } : { data: data as CandidateProfile }
}
