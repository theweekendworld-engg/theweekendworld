'use client'

import { useEffect, useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { extractRepoFromUrl } from '@/lib/github'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import ProductInterestForm from '@/components/products/ProductInterestForm'

interface Product {
  id: string
  slug: string
  name: string
  description: string
  shortDescription?: string
  featuredImage?: string | null
  gallery?: any
  videoUrl?: string | null
  githubUrl?: string | null
  liveUrl?: string | null
  features?: any
  tags?: string[]
  published: boolean
  testimonials?: any[]
}

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
        // Browser will automatically cache based on Cache-Control headers
        const res = await fetch(`${baseUrl}/api/products?published=true`, {
          cache: 'default', // Use browser's HTTP cache
        })
        if (!res.ok) {
          setError(true)
          setLoading(false)
          return
        }
        const products = await res.json()
        const foundProduct = products.find((p: Product) => p.slug === slug && p.published)
        
        if (!foundProduct) {
          setError(true)
          setLoading(false)
          return
        }

        setProduct(foundProduct)

        // Fetch GitHub stats if available
        if (foundProduct.githubUrl) {
          const repo = extractRepoFromUrl(foundProduct.githubUrl)
          if (repo) {
            try {
              const statsRes = await fetch(`${baseUrl}/api/github/stats/${repo.owner}/${repo.repo}`, {
                cache: 'default',
              })
              if (statsRes.ok) {
                const githubStats = await statsRes.json()
                setStats(githubStats)
              }
            } catch (err) {
              // GitHub stats are optional
            }
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchProduct()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="container px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    notFound()
  }

  const gallery = product.gallery && Array.isArray(product.gallery) ? product.gallery : []

  return (
    <div className="container px-4 py-16">
      <div className="mx-auto max-w-4xl">
        {/* Hero Section */}
        <div className="mb-12">
          {product.featuredImage && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-8">
              <Image
                src={product.featuredImage}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <h1 className="text-4xl font-bold tracking-tight">{product.name}</h1>
          {product.shortDescription && (
            <p className="mt-4 text-lg text-muted-foreground">{product.shortDescription}</p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {product.githubUrl && (
              <a
                href={product.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-muted"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                View on GitHub
                {stats && <span className="text-muted-foreground">({stats.stars} ⭐)</span>}
              </a>
            )}
            {product.liveUrl && (
              <a
                href={product.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Live Demo
              </a>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="prose prose-lg max-w-none mb-12">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{product.description}</ReactMarkdown>
        </div>

        {/* Features */}
        {product.features && Array.isArray(product.features) && product.features.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Features</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {product.features.map((feature: any, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span>{typeof feature === 'string' ? feature : feature.title || feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Video */}
        {product.videoUrl && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Video Demo</h2>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <iframe
                src={product.videoUrl}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Gallery */}
        {gallery.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Gallery</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery
                .filter((image: any) => typeof image === 'string')
                .map((image: string, index: number) => (
                  <div key={index} className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <Image
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Testimonials */}
        {product.testimonials && product.testimonials.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">What People Say</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {product.testimonials.map((testimonial: any) => (
                <div key={testimonial.id} className="rounded-lg border bg-card p-6">
                  <div className="flex items-center gap-4 mb-4">
                    {testimonial.avatar && (
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      {(testimonial.role || testimonial.company) && (
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                          {testimonial.role && testimonial.company && ' at '}
                          {testimonial.company}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{testimonial.content}</p>
                  {testimonial.rating && (
                    <div className="mt-4 flex gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <span key={i} className="text-yellow-500">★</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="mb-12 flex flex-wrap gap-2">
              {product.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Product Interest Form */}
          <div className="mt-16 pt-12 border-t border-border">
            <ProductInterestForm productId={product.id} productName={product.name} />
          </div>
        </div>
      </div>
    )
  }
