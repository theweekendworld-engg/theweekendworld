'use client'

import { useState, useEffect } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getNextFriday5PM(): Date {
  const now = new Date()
  const day = now.getDay() // 0 = Sunday, 5 = Friday
  const daysUntilFriday = day <= 5 ? 5 - day : 5 + (7 - day)
  
  const friday = new Date(now)
  friday.setDate(now.getDate() + daysUntilFriday)
  friday.setHours(17, 0, 0, 0) // 5:00 PM
  
  // If it's already past Friday 5 PM this week, get next Friday
  if (now > friday) {
    friday.setDate(friday.getDate() + 7)
  }
  
  return friday
}

function calculateTimeLeft(targetDate: Date): TimeLeft | null {
  const now = new Date()
  const difference = targetDate.getTime() - now.getTime()
  
  if (difference <= 0) {
    return null // Weekend has started!
  }
  
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
  }
}

export default function WeekendCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)
  const [isWeekend, setIsWeekend] = useState(false)
  const [targetDate] = useState(() => getNextFriday5PM())

  useEffect(() => {
    const timer = setInterval(() => {
      const calculated = calculateTimeLeft(targetDate)
      
      if (calculated === null) {
        setIsWeekend(true)
        setTimeLeft(null)
      } else {
        setIsWeekend(false)
        setTimeLeft(calculated)
      }
    }, 1000)

    // Calculate immediately
    const calculated = calculateTimeLeft(targetDate)
    if (calculated === null) {
      setIsWeekend(true)
      setTimeLeft(null)
    } else {
      setIsWeekend(false)
      setTimeLeft(calculated)
    }

    return () => clearInterval(timer)
  }, [targetDate])

  if (isWeekend) {
    return (
      <div className="text-center mb-8">
        <div className="inline-flex items-center rounded-full border border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/30 px-3 py-1 text-xs font-medium text-orange-700 dark:text-orange-300 mb-4">
          <span className="mr-2 h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
          It&apos;s Weekend Time! 🎉
        </div>
      </div>
    )
  }

  if (!timeLeft) {
    return (
      <div className="text-center">
        <div className="text-lg text-muted-foreground">Calculating...</div>
      </div>
    )
  }

  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground mb-4">
        <span className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
        Weekend starts in
      </div>
      <div className="flex items-center justify-center gap-2 sm:gap-3 max-w-md mx-auto">
        <div className="flex flex-col items-center px-2 sm:px-3 py-2 rounded-lg bg-card/50 border border-border/50">
          <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-orange-500 to-yellow-500 bg-clip-text text-transparent tabular-nums">
            {timeLeft.days.toString().padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wide">
            D
          </div>
        </div>
        <span className="text-muted-foreground/50 text-xl">:</span>
        <div className="flex flex-col items-center px-2 sm:px-3 py-2 rounded-lg bg-card/50 border border-border/50">
          <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-yellow-500 to-orange-500 bg-clip-text text-transparent tabular-nums">
            {timeLeft.hours.toString().padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wide">
            H
          </div>
        </div>
        <span className="text-muted-foreground/50 text-xl">:</span>
        <div className="flex flex-col items-center px-2 sm:px-3 py-2 rounded-lg bg-card/50 border border-border/50">
          <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-teal-500 to-blue-500 bg-clip-text text-transparent tabular-nums">
            {timeLeft.minutes.toString().padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wide">
            M
          </div>
        </div>
        <span className="text-muted-foreground/50 text-xl">:</span>
        <div className="flex flex-col items-center px-2 sm:px-3 py-2 rounded-lg bg-card/50 border border-border/50">
          <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-blue-500 to-teal-500 bg-clip-text text-transparent tabular-nums animate-pulse">
            {timeLeft.seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wide">
            S
          </div>
        </div>
      </div>
    </div>
  )
}

