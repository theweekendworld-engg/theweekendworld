import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card">
          <div className="p-6">
            <h2 className="text-xl font-bold">Admin Panel</h2>
          </div>
          <nav className="space-y-1 px-4">
            <Link
              href="/admin"
              className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              Products
            </Link>
            <Link
              href="/admin/blog"
              className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              Blog Posts
            </Link>
            <Link
              href="/admin/settings"
              className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              Settings
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}

