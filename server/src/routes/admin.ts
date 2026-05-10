// server/src/routes/admin.ts
import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'
import { PaginationSchema } from '../types/index.js'

const router = Router()

// All admin routes require authentication
router.use(requireAuth)

// ── GET /api/admin/dashboard — dashboard summary stats ──
router.get('/dashboard', async (_req, res) => {
  try {
    // Contact submissions counts by status
    const { count: totalInquiries } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true })

    const { count: newInquiries } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new')

    // Blog post counts
    const { count: totalPosts } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })

    const { count: publishedPosts } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')

    // Job counts
    const { count: totalJobs } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })

    const { count: activeJobs } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    // Application counts
    const { count: totalApplications } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })

    const { count: pendingApplications } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    // Page views in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const { count: recentViews } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo)

    // Recent submissions (last 5)
    const { data: recentSubmissions } = await supabase
      .from('contact_submissions')
      .select('id, first_name, last_name, email, service, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    res.json({
      data: {
        stats: {
          totalInquiries: totalInquiries ?? 0,
          newInquiries: newInquiries ?? 0,
          totalPosts: totalPosts ?? 0,
          publishedPosts: publishedPosts ?? 0,
          pageViews30d: recentViews ?? 0,
          totalJobs: totalJobs ?? 0,
          activeJobs: activeJobs ?? 0,
          totalApplications: totalApplications ?? 0,
          pendingApplications: pendingApplications ?? 0,
        },
        recentSubmissions: recentSubmissions ?? [],
      },
    })
  } catch (err) {
    console.error('Dashboard error:', err)
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
  }
})

// ── GET /api/admin/blog — list ALL posts (drafts + published + archived) ──
router.get('/blog', async (req, res) => {
  try {
    const { page, limit } = PaginationSchema.parse(req.query)
    const offset = (page - 1) * limit

    const { count } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      res.status(500).json({ error: { code: 'DB_ERROR', message: 'Failed to fetch posts' } })
      return
    }

    const total = count ?? 0
    res.json({
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (err) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
  }
})

// ── GET /api/admin/analytics — page view stats ──
router.get('/analytics', async (req, res) => {
  try {
    const days = Number(req.query.days) || 30
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

    // Top pages
    const { data: topPages } = await supabase
      .from('page_views')
      .select('page_path')
      .gte('created_at', since)

    // Aggregate page counts
    const pageCounts: Record<string, number> = {}
    topPages?.forEach(pv => {
      pageCounts[pv.page_path] = (pageCounts[pv.page_path] || 0) + 1
    })

    const topPagesArray = Object.entries(pageCounts)
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    res.json({
      data: {
        period: `${days} days`,
        totalViews: topPages?.length ?? 0,
        topPages: topPagesArray,
      },
    })
  } catch (err) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
  }
})

export default router
