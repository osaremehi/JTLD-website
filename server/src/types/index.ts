// server/src/types/index.ts
import { z } from 'zod'

// ── Contact Form ──
export const ContactSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address'),
  company: z.string().max(200).optional().default(''),
  service: z.string().max(100).optional().default(''),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
})
export type ContactInput = z.infer<typeof ContactSchema>

export const ContactStatusSchema = z.object({
  status: z.enum(['new', 'read', 'replied', 'archived']),
})

// ── Blog Post ──
export const BlogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens'),
  excerpt: z.string().max(500).optional().default(''),
  content: z.string().min(1, 'Content is required'),
  cover_image: z.string().url().optional().nullable(),
  author_name: z.string().max(100).optional().default('JTLD Consulting'),
  status: z.enum(['draft', 'published', 'archived']).optional().default('draft'),
  tags: z.array(z.string()).optional().default([]),
})
export type BlogPostInput = z.infer<typeof BlogPostSchema>

// ── Employer Profile ──
export const EmployerProfileSchema = z.object({
  company_name: z.string().min(1, 'Company name is required').max(200),
  industry: z.string().min(1, 'Industry is required').max(100),
  website: z.string().url('Invalid URL').optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  logo_url: z.string().url('Invalid URL').optional().nullable(),
  location: z.string().max(200).optional().nullable(),
})
export type EmployerProfileInput = z.infer<typeof EmployerProfileSchema>

// ── Job ──
export const JobSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required'),
  requirements: z.array(z.string()).optional().default([]),
  skills_required: z.array(z.string()).optional().default([]),
  location: z.string().min(1, 'Location is required').max(200),
  work_arrangement: z.enum(['remote', 'hybrid', 'onsite']),
  employment_type: z.enum(['full-time', 'part-time', 'contract', 'temp']),
  salary_min: z.coerce.number().positive().optional().nullable(),
  salary_max: z.coerce.number().positive().optional().nullable(),
  experience_level: z.enum(['entry', 'mid', 'senior', 'executive']),
  expires_at: z.string().datetime().optional().nullable(),
})
export type JobInput = z.infer<typeof JobSchema>

export const JobStatusSchema = z.object({
  is_active: z.boolean(),
})

// ── Application ──
export const ApplicationSchema = z.object({
  cover_letter: z.string().max(5000).optional().nullable(),
})
export type ApplicationInput = z.infer<typeof ApplicationSchema>

export const ApplicationStatusSchema = z.object({
  status: z.enum(['pending', 'reviewed', 'shortlisted', 'rejected', 'hired']),
})

// ── Job Alert ──
export const JobAlertSchema = z.object({
  label: z.string().max(100).optional().nullable(),
  q: z.string().optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  work_arrangement: z.enum(['remote', 'hybrid', 'onsite', 'any']).optional().nullable(),
  employment_type: z.enum(['full-time', 'part-time', 'contract', 'temp']).optional().nullable(),
  experience_level: z.enum(['entry', 'mid', 'senior', 'executive']).optional().nullable(),
  frequency: z.enum(['daily', 'weekly']).default('daily'),
})
export type JobAlertInput = z.infer<typeof JobAlertSchema>

// ── Job Filters ──
export const JobFiltersSchema = z.object({
  q: z.string().optional(),
  location: z.string().optional(),
  work_arrangement: z.enum(['remote', 'hybrid', 'onsite']).optional(),
  employment_type: z.enum(['full-time', 'part-time', 'contract', 'temp']).optional(),
  experience_level: z.enum(['entry', 'mid', 'senior', 'executive']).optional(),
})

// ── Pagination ──
export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
})

// ── API Response Envelope ──
export interface ApiResponse<T = unknown> {
  data?: T
  error?: { code: string; message: string; details?: unknown }
  pagination?: { page: number; limit: number; total: number; totalPages: number }
}
