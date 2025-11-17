import Link from 'next/link'
import Image from 'next/image'
import { getGitHubRepoStats, extractRepoFromUrl } from '@/lib/github'
import { getProducts } from '@/lib/data/products'

async function fetchProducts() {
  try {
    return await getProducts({ published: true })
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

async function getProductStats(githubUrl: string | null) {
  if (!githubUrl) return null
  const repo = extractRepoFromUrl(githubUrl)
  if (!repo) return null
  return getGitHubRepoStats(repo.owner, repo.repo, process.env.GITHUB_TOKEN)
}

export const metadata = {
  title: 'Products - TheWeekendWorld',
  description: 'Explore our collection of innovative products and solutions',
}

export default async function ProductsPage() {
  const products = await fetchProducts()

  return (
    <div className="flex flex-col">
      <section className="border-b bg-gradient-to-b from-muted/50 via-background to-background">
        <div className="container px-4 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Our Products
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              Discover innovative solutions built with passion and expertise
            </p>
          </div>
        </div>
      </section>

      {products.length === 0 ? (
        <div className="container px-4 py-24 text-center">
          <p className="text-muted-foreground text-lg">No products available yet.</p>
        </div>
      ) : (
        <section className="container px-4 py-24">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map(async (product: any) => {
              const stats = await getProductStats(product.githubUrl)
              return (
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
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xl font-bold tracking-tight group-hover:text-foreground/80 transition-colors flex-1">
                        {product.name}
                      </h3>
                      {stats && (
                        <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground whitespace-nowrap">
                          <span>⭐</span>
                          <span>{stats.stars}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
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
                    View product
                    <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}

