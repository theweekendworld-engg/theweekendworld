import Image from 'next/image'
import Link from 'next/link'
import { getFeaturedWeekendStories } from '@/lib/data/weekend'

export default async function CommunityStories() {
  const stories = await getFeaturedWeekendStories()

  if (stories.length === 0) {
    return null
  }

  return (
    <section className="border-t bg-gradient-to-b from-muted/30 to-background">
      <div className="container px-4 py-24">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            My Weekend Story
          </h2>
          <p className="text-lg text-muted-foreground mb-2">
            Real people. Real weekend vibes.
          </p>
          <p className="text-sm text-muted-foreground/80 italic">
            Our Community This Weekend
          </p>
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stories.map((story) => (
            <div
              key={story.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-xl hover:shadow-foreground/5 hover:-translate-y-1"
            >
              {/* Polaroid-style photo */}
              <div className="relative aspect-square w-full overflow-hidden rounded-xl mb-4 bg-muted border border-border/50">
                <Image
                  src={story.photoUrl}
                  alt={story.caption || 'Weekend story'}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              {/* Caption */}
              <p className="text-sm text-foreground leading-relaxed line-clamp-3 mb-2">
                {story.caption}
              </p>
              {story.authorName && (
                <p className="text-xs text-muted-foreground font-medium">
                  — {story.authorName}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center rounded-lg border border-border bg-background px-6 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-muted hover:border-foreground/20"
          >
            Share Your Weekend Story
            <span className="ml-2 transition-transform hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

