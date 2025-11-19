import Image from 'next/image'
import Link from 'next/link'
import { getActiveWeekendPicks } from '@/lib/data/weekend'

export default async function WeeklyPicks() {
  const picks = await getActiveWeekendPicks()

  if (picks.length === 0) {
    return null
  }

  return (
    <section className="border-t bg-background">
      <div className="container px-4 py-24">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="inline-flex items-center rounded-full border border-border bg-muted/50 px-4 py-1.5 text-xs font-medium text-muted-foreground mb-4">
            <span className="mr-2 h-2 w-2 rounded-full bg-green-500" />
            Updated Every Friday
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            This Weekend&apos;s Top 3 Picks
          </h2>
          <p className="text-lg text-muted-foreground">
            Curated recommendations to make your weekend special
          </p>
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {picks.map((pick) => {
          const cardContent = (
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-xl hover:shadow-foreground/5 hover:-translate-y-1">
              {pick.imageUrl && (
                <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-4 bg-muted">
                  <Image
                    src={pick.imageUrl}
                    alt={pick.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
              <div className="space-y-3">
                {pick.category && (
                  <span className="inline-flex items-center rounded-md border border-border bg-muted/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    {pick.category}
                  </span>
                )}
                <h3 className="text-xl font-bold tracking-tight group-hover:text-foreground/80 transition-colors">
                  {pick.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {pick.description}
                </p>
                {pick.linkUrl && (
                  <div className="mt-4 flex items-center text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    Learn more
                    <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                  </div>
                )}
              </div>
            </div>
          )

          if (pick.linkUrl) {
            return (
              <Link key={pick.id} href={pick.linkUrl} className="block">
                {cardContent}
              </Link>
            )
          }

          return <div key={pick.id}>{cardContent}</div>
        })}
        </div>
      </div>
    </section>
  )
}

