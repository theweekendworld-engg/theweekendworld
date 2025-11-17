import { prisma } from '@/lib/db'

export async function getProducts(options?: {
  published?: boolean
  featured?: boolean
}) {
  const where: any = {}
  if (options?.published !== undefined) {
    where.published = options.published
  }
  if (options?.featured !== undefined) {
    where.featured = options.featured
  }

  return await prisma.product.findMany({
    where,
    include: {
      testimonials: true,
    },
    orderBy: [
      { order: 'asc' },
      { createdAt: 'desc' },
    ],
  })
}

export async function getProductBySlug(slug: string) {
  try {
    return await prisma.product.findUnique({
      where: {
        slug,
      },
      include: {
        testimonials: true,
      },
    })
  } catch (error) {
    console.error(`Database error fetching product by slug ${slug}:`, error)
    throw error
  }
}

export async function getProductById(id: string) {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      testimonials: true,
    },
  })
}

