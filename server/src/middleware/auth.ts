// server/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express'
import { supabase } from '../lib/supabase.js'

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string; role: string }
      candidate?: { id: string; user_id: string; full_name: string; email: string }
      employer?: { id: string; user_id: string; company_name: string }
    }
  }
}

/**
 * Middleware: require a valid Supabase access token in the Authorization header.
 * Attaches `req.user` on success.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token' } })
    return
  }

  const token = header.slice(7)

  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) {
    res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } })
    return
  }

  // Look up admin profile for role
  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  req.user = {
    id: data.user.id,
    email: data.user.email ?? '',
    role: profile?.role ?? 'user',
  }

  next()
}

/**
 * Middleware: require admin or super_admin role.
 * Must be used after requireAuth.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user || !['admin', 'super_admin'].includes(req.user.role)) {
    res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Admin access required' } })
    return
  }
  next()
}

/**
 * Middleware: require a candidate profile linked to the authenticated user.
 * Attaches `req.candidate` on success. Must be used after requireAuth.
 */
export async function requireCandidate(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } })
    return
  }

  const { data: candidate } = await supabase
    .from('candidates')
    .select('id, user_id, full_name, email')
    .eq('user_id', req.user.id)
    .single()

  if (!candidate) {
    res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Candidate profile required' } })
    return
  }

  req.candidate = candidate
  next()
}

/**
 * Middleware: require an employer profile linked to the authenticated user.
 * Attaches `req.employer` on success. Must be used after requireAuth.
 */
export async function requireEmployer(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } })
    return
  }

  const { data: employer } = await supabase
    .from('employers')
    .select('id, user_id, company_name')
    .eq('user_id', req.user.id)
    .single()

  if (!employer) {
    res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Employer profile required' } })
    return
  }

  req.employer = employer
  next()
}
