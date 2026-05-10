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

export interface CandidateProfile {
  id: string
  user_id: string
  full_name: string
  email: string
  phone: string | null
  location: string | null
  linkedin_url: string | null
  bio: string | null
  skills: string[]
  experience: Array<{ title: string; company: string; start_date: string; end_date?: string; description?: string }>
  education: Array<{ degree: string; institution: string; year: string }>
  certifications: string[]
  availability: 'immediate' | '2-weeks' | '1-month' | 'flexible' | null
  desired_rate: number | null
  work_arrangement: 'remote' | 'hybrid' | 'onsite' | 'any' | null
  created_at: string
  updated_at: string
}

export interface EmployerProfile {
  id: string
  user_id: string
  company_name: string
  industry: string
  website: string | null
  description: string | null
  logo_url: string | null
  location: string | null
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  employer_id: string
  title: string
  slug: string
  description: string
  requirements: string[]
  skills_required: string[]
  location: string
  work_arrangement: 'remote' | 'hybrid' | 'onsite'
  employment_type: 'full-time' | 'part-time' | 'contract' | 'temp'
  salary_min: number | null
  salary_max: number | null
  currency: string
  experience_level: 'entry' | 'mid' | 'senior' | 'executive'
  is_active: boolean
  expires_at: string | null
  posted_at: string
  created_at: string
  updated_at: string
  employers?: Pick<EmployerProfile, 'company_name' | 'logo_url' | 'industry' | 'website' | 'description' | 'location'>
}

export interface Application {
  id: string
  job_id: string
  candidate_id: string
  cover_letter: string | null
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired'
  applied_at: string
  updated_at: string
  jobs?: Pick<Job, 'id' | 'title' | 'slug' | 'location' | 'work_arrangement' | 'employment_type'> & {
    employers?: Pick<EmployerProfile, 'company_name' | 'logo_url'>
  }
  candidates?: Pick<CandidateProfile, 'id' | 'full_name' | 'email' | 'phone' | 'location' | 'linkedin_url' | 'skills'>
}

export interface JobAlert {
  id: string
  candidate_id: string
  label: string | null
  q: string | null
  location: string | null
  work_arrangement: 'remote' | 'hybrid' | 'onsite' | 'any' | null
  employment_type: 'full-time' | 'part-time' | 'contract' | 'temp' | null
  experience_level: 'entry' | 'mid' | 'senior' | 'executive' | null
  frequency: 'daily' | 'weekly'
  last_sent_at: string | null
  created_at: string
}

export interface DashboardStats {
  totalInquiries: number
  newInquiries: number
  totalPosts: number
  publishedPosts: number
  pageViews30d: number
  totalJobs: number
  activeJobs: number
  totalApplications: number
  pendingApplications: number
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
