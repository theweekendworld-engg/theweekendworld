import Link from 'next/link'
import Image from 'next/image'
import { getProducts } from '@/lib/data/products'
import { getBlogPosts } from '@/lib/data/blog'
import WeekendCountdown from '@/components/weekend/WeekendCountdown'
import { getVibeRecommendations } from '@/lib/data/weekend'
import WeekendVibeClient from '@/components/weekend/WeekendVibeClient'
import WeeklyPicks from '@/components/weekend/WeeklyPicks'
import CommunityStories from '@/components/weekend/CommunityStories'

// Force dynamic rendering - always fetch fresh data from DB
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getFeaturedProducts() {
  try {
    return await getProducts({ published: true, featured: true })
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return []
  }
}

async function getRecentBlogPosts() {
  try {
    const posts = await getBlogPosts({ published: true })
    return posts.slice(0, 3)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()
  const recentPosts = await getRecentBlogPosts()
  const vibeRecommendations = await getVibeRecommendations()

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b min-h-[calc(100vh-4rem)] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-background" />
        <div className="container relative px-4 py-12 md:py-16">
          <div className="mx-auto max-w-4xl text-center">
            {/* Weekend Countdown Timer */}
            <WeekendCountdown />
            
            <div className="mb-8 inline-flex items-center rounded-full border border-border bg-muted/50 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              <span className="mr-2 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Building the future, one weekend at a time
            </div>
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                Welcome to{' '}
              </span>
              <span className="animate-gradient animate-light-dark bg-clip-text text-transparent inline-block">
                TheWeekendWorld
              </span>
            </h1>
            <p className="mt-8 text-lg leading-8 text-muted-foreground sm:text-xl max-w-2xl mx-auto">
              Building amazing products, sharing knowledge, and creating innovative solutions.
              Explore our products, read our blog, and join us on this journey.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/products"
                className="group relative inline-flex items-center justify-center rounded-lg bg-foreground px-8 py-3.5 text-sm font-semibold text-background shadow-lg shadow-foreground/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-foreground/30"
              >
                View Products
                <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-8 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-muted hover:border-foreground/20"
              >
                Read Blog
                <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Vibe Selector Section */}
      <section id="weekend-countdown" className="scroll-mt-20 relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-yellow-50/30 to-teal-50/50 dark:from-orange-950/10 dark:via-yellow-950/5 dark:to-teal-950/10" />
        <div className="container relative px-4 py-16 md:py-20">
          <div className="mx-auto max-w-4xl">
            <p className="text-center text-sm font-medium text-muted-foreground mb-6">
              Choose your weekend vibe
            </p>
            <WeekendVibeClient vibeRecommendations={vibeRecommendations} />
          </div>
        </div>
      </section>

      {/* Weekly Picks */}
      <section id="weekly-picks" className="scroll-mt-20">
        <WeeklyPicks />
      </section>

      {/* Community Stories */}
      <section id="community-stories" className="scroll-mt-20">
        <CommunityStories />
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section id="featured-products" className="scroll-mt-20 container px-4 py-24">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Products</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Check out our latest and greatest products
            </p>
          </div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product: any) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-xl hover:shadow-foreground/5 hover:-translate-y-1"
              >
                {product.featuredImage && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-4 bg-muted">
                    <Image
                      src={product.featuredImage}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold tracking-tight group-hover:text-foreground/80 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {product.shortDescription || product.description}
                  </p>
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {product.tags.slice(0, 3).map((tag: string) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-md border border-border bg-muted/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  Learn more
                  <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-16 text-center">
            <Link
              href="/products"
              className="inline-flex items-center text-sm font-semibold text-foreground hover:text-foreground/80 transition-colors"
            >
              View all products
              <span className="ml-2 transition-transform hover:translate-x-1">→</span>
            </Link>
          </div>
        </section>
      )}

      {/* Recent Blog Posts */}
      {recentPosts.length > 0 && (
        <section id="blog" className="scroll-mt-20 border-t bg-muted/30">
          <div className="container px-4 py-24">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Latest from Blog</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Stay updated with our latest articles and tutorials
              </p>
            </div>
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post: any) => (
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
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center text-xs text-muted-foreground pt-2">
                      <time dateTime={post.createdAt instanceof Date ? post.createdAt.toISOString() : new Date(post.createdAt).toISOString()}>
                        {(post.createdAt instanceof Date ? post.createdAt : new Date(post.createdAt)).toLocaleDateString('en-US', {
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
            <div className="mt-16 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center text-sm font-semibold text-foreground hover:text-foreground/80 transition-colors"
              >
                Read all posts
                <span className="ml-2 transition-transform hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

