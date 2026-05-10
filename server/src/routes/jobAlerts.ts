// server/src/routes/jobAlerts.ts
import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { JobAlertSchema } from '../types/index.js'
import { validate } from '../middleware/validate.js'
import { requireAuth, requireCandidate } from '../middleware/auth.js'

const router = Router()

// ── GET /api/job-alerts — candidate: list own alerts ──
router.get('/', requireAuth, requireCandidate, async (req, res) => {
  try {
    const candidate = req.candidate!

    const { data, error } = await supabase
      .from('job_alerts')
      .select('*')
      .eq('candidate_id', candidate.id)
      .order('created_at', { ascending: false })

    if (error) {
      res.status(500).json({ error: { code: 'DB_ERROR', message: 'Failed to fetch job alerts' } })
      return
    }

    res.json({ data })
  } catch (err) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
  }
})

// ── POST /api/job-alerts — candidate: create alert ──
router.post('/', requireAuth, requireCandidate, validate(JobAlertSchema), async (req, res) => {
  try {
    const candidate = req.candidate!

    const { data, error } = await supabase
      .from('job_alerts')
      .insert({
        candidate_id: candidate.id,
        label: req.body.label ?? null,
        q: req.body.q ?? null,
        location: req.body.location ?? null,
        work_arrangement: req.body.work_arrangement ?? null,
        employment_type: req.body.employment_type ?? null,
        experience_level: req.body.experience_level ?? null,
        frequency: req.body.frequency,
      })
      .select()
      .single()

    if (error) {
      console.error('Job alert insert error:', error)
      res.status(500).json({ error: { code: 'DB_ERROR', message: 'Failed to create job alert' } })
      return
    }

    res.status(201).json({ data })
  } catch (err) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
  }
})

// ── DELETE /api/job-alerts/:id — candidate: delete alert ──
router.delete('/:id', requireAuth, requireCandidate, async (req, res) => {
  try {
    const candidate = req.candidate!

    const { error } = await supabase
      .from('job_alerts')
      .delete()
      .eq('id', req.params.id)
      .eq('candidate_id', candidate.id)

    if (error) {
      res.status(500).json({ error: { code: 'DB_ERROR', message: 'Failed to delete job alert' } })
      return
    }

    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
  }
})

export default router
