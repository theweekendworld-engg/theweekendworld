'use client'

import { useState } from 'react'
import VibeSelector, { VibeType } from './VibeSelector'
import VibeRecommendation from './VibeRecommendation'

interface VibeRecommendationData {
  id: string
  vibe: string
  title: string
  description: string
  linkUrl: string | null
  emoji: string | null
}

interface WeekendVibeClientProps {
  vibeRecommendations: VibeRecommendationData[]
}

export default function WeekendVibeClient({ vibeRecommendations }: WeekendVibeClientProps) {
  const [selectedVibe, setSelectedVibe] = useState<VibeType | null>(null)

  // Create a map of vibe type to recommendation for easy lookup
  const vibeMap = new Map(
    vibeRecommendations.map((rec) => [rec.vibe.toLowerCase(), rec])
  )

  const selectedRecommendation = selectedVibe
    ? vibeMap.get(selectedVibe) || null
    : null

  return (
    <div>
      <div className="mb-6">
        <VibeSelector onSelect={setSelectedVibe} selectedVibe={selectedVibe} />
      </div>
      <VibeRecommendation vibe={selectedVibe} recommendation={selectedRecommendation} />
    </div>
  )
}

