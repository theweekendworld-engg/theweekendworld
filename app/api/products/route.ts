import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getProducts } from '@/lib/data/products'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')

    const products = await getProducts({
      published: published === 'true' ? true : undefined,
      featured: featured === 'true' ? true : undefined,
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

