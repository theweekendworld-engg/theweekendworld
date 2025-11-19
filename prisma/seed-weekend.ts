import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting weekend data seed...')

  // Calculate next Friday 5 PM for weekend picks
  const now = new Date()
  const day = now.getDay() // 0 = Sunday, 5 = Friday
  const daysUntilFriday = day <= 5 ? 5 - day : 5 + (7 - day)
  const friday = new Date(now)
  friday.setDate(now.getDate() + daysUntilFriday)
  friday.setHours(17, 0, 0, 0) // 5:00 PM
  if (now > friday) {
    friday.setDate(friday.getDate() + 7)
  }

  // Create weekend picks (only if they don't exist for this week)
  const existingPicks = await prisma.weekendPick.findMany({
    where: {
      weekStartDate: friday,
      active: true,
    },
  })

  if (existingPicks.length === 0) {
    const pick1 = await prisma.weekendPick.create({
      data: {
        title: 'Explore Local Hiking Trails',
        description: 'Discover hidden gems in your area with this curated list of scenic hiking trails perfect for a weekend adventure. Pack a lunch and enjoy nature!',
        imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
        category: 'Adventure',
        linkUrl: 'https://example.com/hiking-trails',
        order: 1,
        active: true,
        weekStartDate: friday,
      },
    })

    const pick2 = await prisma.weekendPick.create({
      data: {
        title: 'Weekend Coding Project: Build a Personal Dashboard',
        description: 'A fun weekend project to build your own personal dashboard with weather, tasks, and favorite links. Perfect for learning React and API integration.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        category: 'Build',
        linkUrl: 'https://example.com/dashboard-tutorial',
        order: 2,
        active: true,
        weekStartDate: friday,
      },
    })

    const pick3 = await prisma.weekendPick.create({
      data: {
        title: 'Cozy Reading Nook Setup',
        description: 'Transform a corner of your home into the perfect reading space. Tips on lighting, seating, and creating an atmosphere that makes you want to curl up with a good book.',
        imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
        category: 'Chill',
        linkUrl: 'https://example.com/reading-nook',
        order: 3,
        active: true,
        weekStartDate: friday,
      },
    })

    console.log('✅ Created weekend picks:', pick1.title, pick2.title, pick3.title)
  } else {
    console.log('ℹ️  Weekend picks already exist for this week, skipping...')
  }

  // Create vibe recommendations (only if they don't exist)
  const existingVibes = await prisma.vibeRecommendation.findMany({
    where: {
      active: true,
    },
  })

  if (existingVibes.length === 0) {
    await prisma.vibeRecommendation.create({
      data: {
        vibe: 'chill',
        title: 'Meditation & Mindfulness Apps',
        description: 'Take a break and find your zen with these top-rated meditation apps. Perfect for unwinding after a long week and starting your weekend with a clear mind.',
        linkUrl: 'https://example.com/meditation-apps',
        emoji: '🧘',
        active: true,
        order: 1,
      },
    })

    await prisma.vibeRecommendation.create({
      data: {
        vibe: 'party',
        title: 'Weekend Playlist: Ultimate Party Mix',
        description: 'Curated playlist of the hottest tracks to get your weekend started right. Perfect for hosting friends or just dancing around your living room!',
        linkUrl: 'https://example.com/party-playlist',
        emoji: '🎉',
        active: true,
        order: 1,
      },
    })

    await prisma.vibeRecommendation.create({
      data: {
        vibe: 'travel',
        title: 'Weekend Getaway Ideas Within 2 Hours',
        description: 'Discover amazing destinations you can reach in just a couple of hours. From beach towns to mountain retreats, find your perfect weekend escape.',
        linkUrl: 'https://example.com/weekend-getaways',
        emoji: '✈️',
        active: true,
        order: 1,
      },
    })

    await prisma.vibeRecommendation.create({
      data: {
        vibe: 'build',
        title: 'Weekend Project: Build a Personal API',
        description: 'Learn to build your own REST API from scratch this weekend. Step-by-step guide covering database design, authentication, and deployment.',
        linkUrl: 'https://example.com/build-api',
        emoji: '🛠️',
        active: true,
        order: 1,
      },
    })

    console.log('✅ Created vibe recommendations')
  } else {
    console.log('ℹ️  Vibe recommendations already exist, skipping...')
  }

  // Create weekend stories (only if they don't exist)
  const existingStories = await prisma.weekendStory.findMany({
    where: {
      featured: true,
      approved: true,
    },
  })

  if (existingStories.length === 0) {
    await prisma.weekendStory.create({
      data: {
        photoUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        caption: 'Just finished a beautiful morning hike! The views were incredible and it was the perfect way to start my weekend. Nature therapy at its finest 🌲',
        authorName: 'Sarah M.',
        approved: true,
        featured: true,
      },
    })

    await prisma.weekendStory.create({
      data: {
        photoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
        caption: 'Weekend brunch with friends turned into an all-day adventure. Sometimes the best weekends are the unplanned ones! 🥂',
        authorName: 'Mike T.',
        approved: true,
        featured: true,
      },
    })

    await prisma.weekendStory.create({
      data: {
        photoUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
        caption: 'Spent the weekend building a new feature for my side project. There\'s something so satisfying about coding on a lazy Sunday afternoon 💻',
        authorName: 'Alex K.',
        approved: true,
        featured: true,
      },
    })

    await prisma.weekendStory.create({
      data: {
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        caption: 'Quick weekend road trip to the coast. Sometimes you just need to hit the road and see where it takes you! 🚗',
        authorName: 'Jordan L.',
        approved: true,
        featured: true,
      },
    })

    console.log('✅ Created weekend stories')
  } else {
    console.log('ℹ️  Weekend stories already exist, skipping...')
  }

  console.log('🎉 Weekend data seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

