// client/src/lib/api.ts
import { supabase } from './supabase'
import type { ApiResponse, BlogPost, ContactSubmission, DashboardData } from '@/types'

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
