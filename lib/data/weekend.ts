import { prisma } from '@/lib/db'

/**
 * Get the start date of the current week (Friday 5:00 PM)
 */
function getCurrentWeekStart(): Date {
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

/**
 * Get active weekend picks for the current week
 * Returns top 3 picks ordered by order field
 */
export async function getActiveWeekendPicks() {
  try {
    const weekStart = getCurrentWeekStart()
    
    return await prisma.weekendPick.findMany({
      where: {
        active: true,
        weekStartDate: {
          lte: weekStart,
        },
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
      take: 3,
    })
  } catch (error) {
    console.error('Error fetching active weekend picks:', error)
    return []
  }
}

/**
 * Get featured weekend stories
 * Returns 2-4 featured/approved stories ordered by createdAt desc
 */
export async function getFeaturedWeekendStories() {
  try {
    return await prisma.weekendStory.findMany({
      where: {
        approved: true,
        featured: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 4,
    })
  } catch (error) {
    console.error('Error fetching featured weekend stories:', error)
    return []
  }
}

/**
 * Get all active vibe recommendations
 * Ordered by order field
 */
export async function getVibeRecommendations() {
  try {
    return await prisma.vibeRecommendation.findMany({
      where: {
        active: true,
      },
      orderBy: {
        order: 'asc',
      },
    })
  } catch (error) {
    console.error('Error fetching vibe recommendations:', error)
    return []
  }
}

/**
 * Get specific vibe recommendation by type
 * @param vibe - The vibe type (chill, party, travel, build)
 */
export async function getVibeRecommendationByType(vibe: string) {
  try {
    return await prisma.vibeRecommendation.findFirst({
      where: {
        vibe: vibe.toLowerCase(),
        active: true,
      },
      orderBy: {
        order: 'asc',
      },
    })
  } catch (error) {
    console.error(`Error fetching vibe recommendation for ${vibe}:`, error)
    return null
  }
}

