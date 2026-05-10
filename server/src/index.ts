// server/src/index.ts
import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

import contactRoutes from './routes/contact.js'
import blogRoutes from './routes/blog.js'
import adminRoutes from './routes/admin.js'
import jobsRoutes from './routes/jobs.js'
import applicationsRoutes from './routes/applications.js'
import employersRoutes from './routes/employers.js'
import jobAlertsRoutes from './routes/jobAlerts.js'
import internalRoutes from './routes/internal.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

// ── Middleware ──
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}))
app.use(express.json({ limit: '1mb' }))

// Rate limiting for public endpoints
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: 'RATE_LIMITED', message: 'Too many requests, please try again later' } },
})

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 contact form submissions per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: 'RATE_LIMITED', message: 'Too many submissions. Please try again later.' } },
})

// ── Routes ──
app.post('/api/contacts', contactLimiter) // rate-limit public form submission only
app.use('/api/contacts', contactRoutes)
app.use('/api/blog', publicLimiter, blogRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/jobs', publicLimiter, jobsRoutes)
app.use('/api/applications', applicationsRoutes)
app.use('/api/employers', employersRoutes)
app.use('/api/job-alerts', jobAlertsRoutes)
app.use('/api/internal', internalRoutes)

// ── Health check ──
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── 404 handler ──
app.use((_req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } })
})

// ── Global error handler ──
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
})

// ── Start ──
app.listen(PORT, () => {
  console.log(`✓ JTLD API server running on http://localhost:${PORT}`)
  console.log(`✓ CORS enabled for ${CLIENT_URL}`)
})

export default app
