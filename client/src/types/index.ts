// client/src/types/index.ts

export interface ContactSubmission {
  id: string
  first_name: string
  last_name: string
  email: string
  company: string
  service: string
  message: string
  status: 'new' | 'read' | 'replied' | 'archived'
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string | null
  author_id: string | null
  author_name: string
  status: 'draft' | 'published' | 'archived'
  tags: string[]
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  totalInquiries: number
  newInquiries: number
  totalPosts: number
  publishedPosts: number
  pageViews30d: number
}

export interface DashboardData {
  stats: DashboardStats
  recentSubmissions: ContactSubmission[]
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiResponse<T = unknown> {
  data?: T
  error?: { code: string; message: string; details?: unknown }
  pagination?: Pagination
}
