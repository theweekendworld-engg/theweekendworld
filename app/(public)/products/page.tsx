import Link from 'next/link'
import Image from 'next/image'
import { getGitHubRepoStats, extractRepoFromUrl } from '@/lib/github'

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products?published=true`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    return res.json()
  } catch {
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
  const products = await getProducts()

  return (
    <div className="container px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">Our Products</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Discover innovative solutions built with passion and expertise
        </p>
      </div>

      {products.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">No products available yet.</p>
        </div>
      ) : (
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {products.map(async (product: any) => {
            const stats = await getProductStats(product.githubUrl)
            return (
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
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                  {product.shortDescription || product.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {product.tags.slice(0, 2).map((tag: string) => (
                        <span
                          key={tag}
                          className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {stats && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span>⭐</span>
                      <span>{stats.stars}</span>
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

