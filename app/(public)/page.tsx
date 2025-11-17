import Link from 'next/link'
import Image from 'next/image'

async function getFeaturedProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products?featured=true&published=true`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

async function getRecentBlogPosts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/blog?published=true`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    const posts = await res.json()
    return posts.slice(0, 3)
  } catch {
    return []
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()
  const recentPosts = await getRecentBlogPosts()

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container px-4 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Welcome to{' '}
            <span className="text-primary">TheWeekendWorld</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Building amazing products, sharing knowledge, and creating innovative solutions.
            Explore our products, read our blog, and join us on this journey.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/products"
              className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              View Products
            </Link>
            <Link
              href="/blog"
              className="text-sm font-semibold leading-6 text-foreground"
            >
              Read Blog <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="container px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Check out our latest and greatest products
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {featuredProducts.map((product: any) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                {product.featuredImage && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-4">
                    <Image
                      src={product.featuredImage}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {product.shortDescription || product.description}
                </p>
                {product.tags && product.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.tags.slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="text-sm font-semibold text-primary hover:underline"
            >
              View all products <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      )}

      {/* Recent Blog Posts */}
      {recentPosts.length > 0 && (
        <section className="container px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Latest from Blog</h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Stay updated with our latest articles and tutorials
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {recentPosts.map((post: any) => (
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
                <h3 className="text-xl font-semibold">{post.title}</h3>
                {post.excerpt && (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
                <div className="mt-4 flex items-center text-xs text-muted-foreground">
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  {post.category && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{post.category}</span>
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Read all posts <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}

