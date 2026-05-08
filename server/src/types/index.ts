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
