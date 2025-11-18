import { NextRequest, NextResponse } from 'next/server'
import { getProductBySlug } from '@/lib/data/products'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const product = await getProductBySlug(slug)

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Only return published products for public API
    if (!product.published) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const response = NextResponse.json(product)
    // Cache for 5 minutes, revalidate on hard reload
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    return response
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

