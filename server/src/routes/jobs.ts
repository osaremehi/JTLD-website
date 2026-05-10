// server/src/routes/jobs.ts
import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { JobSchema, JobStatusSchema, JobFiltersSchema, PaginationSchema } from '../types/index.js'
import { validate } from '../middleware/validate.js'
import { requireAuth, requireEmployer } from '../middleware/auth.js'

const router = Router()

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    + '-' + Date.now().toString(36)
}

// ── GET /api/jobs — public: list active jobs with filters ──
router.get('/', async (req, res) => {
  try {
    const filters = JobFiltersSchema.parse(req.query)
    const { page, limit } = PaginationSchema.parse(req.query)
    const offset = (page - 1) * limit

    let query = supabase
      .from('jobs')
      .select(`
        id, title, slug, location, work_arrangement, employment_type,
        salary_min, salary_max, currency, experience_level, posted_at,
        employers ( company_name, logo_url, industry )
      `, { count: 'exact' })
      .eq('is_active', true)
      .order('posted_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (filters.work_arrangement) query = query.eq('work_arrangement', filters.work_arrangement)
    if (filters.employment_type) query = query.eq('employment_type', filters.employment_type)
    if (filters.experience_level) query = query.eq('experience_level', filters.experience_level)
    if (filters.location) query = query.ilike('location', `%${filters.location}%`)
    if (filters.q) {
      query = query.or(`title.ilike.%${filters.q}%,description.ilike.%${filters.q}%`)
    }

    const { data, error, count } = await query

    if (error) {
      res.status(500).json({ error: { code: 'DB_ERROR', message: 'Failed to fetch jobs' } })
      return
    }

    const total = count ?? 0
    res.json({ data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
  } catch (err) {
    console.error('Jobs list error:', err)
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
  }
})

// ── GET /api/jobs/:slug — public: single job with employer info ──
router.get('/:slug', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        employers ( id, company_name, logo_url, industry, website, description, location )
      `)
      .eq('slug', req.params.slug)
      .eq('is_active', true)
      .single()

    if (error || !data) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Job not found' } })
      return
    }

    res.json({ data })
  } catch (err) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
  }
})

// ── POST /api/jobs — employer: create job posting ──
router.post('/', requireAuth, requireEmployer, validate(JobSchema), async (req, res) => {
  try {
    const employer = req.employer!
    const slug = generateSlug(req.body.title)

    const { data, error } = await supabase
      .from('jobs')
      .insert({ ...req.body, employer_id: employer.id, slug, posted_at: new Date().toISOString() })
      .select()
      .single()

    if (error) {
      console.error('Job insert error:', error)
      res.status(500).json({ error: { code: 'DB_ERROR', message: 'Failed to create job' } })
      return
    }

    res.status(201).json({ data })
  } catch (err) {
    console.error('Job create error:', err)
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
  }
})

// ── PATCH /api/jobs/:id — employer: update own job ──
router.patch('/:id', requireAuth, requireEmployer, async (req, res) => {
  try {
    const employer = req.employer!

    // Verify ownership
    const { data: existing } = await supabase
      .from('jobs')
      .select('id')
      .eq('id', req.params.id)
      .eq('employer_id', employer.id)
      .single()

    if (!existing) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Job not found' } })
      return
    }

    const { data, error } = await supabase
      .from('jobs')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) {
      res.status(500).json({ error: { code: 'DB_ERROR', message: 'Failed to update job' } })
      return
    }

    res.json({ data })
  } catch (err) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
  }
})

// ── DELETE /api/jobs/:id — employer: soft-delete (deactivate) ──
router.delete('/:id', requireAuth, requireEmployer, async (req, res) => {
  try {
    const employer = req.employer!

    const { data: existing } = await supabase
      .from('jobs')
      .select('id')
      .eq('id', req.params.id)
      .eq('employer_id', employer.id)
      .single()

    if (!existing) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Job not found' } })
      return
    }

    const { error } = await supabase
      .from('jobs')
      .update({ is_active: false })
      .eq('id', req.params.id)

    if (error) {
      res.status(500).json({ error: { code: 'DB_ERROR', message: 'Failed to deactivate job' } })
      return
    }

    res.json({ data: { message: 'Job deactivated' } })
  } catch (err) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
  }
})

// ── GET /api/jobs/:id/applications — employer: list applicants ──
router.get('/:id/applications', requireAuth, requireEmployer, async (req, res) => {
  try {
    const employer = req.employer!

    // Verify job belongs to this employer
    const { data: job } = await supabase
      .from('jobs')
      .select('id')
      .eq('id', req.params.id)
      .eq('employer_id', employer.id)
      .single()

    if (!job) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Job not found' } })
      return
    }

    const { data, error } = await supabase
      .from('applications')
      .select(`
        id, status, cover_letter, applied_at, updated_at,
        candidates ( id, full_name, email, phone, location, linkedin_url, skills, experience_level )
      `)
      .eq('job_id', req.params.id)
      .order('applied_at', { ascending: false })

    if (error) {
      res.status(500).json({ error: { code: 'DB_ERROR', message: 'Failed to fetch applications' } })
      return
    }

    res.json({ data })
  } catch (err) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
  }
})

export default router
