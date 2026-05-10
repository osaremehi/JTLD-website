// server/src/routes/applications.ts
import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { sendApplicationConfirmation, sendNewApplicationAlert } from '../lib/email.js'
import { ApplicationSchema, ApplicationStatusSchema } from '../types/index.js'
import { validate } from '../middleware/validate.js'
import { requireAuth, requireCandidate, requireEmployer } from '../middleware/auth.js'

const router = Router()

// ── POST /api/jobs/:id/apply — candidate: submit application ──
router.post('/jobs/:id/apply', requireAuth, requireCandidate, validate(ApplicationSchema), async (req, res) => {
  try {
    const candidate = req.candidate!

    // Verify job exists and is active
    const { data: job } = await supabase
      .from('jobs')
      .select('id, title, employers ( id, company_name, user_id )')
      .eq('id', req.params.id)
      .eq('is_active', true)
      .single()

    if (!job) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Job not found or no longer active' } })
      return
    }

    const { data, error } = await supabase
      .from('applications')
      .insert({
        job_id: req.params.id,
        candidate_id: candidate.id,
        cover_letter: req.body.cover_letter ?? null,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        res.status(409).json({ error: { code: 'ALREADY_APPLIED', message: 'You have already applied to this job' } })
        return
      }
      console.error('Application insert error:', error)
      res.status(500).json({ error: { code: 'DB_ERROR', message: 'Failed to submit application' } })
      return
    }

    res.status(201).json({ data })

    // Send emails async (non-blocking)
    const employer = (job as any).employers
    Promise.all([
      sendApplicationConfirmation({
        candidateName: candidate.full_name,
        candidateEmail: candidate.email,
        jobTitle: job.title,
        companyName: employer?.company_name ?? 'the employer',
      }),
      employer?.user_id ? supabase.auth.admin.getUserById(employer.user_id).then(({ data: u }) => {
        if (u.user?.email) {
          return sendNewApplicationAlert({
            employerEmail: u.user.email,
            companyName: employer.company_name,
            candidateName: candidate.full_name,
            jobTitle: job.title,
            jobId: req.params.id,
          })
        }
      }) : Promise.resolve(),
    ]).catch(err => console.error('Email send error:', err))
  } catch (err) {
    console.error('Apply error:', err)
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
  }
})

// ── GET /api/applications/mine — candidate: list own applications ──
router.get('/mine', requireAuth, requireCandidate, async (req, res) => {
  try {
    const candidate = req.candidate!

    const { data, error } = await supabase
      .from('applications')
      .select(`
        id, status, cover_letter, applied_at, updated_at,
        jobs (
          id, title, slug, location, work_arrangement, employment_type,
          employers ( company_name, logo_url )
        )
      `)
      .eq('candidate_id', candidate.id)
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

// ── PATCH /api/applications/:id/status — employer: update application status ──
router.patch('/:id/status', requireAuth, requireEmployer, validate(ApplicationStatusSchema), async (req, res) => {
  try {
    const employer = req.employer!

    // Verify employer owns the job this application belongs to
    const { data: app } = await supabase
      .from('applications')
      .select(`id, jobs ( employer_id )`)
      .eq('id', req.params.id)
      .single()

    if (!app) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Application not found' } })
      return
    }

    const jobEmployerId = (app.jobs as any)?.employer_id
    if (jobEmployerId !== employer.id) {
      res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Access denied' } })
      return
    }

    const { data, error } = await supabase
      .from('applications')
      .update({ status: req.body.status })
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) {
      res.status(500).json({ error: { code: 'DB_ERROR', message: 'Failed to update application' } })
      return
    }

    res.json({ data })
  } catch (err) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
  }
})

export default router
