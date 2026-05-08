// server/src/routes/blog.ts
import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { BlogPostSchema, PaginationSchema } from '../types/index.js'
import { validate } from '../middleware/validate.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = Router()

// ── GET /api/blog — public: list published posts ──
router.get('/', async (req, res) => {
  try {
    const { page, limit } = PaginationSchema.parse(req.query)
    const offset = (page - 1) * limit

    const { count } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')

    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, cover_image, author_name, tags, published_at, created_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
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
    console.error('Blog list error:', err)
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
  }
})

// ── GET /api/blog/:slug — public: get single post by slug ──
router.get('/:slug', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', req.params.slug)
      .eq('status', 'published')
      .single()

    if (error || !data) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Post not found' } })
      return
    }

    res.json({ data })
  } catch (err) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
  }
})

// ── POST /api/blog — admin: create post ──
router.post('/', requireAuth, requireAdmin, validate(BlogPostSchema), async (req, res) => {
  try {
    const postData = {
      ...req.body,
      author_id: req.user!.id,
      published_at: req.body.status === 'published' ? new Date().toISOString() : null,
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .insert(postData)
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        res.status(409).json({ error: { code: 'CONFLICT', message: 'A post with this slug already exists' } })
        return
      }
      console.error('Blog create error:', error)
      res.status(500).json({ error: { code: 'DB_ERROR', message: 'Failed to create post' } })
      return
    }

    res.status(201).json({ data })
  } catch (err) {
    console.error('Blog create error:', err)
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
  }
})

// ── PATCH /api/blog/:id — admin: update post ──
router.patch('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const updates = BlogPostSchema.partial().parse(req.body)

    // If publishing for the first time, set published_at
    if (updates.status === 'published') {
      const { data: existing } = await supabase
        .from('blog_posts')
        .select('published_at')
        .eq('id', req.params.id)
        .single()

      if (!existing?.published_at) {
        Object.assign(updates, { published_at: new Date().toISOString() })
      }
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single()

    if (error || !data) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Post not found' } })
      return
    }

    res.json({ data })
  } catch (err) {
    console.error('Blog update error:', err)
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
  }
})

// ── DELETE /api/blog/:id — admin: delete post ──
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', req.params.id)

    if (error) {
      res.status(500).json({ error: { code: 'DB_ERROR', message: 'Failed to delete post' } })
      return
    }

    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
  }
})

export default router
