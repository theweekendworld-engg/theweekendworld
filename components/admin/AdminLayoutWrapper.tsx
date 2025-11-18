'use client'

import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'

export default function AdminLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    // Redirect to login if not on login page
    if (!isLoginPage) {
      const loginUrl = `/admin/login?callbackUrl=${encodeURIComponent(pathname)}`
      router.replace(loginUrl)
    }
  }, [pathname, isLoginPage, router])

  // Only render login page, otherwise redirect happens above
  if (isLoginPage) {
    return <>{children}</>
  }

  // Show nothing while redirecting
  return null
}

