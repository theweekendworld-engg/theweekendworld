'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface VibeRecommendationData {
  id: string
  vibe: string
  title: string
  description: string
  linkUrl: string | null
  emoji: string | null
}

interface VibeRecommendationProps {
  vibe: string | null
  recommendation: VibeRecommendationData | null
}

export default function VibeRecommendation({ vibe, recommendation }: VibeRecommendationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (recommendation) {
      setIsVisible(false)
      // Trigger fade-in animation
      setTimeout(() => setIsVisible(true), 10)
    } else {
      setIsVisible(false)
    }
  }, [recommendation])

  if (!vibe || !recommendation) {
    return null
  }

  const content = (
    <div
      className={`
        rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 shadow-lg
        transition-all duration-500
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <div className="flex items-start gap-4">
        {recommendation.emoji && (
          <div className="text-4xl flex-shrink-0">{recommendation.emoji}</div>
        )}
        <div className="flex-1 space-y-3">
          <h3 className="text-xl font-bold tracking-tight text-foreground">
            {recommendation.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {recommendation.description}
          </p>
          {recommendation.linkUrl && (
            <div className="pt-2">
              <Link
                href={recommendation.linkUrl}
                className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors group"
              >
                Learn more
                <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="mt-8 min-h-[140px]">
      {content}
    </div>
  )
}

