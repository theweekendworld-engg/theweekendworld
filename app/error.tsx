'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-8 inline-flex items-center rounded-full border border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/30 px-4 py-1.5 text-xs font-medium text-orange-700 dark:text-orange-300">
          <span className="mr-2 h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
          Coming Soon
        </div>
        
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight mb-6">
          <span className="bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
            Oops!
          </span>
        </h1>
        
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4 text-foreground">
          Something went wrong
        </h2>
        
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          We encountered an unexpected error. Don&apos;t worry, we&apos;re working on it! 
          This page might be coming soon or experiencing temporary issues.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="group relative inline-flex items-center justify-center rounded-lg bg-foreground px-8 py-3.5 text-sm font-semibold text-background shadow-lg shadow-foreground/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-foreground/30"
          >
            Try Again
            <span className="ml-2 transition-transform group-hover:translate-x-1">↻</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-8 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-muted hover:border-foreground/20"
          >
            Go Home
            <span className="ml-2">→</span>
          </Link>
        </div>
        
        {process.env.NODE_ENV === 'development' && error.message && (
          <details className="mt-8 text-left max-w-2xl mx-auto">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              Error Details (Development Only)
            </summary>
            <pre className="mt-4 p-4 rounded-lg bg-muted text-xs overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}

