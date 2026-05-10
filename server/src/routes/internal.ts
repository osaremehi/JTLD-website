// server/src/routes/internal.ts
// Internal-only endpoints called by Next.js cron jobs. Protected by CRON_SECRET header.
import { Router } from 'express'
import { sendJobAlertEmail } from '../lib/email.js'

const router = Router()

function verifyCronSecret(req: any, res: any, next: any) {
  const secret = process.env.CRON_SECRET
  if (secret && req.headers['x-cron-secret'] !== secret) {
    res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid cron secret' } })
    return
  }
  next()
}

// ── POST /api/internal/send-job-alert-email ──
router.post('/send-job-alert-email', verifyCronSecret, async (req, res) => {
  try {
    const { candidateName, candidateEmail, jobs } = req.body
    if (!candidateEmail || !Array.isArray(jobs)) {
      res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'candidateEmail and jobs are required' } })
      return
    }

    await sendJobAlertEmail({ candidateName: candidateName ?? 'Candidate', candidateEmail, jobs })
    res.json({ success: true })
  } catch (err) {
    console.error('Internal send-job-alert-email error:', err)
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to send email' } })
  }
})

export default router
