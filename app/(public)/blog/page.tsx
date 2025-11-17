import Link from 'next/link'
import Image from 'next/image'

async function getBlogPosts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/blog?published=true`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export const metadata = {
  title: 'Blog - TheWeekendWorld',
  description: 'Read our latest articles on coding, system design, and technology',
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="container px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Insights, tutorials, and thoughts on technology
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">No blog posts available yet.</p>
        </div>
      ) : (
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post: any) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              {post.coverImage && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-4">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              )}
              {post.category && (
                <span className="text-xs font-semibold text-primary">{post.category}</span>
              )}
              <h3 className="mt-2 text-xl font-semibold">{post.title}</h3>
              {post.excerpt && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
              )}
              <div className="mt-4 flex items-center text-xs text-muted-foreground">
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                {post.tags && post.tags.length > 0 && (
                  <>
                    <span className="mx-2">•</span>
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="rounded-full bg-muted px-2 py-0.5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

