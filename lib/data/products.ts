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
  return await prisma.product.findUnique({
    where: {
      slug,
    },
    include: {
      testimonials: true,
    },
  })
}

export async function getProductById(id: string) {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      testimonials: true,
    },
  })
}

