// client/src/pages/admin/BlogEditorPage.tsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Plus, Edit3, Trash2, ArrowLeft, FileText } from 'lucide-react'
import { getAdminBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '@/lib/api'
import type { BlogPost } from '@/types'

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// ── Blog post form ──
function PostForm({ post, onSave }: { post?: BlogPost; onSave: () => void }) {
  const [title, setTitle] = useState(post?.title ?? '')
  const [slug, setSlug] = useState(post?.slug ?? '')
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '')
  const [content, setContent] = useState(post?.content ?? '')
  const [tags, setTags] = useState(post?.tags.join(', ') ?? '')
  const [status, setStatus] = useState<'draft' | 'published'>(post?.status === 'published' ? 'published' : 'draft')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Auto-generate slug from title (only for new posts)
  useEffect(() => {
    if (!post) setSlug(slugify(title))
  }, [title, post])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const data = {
      title,
      slug,
      excerpt,
      content,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      status,
    }

    try {
      const res = post
        ? await updateBlogPost(post.id, data)
        : await createBlogPost(data)

      if (res.error) {
        setError(res.error.message)
        setSaving(false)
        return
      }
      onSave()
    } catch {
      setError('Failed to save post')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">{error}</div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Title *</label>
        <input type="text" required value={title} onChange={e => setTitle(e.target.value)}
          className="w-full px-3.5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm
                     bg-white dark:bg-navy-950 text-gray-800 dark:text-gray-200
                     focus:outline-none focus:ring-2 focus:ring-navy-500/30 focus:border-navy-500 transition"
          placeholder="Your post title" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Slug</label>
        <input type="text" required value={slug} onChange={e => setSlug(e.target.value)}
          className="w-full px-3.5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono
                     bg-white dark:bg-navy-950 text-gray-800 dark:text-gray-200
                     focus:outline-none focus:ring-2 focus:ring-navy-500/30 focus:border-navy-500 transition"
          placeholder="your-post-slug" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Excerpt</label>
        <textarea rows={2} value={excerpt} onChange={e => setExcerpt(e.target.value)}
          className="w-full px-3.5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm
                     bg-white dark:bg-navy-950 text-gray-800 dark:text-gray-200 resize-vertical
                     focus:outline-none focus:ring-2 focus:ring-navy-500/30 focus:border-navy-500 transition"
          placeholder="Brief summary for listing cards" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Content * (HTML)</label>
        <textarea rows={14} required value={content} onChange={e => setContent(e.target.value)}
          className="w-full px-3.5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono
                     bg-white dark:bg-navy-950 text-gray-800 dark:text-gray-200 resize-vertical
                     focus:outline-none focus:ring-2 focus:ring-navy-500/30 focus:border-navy-500 transition"
          placeholder="<h2>Introduction</h2><p>Write your post content in HTML...</p>" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Tags (comma-separated)</label>
        <input type="text" value={tags} onChange={e => setTags(e.target.value)}
          className="w-full px-3.5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm
                     bg-white dark:bg-navy-950 text-gray-800 dark:text-gray-200
                     focus:outline-none focus:ring-2 focus:ring-navy-500/30 focus:border-navy-500 transition"
          placeholder="IT Strategy, Cloud, Digital Transformation" />
      </div>

      <div className="flex items-center gap-4 pt-2">
        <select value={status} onChange={e => setStatus(e.target.value as 'draft' | 'published')}
          className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm
                     bg-white dark:bg-navy-950 text-gray-800 dark:text-gray-200">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <button type="submit" disabled={saving}
          className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-navy-800 text-white
                     hover:bg-navy-700 dark:bg-gold-400 dark:text-navy-950 dark:hover:bg-gold-300
                     disabled:opacity-60 transition-all">
          {saving ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
        </button>
      </div>
    </form>
  )
}

// ── Main page component ──
export default function BlogEditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPost, setEditingPost] = useState<BlogPost | undefined>()
  const [showForm, setShowForm] = useState(false)

  function fetchPosts() {
    setLoading(true)
    getAdminBlogPosts(1, 50).then(res => {
      setPosts(res.data ?? [])
      setLoading(false)
    })
  }

  useEffect(() => { fetchPosts() }, [])

  // If URL has an id param or "new", show form
  useEffect(() => {
    if (id === undefined && window.location.pathname.endsWith('/new')) {
      setShowForm(true)
      setEditingPost(undefined)
    } else if (id) {
      const found = posts.find(p => p.id === id)
      if (found) {
        setEditingPost(found)
        setShowForm(true)
      }
    }
  }, [id, posts])

  async function handleDelete(postId: string) {
    if (!confirm('Are you sure you want to delete this post?')) return
    await deleteBlogPost(postId)
    fetchPosts()
  }

  function handleSave() {
    setShowForm(false)
    setEditingPost(undefined)
    navigate('/admin/blog')
    fetchPosts()
  }

  if (showForm) {
    return (
      <div>
        <button onClick={() => { setShowForm(false); setEditingPost(undefined); navigate('/admin/blog') }}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-6 transition">
          <ArrowLeft size={14} /> Back to posts
        </button>
        <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 max-w-3xl">
          <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-6">
            {editingPost ? 'Edit Post' : 'New Post'}
          </h2>
          <PostForm post={editingPost} onSave={handleSave} />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Blog Posts</h1>
        <Link
          to="/admin/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold
                     bg-navy-800 text-white hover:bg-navy-700 dark:bg-gold-400 dark:text-navy-950 transition"
        >
          <Plus size={16} /> New Post
        </Link>
      </div>

      <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-6 h-6 border-4 border-navy-500 border-t-transparent rounded-full" />
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <FileText size={40} className="mx-auto mb-3 opacity-40" />
            No blog posts yet. Create your first one!
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-navy-900/50">
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Title</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Updated</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-navy-700/50 transition">
                  <td className="px-5 py-3">
                    <div className="font-medium text-navy-900 dark:text-white">{post.title}</div>
                    <div className="text-xs text-gray-400 font-mono">/{post.slug}</div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full
                      ${post.status === 'published' ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                        post.status === 'draft' ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs">
                    {new Date(post.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditingPost(post); setShowForm(true) }}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-700 text-gray-500 hover:text-navy-700 dark:hover:text-gray-300 transition"
                        title="Edit"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
