'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    const headerOffset = 80 // Account for sticky header
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    })
  }
}

export default function HomepageNav() {
  const pathname = usePathname()
  const isHomepage = pathname === '/'

  if (!isHomepage) {
    return null
  }

  return (
    <nav className="hidden lg:flex items-center space-x-6">
      <button
        onClick={() => scrollToSection('weekend-countdown')}
        className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
      >
        Weekend
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground transition-all group-hover:w-full" />
      </button>
      <button
        onClick={() => scrollToSection('weekly-picks')}
        className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
      >
        Picks
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground transition-all group-hover:w-full" />
      </button>
      <button
        onClick={() => scrollToSection('community-stories')}
        className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
      >
        Stories
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground transition-all group-hover:w-full" />
      </button>
      <button
        onClick={() => scrollToSection('featured-products')}
        className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
      >
        Products
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground transition-all group-hover:w-full" />
      </button>
      <button
        onClick={() => scrollToSection('blog')}
        className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
      >
        Blog
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground transition-all group-hover:w-full" />
      </button>
    </nav>
  )
}

