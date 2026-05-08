// server/src/routes/contact.ts
import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { ContactSchema, ContactStatusSchema, PaginationSchema } from '../types/index.js'
import { validate } from '../middleware/validate.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = Router()

// ── POST /api/contacts — public: submit contact form ──
router.post('/', validate(ContactSchema), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert(req.body)
      .select()
      .single()

    if (error) {
      console.error('Contact insert error:', error)
      res.status(500).json({ error: { code: 'DB_ERROR', message: 'Failed to save submission' } })
      return
    }

    res.status(201).json({ data })
  } catch (err) {
    console.error('Contact route error:', err)
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
  }
})

// ── GET /api/contacts — admin: list submissions ──
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { page, limit } = PaginationSchema.parse(req.query)
    const offset = (page - 1) * limit

    // Get total count
    const { count } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true })

    // Get paginated data
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      res.status(500).json({ error: { code: 'DB_ERROR', message: 'Failed to fetch submissions' } })
      return
    }

    const total = count ?? 0
    res.json({
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (err) {
    console.error('Contact list error:', err)
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
  }
})

// ── GET /api/contacts/:id — admin: get single submission ──
router.get('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error || !data) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Submission not found' } })
      return
    }

    res.json({ data })
  } catch (err) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
  }
})

// ── PATCH /api/contacts/:id/status — admin: update status ──
router.patch('/:id/status', requireAuth, requireAdmin, validate(ContactStatusSchema), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .update({ status: req.body.status })
      .eq('id', req.params.id)
      .select()
      .single()

    if (error || !data) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Submission not found' } })
      return
    }

    res.json({ data })
  } catch (err) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
  }
})

export default router
