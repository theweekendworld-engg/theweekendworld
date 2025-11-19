'use client'

import { useState } from 'react'

export type VibeType = 'chill' | 'party' | 'travel' | 'build'

interface VibeOption {
  type: VibeType
  emoji: string
  label: string
  color: string
  hoverColor: string
}

const vibes: VibeOption[] = [
  {
    type: 'chill',
    emoji: '🧘',
    label: 'Chill',
    color: 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400',
    hoverColor: 'hover:bg-blue-500/20 hover:border-blue-500/50',
  },
  {
    type: 'party',
    emoji: '🎉',
    label: 'Party',
    color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400',
    hoverColor: 'hover:bg-yellow-500/20 hover:border-yellow-500/50',
  },
  {
    type: 'travel',
    emoji: '✈️',
    label: 'Travel',
    color: 'bg-teal-500/10 border-teal-500/30 text-teal-600 dark:text-teal-400',
    hoverColor: 'hover:bg-teal-500/20 hover:border-teal-500/50',
  },
  {
    type: 'build',
    emoji: '🛠️',
    label: 'Build',
    color: 'bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400',
    hoverColor: 'hover:bg-orange-500/20 hover:border-orange-500/50',
  },
]

interface VibeSelectorProps {
  onSelect: (vibe: VibeType) => void
  selectedVibe: VibeType | null
}

export default function VibeSelector({ onSelect, selectedVibe }: VibeSelectorProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
      {vibes.map((vibe) => {
        const isSelected = selectedVibe === vibe.type
        return (
          <button
            key={vibe.type}
            onClick={() => onSelect(vibe.type)}
            className={`
              flex flex-col items-center justify-center gap-2
              px-6 py-4 sm:px-8 sm:py-5
              rounded-2xl border-2 font-medium text-sm sm:text-base
              transition-all duration-300 min-w-[100px] sm:min-w-[120px]
              ${isSelected 
                ? `${vibe.color} border-2 scale-105 shadow-xl shadow-black/5 dark:shadow-black/20` 
                : `border-border bg-card text-muted-foreground ${vibe.hoverColor} hover:border-foreground/20`
              }
              hover:scale-105 active:scale-95
            `}
          >
            <span className="text-3xl sm:text-4xl">{vibe.emoji}</span>
            <span className="font-semibold">{vibe.label}</span>
          </button>
        )
      })}
    </div>
  )
}

