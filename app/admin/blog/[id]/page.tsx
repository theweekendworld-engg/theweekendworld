'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function EditBlogPostPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    author: 'TheWeekendWorld',
    category: '',
    tags: '',
    published: false,
    featured: false,
  })

  useEffect(() => {
    async function fetchPost() {
      try {
        // The API route accepts both ID and slug
        const response = await fetch(`/api/blog/${id}`)
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/admin/blog')
            return
          }
          throw new Error('Failed to fetch blog post')
        }
        const post = await response.json()
        setFormData({
          slug: post.slug || '',
          title: post.title || '',
          excerpt: post.excerpt || '',
          content: post.content || '',
          coverImage: post.coverImage || '',
          author: post.author || 'TheWeekendWorld',
          category: post.category || '',
          tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
          published: post.published || false,
          featured: post.featured || false,
        })
      } catch (err: any) {
        setError(err.message || 'Failed to load blog post')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchPost()
    }
  }, [id, router])

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

      const response = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags,
          category: formData.category || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update blog post')
      }

      router.push('/admin/blog')
    } catch (err: any) {
      setError(err.message || 'Failed to update blog post')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete blog post')
      }

      router.push('/admin/blog')
    } catch (err: any) {
      setError(err.message || 'Failed to delete blog post')
    }
  }

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <Link
            href="/admin/blog"
            className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
          >
            ← Back to Blog Posts
          </Link>
          <h1 className="text-3xl font-bold">Edit Blog Post</h1>
        </div>
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/blog"
          className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
        >
          ← Back to Blog Posts
        </Link>
        <h1 className="text-3xl font-bold">Edit Blog Post</h1>
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
              placeholder="my-blog-post-slug"
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium mb-2">
              Author
            </label>
            <input
              type="text"
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-4 py-2"
            />
          </div>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full rounded-md border border-border bg-background px-4 py-2"
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            rows={3}
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full rounded-md border border-border bg-background px-4 py-2"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            Content <span className="text-destructive">*</span>
          </label>
          <textarea
            id="content"
            required
            rows={20}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full rounded-md border border-border bg-background px-4 py-2 font-mono text-sm"
            placeholder="Markdown supported"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="coverImage" className="block text-sm font-medium mb-2">
              Cover Image URL
            </label>
            <input
              type="url"
              id="coverImage"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-4 py-2"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              Category
            </label>
            <input
              type="text"
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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

        <div className="flex gap-6">
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
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-md border border-red-200 bg-red-50 dark:bg-red-900/20 px-6 py-2 text-sm font-semibold text-red-800 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-900/30"
          >
            Delete
          </button>
          <Link
            href="/admin/blog"
            className="rounded-md border border-border px-6 py-2 text-sm font-semibold hover:bg-muted"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

