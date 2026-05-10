// server/src/routes/employers.ts
import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { EmployerProfileSchema } from '../types/index.js'
import { validate } from '../middleware/validate.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// ── POST /api/employers/profile — create employer profile ──
router.post('/profile', requireAuth, validate(EmployerProfileSchema), async (req, res) => {
  try {
    // Check if profile already exists
    const { data: existing } = await supabase
      .from('employers')
      .select('id')
      .eq('user_id', req.user!.id)
      .single()

    if (existing) {
      res.status(409).json({ error: { code: 'ALREADY_EXISTS', message: 'Employer profile already exists' } })
      return
    }

    const { data, error } = await supabase
      .from('employers')
      .insert({ ...req.body, user_id: req.user!.id })
      .select()
      .single()

    if (error) {
      console.error('Employer insert error:', error)
      res.status(500).json({ error: { code: 'DB_ERROR', message: 'Failed to create employer profile' } })
      return
    }

    res.status(201).json({ data })
  } catch (err) {
    console.error('Employer create error:', err)
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
  }
})

// ── GET /api/employers/profile — get own employer profile ──
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('employers')
      .select('*')
      .eq('user_id', req.user!.id)
      .single()

    if (error || !data) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Employer profile not found' } })
      return
    }

    res.json({ data })
  } catch (err) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
  }
})

// ── PATCH /api/employers/profile — update own employer profile ──
router.patch('/profile', requireAuth, validate(EmployerProfileSchema.partial()), async (req, res) => {
  try {
    const { data: existing } = await supabase
      .from('employers')
      .select('id')
      .eq('user_id', req.user!.id)
      .single()

    if (!existing) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Employer profile not found' } })
      return
    }

    const { data, error } = await supabase
      .from('employers')
      .update(req.body)
      .eq('user_id', req.user!.id)
      .select()
      .single()

    if (error) {
      res.status(500).json({ error: { code: 'DB_ERROR', message: 'Failed to update employer profile' } })
      return
    }

    res.json({ data })
  } catch (err) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
  }
})

// ── GET /api/employers/jobs — employer: list own job postings ──
router.get('/jobs', requireAuth, async (req, res) => {
  try {
    const { data: employer } = await supabase
      .from('employers')
      .select('id')
      .eq('user_id', req.user!.id)
      .single()

    if (!employer) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Employer profile not found' } })
      return
    }

    const { data, error } = await supabase
      .from('jobs')
      .select(`
        id, title, slug, location, work_arrangement, employment_type,
        experience_level, is_active, posted_at, expires_at,
        applications ( count )
      `)
      .eq('employer_id', employer.id)
      .order('posted_at', { ascending: false })

    if (error) {
      res.status(500).json({ error: { code: 'DB_ERROR', message: 'Failed to fetch jobs' } })
      return
    }

    res.json({ data })
  } catch (err) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
  }
})

export default router
