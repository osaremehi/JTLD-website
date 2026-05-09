// client/src/pages/BlogPostPage.tsx
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, User } from 'lucide-react'
import { getBlogPost } from '@/lib/api'
import type { BlogPost } from '@/types'

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    getBlogPost(slug).then(res => {
      if (res.error) {
        setNotFound(true)
      } else {
        setPost(res.data ?? null)
      }
      setLoading(false)
    })
  }, [slug])

  if (loading) {
    return (
      <main className="pt-[100px] min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-navy-500 border-t-transparent rounded-full" />
      </main>
    )
  }

  if (notFound || !post) {
    return (
      <main className="pt-[100px] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-navy-900 dark:text-white mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-navy-600 dark:text-gold-400 hover:underline flex items-center gap-2 justify-center">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="pt-[100px]">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-navy-950 to-navy-800 text-white">
        <div className="max-w-3xl mx-auto px-6">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-blue-300 hover:text-white mb-6 transition">
            <ArrowLeft size={14} /> Back to Blog
          </Link>
          {post.tags.length > 0 && (
            <div className="flex gap-2 mb-4">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full bg-gold-400/20 text-gold-300">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-extrabold font-serif mb-6">{post.title}</h1>
          <div className="flex items-center gap-6 text-sm text-blue-300">
            <span className="flex items-center gap-1.5">
              <User size={14} /> {post.author_name}
            </span>
            {post.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {new Date(post.published_at).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="py-16">
        <div className="max-w-3xl mx-auto px-6 prose prose-lg dark:prose-invert
                        prose-headings:font-bold prose-headings:text-navy-900 dark:prose-headings:text-white
                        prose-a:text-navy-600 dark:prose-a:text-gold-400">
          {/* Render content as HTML — in production, use a markdown renderer */}
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </article>
    </main>
  )
}
