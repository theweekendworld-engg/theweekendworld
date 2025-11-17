import { prisma } from '@/lib/db'
import Link from 'next/link'

async function getStats() {
  const [products, blogPosts, contactSubmissions] = await Promise.all([
    prisma.product.count(),
    prisma.blogPost.count(),
    prisma.contactSubmission.count({ where: { read: false } }),
  ])

  return {
    products,
    blogPosts,
    unreadContacts: contactSubmissions,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Welcome to the admin panel</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Products</h3>
          <p className="mt-2 text-3xl font-bold">{stats.products}</p>
          <Link
            href="/admin/products"
            className="mt-4 text-sm text-primary hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Blog Posts</h3>
          <p className="mt-2 text-3xl font-bold">{stats.blogPosts}</p>
          <Link
            href="/admin/blog"
            className="mt-4 text-sm text-primary hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Unread Messages</h3>
          <p className="mt-2 text-3xl font-bold">{stats.unreadContacts}</p>
          <Link
            href="/admin/contact"
            className="mt-4 text-sm text-primary hover:underline"
          >
            View all →
          </Link>
        </div>
      </div>
    </div>
  )
}

