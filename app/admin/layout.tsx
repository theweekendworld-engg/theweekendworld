import { auth } from '@/lib/auth'
import Link from 'next/link'
import AdminLayoutWrapper from '@/components/admin/AdminLayoutWrapper'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // If no session, let the wrapper component handle redirect based on pathname
  // The login page will be allowed through by the wrapper
  if (!session) {
    return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
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
              href="/admin/contact"
              className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              Contact Messages
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

