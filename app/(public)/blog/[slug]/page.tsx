import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getBlogPostBySlug, getBlogPosts } from '@/lib/data/blog'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import BlogLikes from '@/components/blog/BlogLikes'
import BlogComments from '@/components/blog/BlogComments'

// Force dynamic rendering - always fetch fresh data from DB
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  
  // Fetch directly from database - no API route, no caching
  const post = await getBlogPostBySlug(slug)

  if (!post || !post.published) {
    notFound()
  }

  // Fetch related posts (same category, excluding current post)
  let relatedPosts: typeof post[] = []
  if (post.category) {
    const allPosts = await getBlogPosts({ 
      published: true, 
      category: post.category 
    })
    relatedPosts = allPosts
      .filter((p:any) => p.slug !== slug)
      .slice(0, 3)
  }

  // Calculate reading time (average 200 words per minute)
  const wordsPerMinute = 200
  const wordCount = post.content.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / wordsPerMinute)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container px-4 py-8 md:py-12">
        <article className="mx-auto max-w-4xl">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            <span>Back to Blog</span>
          </Link>

          {/* Header */}
          <header className="mb-12">
            <div className="space-y-4">
              {post.category && (
                <Link
                  href={`/blog?category=${post.category}`}
                  className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
                >
                  {post.category}
                </Link>
              )}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl">
                  {post.excerpt}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">
                      {post.author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium text-foreground">{post.author}</span>
                </div>
                <span>•</span>
                <time dateTime={post.createdAt instanceof Date ? post.createdAt.toISOString() : new Date(post.createdAt).toISOString()} className="font-medium">
                  {(post.createdAt instanceof Date ? post.createdAt : new Date(post.createdAt)).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <span>•</span>
                <span>{readingTime} min read</span>
              </div>
            </div>
          </header>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl mb-12 shadow-2xl border border-border/50">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none mb-12 
            prose-headings:font-bold prose-headings:tracking-tight
            prose-h1:text-4xl prose-h1:mt-12 prose-h1:mb-6
            prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-5
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:leading-relaxed prose-p:text-foreground/90
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground prose-strong:font-semibold
            prose-code:text-sm prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-muted prose-pre:border prose-pre:border-border
            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic
            prose-ul:list-disc prose-ol:list-decimal
            prose-li:my-2
            prose-img:rounded-lg prose-img:shadow-lg
            prose-hr:border-border">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>

          {/* Likes - Client Component for interactivity */}
          <div className="mb-12 flex items-center justify-center">
            <BlogLikes slug={slug} />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-16 pt-8 border-t border-border">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${tag}`}
                    className="inline-flex items-center rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm font-medium text-foreground hover:bg-muted hover:border-foreground/20 transition-all"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Comments - Client Component for interactivity */}
          <BlogComments slug={slug} />

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-12 border-t border-border">
              <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight mb-2">Related Posts</h2>
                <p className="text-muted-foreground">Continue reading with these related articles</p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-xl hover:shadow-foreground/5 hover:-translate-y-1"
                  >
                    {relatedPost.coverImage && (
                      <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-4 bg-muted">
                        <Image
                          src={relatedPost.coverImage}
                          alt={relatedPost.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                    <div className="space-y-3">
                      {relatedPost.category && (
                        <span className="inline-flex items-center rounded-md border border-border bg-muted/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                          {relatedPost.category}
                        </span>
                      )}
                      <h3 className="text-lg font-bold tracking-tight group-hover:text-foreground/80 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      {relatedPost.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {relatedPost.excerpt}
                        </p>
                      )}
                      <div className="flex items-center text-xs text-muted-foreground pt-2">
                        <time dateTime={relatedPost.createdAt instanceof Date ? relatedPost.createdAt.toISOString() : new Date(relatedPost.createdAt).toISOString()}>
                          {(relatedPost.createdAt instanceof Date ? relatedPost.createdAt : new Date(relatedPost.createdAt)).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </time>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      Read article
                      <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  )
}
