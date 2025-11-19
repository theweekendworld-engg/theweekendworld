import WeekendCountdown from './WeekendCountdown'
import VibeSelector, { VibeType } from './VibeSelector'
import VibeRecommendation from './VibeRecommendation'
import { getVibeRecommendations } from '@/lib/data/weekend'
import WeekendVibeClient from './WeekendVibeClient'

export default async function WeekendWidget() {
  const vibeRecommendations = await getVibeRecommendations()

  // Create a map of vibe type to recommendation for easy lookup
  const vibeMap = new Map(
    vibeRecommendations.map((rec) => [rec.vibe.toLowerCase(), rec])
  )

  return (
    <section className="relative overflow-hidden border-b">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-yellow-50/30 to-teal-50/50 dark:from-orange-950/10 dark:via-yellow-950/5 dark:to-teal-950/10" />
      <div className="container relative px-4 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          {/* Countdown */}
          <div className="mb-16">
            <WeekendCountdown />
          </div>

          {/* Vibe Selector with Recommendations */}
          <div className="mb-8">
            <p className="text-center text-sm font-medium text-muted-foreground mb-6">
              Choose your weekend vibe
            </p>
            <WeekendVibeClient vibeRecommendations={vibeRecommendations} />
          </div>
        </div>
      </div>
    </section>
  )
}

