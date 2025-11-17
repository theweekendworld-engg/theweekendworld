import Link from 'next/link'
import Image from 'next/image'
import { getBlogPosts } from '@/lib/data/blog'

async function fetchBlogPosts() {
  try {
    return await getBlogPosts({ published: true })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export const metadata = {
  title: 'Blog - TheWeekendWorld',
  description: 'Read our latest articles on coding, system design, and technology',
}

export default async function BlogPage() {
  const posts = await fetchBlogPosts()

  return (
    <div className="flex flex-col">
      <section className="border-b bg-gradient-to-b from-muted/50 via-background to-background">
        <div className="container px-4 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Blog</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              Insights, tutorials, and thoughts on technology
            </p>
          </div>
        </div>
      </section>

      {posts.length === 0 ? (
        <div className="container px-4 py-24 text-center">
          <p className="text-muted-foreground text-lg">No blog posts available yet.</p>
        </div>
      ) : (
        <section className="container px-4 py-24">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: any) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-border bg-background p-6 shadow-sm transition-all hover:shadow-xl hover:shadow-foreground/5 hover:-translate-y-1"
              >
                {post.coverImage && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-4 bg-muted">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
                <div className="space-y-3">
                  {post.category && (
                    <span className="inline-flex items-center rounded-md border border-border bg-muted/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {post.category}
                    </span>
                  )}
                  <h3 className="text-xl font-bold tracking-tight group-hover:text-foreground/80 transition-colors">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2">
                    <time dateTime={post.createdAt}>
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                    {post.tags && post.tags.length > 0 && (
                      <>
                        <span>•</span>
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map((tag: string) => (
                            <span
                              key={tag}
                              className="inline-flex items-center rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  Read article
                  <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

