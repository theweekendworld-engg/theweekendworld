import { prisma } from '@/lib/db'

export async function getBlogPosts(options?: {
  published?: boolean
  category?: string
  featured?: boolean
}) {
  const where: any = {}
  if (options?.published !== undefined) {
    where.published = options.published
  }
  if (options?.category) {
    where.category = options.category
  }
  if (options?.featured !== undefined) {
    where.featured = options.featured
  }

  return await prisma.blogPost.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })
}

export async function getBlogPostBySlug(slug: string) {
  try {
    return await prisma.blogPost.findUnique({
      where: { slug },
    })
  } catch (error) {
    console.error(`Database error fetching blog post by slug ${slug}:`, error)
    throw error
  }
}

