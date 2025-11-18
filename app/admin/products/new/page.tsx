'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewProductPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    slug: '',
    name: '',
    description: '',
    shortDescription: '',
    featuredImage: '',
    videoUrl: '',
    githubUrl: '',
    liveUrl: '',
    tags: '',
    published: false,
    featured: false,
    order: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      // Parse tags from comma-separated string
      const tags = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags,
          gallery: null,
          features: null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create product')
      }

      const product = await response.json()
      router.push(`/admin/products/${product.id}`)
    } catch (err: any) {
      setError(err.message || 'Failed to create product')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
        >
          ← Back to Products
        </Link>
        <h1 className="text-3xl font-bold">New Product</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-800 dark:text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="slug" className="block text-sm font-medium mb-2">
              Slug <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="slug"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-4 py-2"
              placeholder="my-product-slug"
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-4 py-2"
            />
          </div>
        </div>

        <div>
          <label htmlFor="shortDescription" className="block text-sm font-medium mb-2">
            Short Description
          </label>
          <input
            type="text"
            id="shortDescription"
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            className="w-full rounded-md border border-border bg-background px-4 py-2"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description <span className="text-destructive">*</span>
          </label>
          <textarea
            id="description"
            required
            rows={10}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-md border border-border bg-background px-4 py-2 font-mono text-sm"
            placeholder="Markdown supported"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="featuredImage" className="block text-sm font-medium mb-2">
              Featured Image URL
            </label>
            <input
              type="url"
              id="featuredImage"
              value={formData.featuredImage}
              onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-4 py-2"
            />
          </div>

          <div>
            <label htmlFor="videoUrl" className="block text-sm font-medium mb-2">
              Video URL
            </label>
            <input
              type="url"
              id="videoUrl"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-4 py-2"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="githubUrl" className="block text-sm font-medium mb-2">
              GitHub URL
            </label>
            <input
              type="url"
              id="githubUrl"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-4 py-2"
            />
          </div>

          <div>
            <label htmlFor="liveUrl" className="block text-sm font-medium mb-2">
              Live Demo URL
            </label>
            <input
              type="url"
              id="liveUrl"
              value={formData.liveUrl}
              onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-4 py-2"
            />
          </div>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full rounded-md border border-border bg-background px-4 py-2"
            placeholder="React, TypeScript, Next.js"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="order" className="block text-sm font-medium mb-2">
              Order
            </label>
            <input
              type="number"
              id="order"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              className="w-full rounded-md border border-border bg-background px-4 py-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="rounded border-border"
            />
            <label htmlFor="published" className="text-sm font-medium">
              Published
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="rounded border-border"
            />
            <label htmlFor="featured" className="text-sm font-medium">
              Featured
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Product'}
          </button>
          <Link
            href="/admin/products"
            className="rounded-md border border-border px-6 py-2 text-sm font-semibold hover:bg-muted"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

