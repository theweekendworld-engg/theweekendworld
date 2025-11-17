import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')

    const where: any = {}
    if (published === 'true') {
      where.published = true
    }
    if (featured === 'true') {
      where.featured = true
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        testimonials: true,
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      slug,
      name,
      description,
      shortDescription,
      featuredImage,
      gallery,
      videoUrl,
      githubUrl,
      liveUrl,
      features,
      tags,
      published,
      featured,
      order,
    } = body

    const product = await prisma.product.create({
      data: {
        slug,
        name,
        description,
        shortDescription,
        featuredImage,
        gallery: gallery || null,
        videoUrl,
        githubUrl,
        liveUrl,
        features: features || null,
        tags: tags || [],
        published: published || false,
        featured: featured || false,
        order: order || 0,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

