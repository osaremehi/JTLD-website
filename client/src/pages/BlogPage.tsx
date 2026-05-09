// client/src/pages/BlogPage.tsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, ArrowRight, Tag } from 'lucide-react'
import { getBlogPosts } from '@/lib/api'
import type { BlogPost, Pagination } from '@/types'

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    getBlogPosts(page, 9).then(res => {
      setPosts(res.data ?? [])
      setPagination(res.pagination ?? null)
      setLoading(false)
    })
  }, [page])

  return (
    <main className="pt-[100px]">
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-navy-950 to-navy-800 text-white text-center">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="section-eyebrow !text-gold-300">Insights</div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 font-serif !text-white">Blog &amp; Resources</h1>
          <p className="text-blue-200 max-w-xl mx-auto">
            Perspectives on IT strategy, project delivery, and digital transformation
            from the JTLD consulting team.
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-8 h-8 border-4 border-navy-500 border-t-transparent rounded-full" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map(post => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="group bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700
                               rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all"
                  >
                    {post.cover_image && (
                      <div className="aspect-video bg-gray-100 dark:bg-navy-700 overflow-hidden">
                        <img src={post.cover_image} alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-6">
                      {post.tags.length > 0 && (
                        <div className="flex items-center gap-2 mb-3">
                          <Tag size={12} className="text-gold-500" />
                          <span className="text-xs font-medium text-gold-500">{post.tags[0]}</span>
                        </div>
                      )}
                      <h2 className="text-lg font-bold text-navy-900 dark:text-white mb-2 group-hover:text-navy-600 dark:group-hover:text-gold-400 transition-colors">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4">{post.excerpt}</p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} />
                          {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric'
                          }) : ''}
                        </div>
                        <span className="flex items-center gap-1 text-navy-600 dark:text-gold-400 font-medium group-hover:gap-2 transition-all">
                          Read <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-12">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium
                               disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-navy-800 transition"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-500">
                    Page {page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium
                               disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-navy-800 transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  )
}
