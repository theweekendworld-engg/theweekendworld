import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getBlogPosts } from '@/lib/data/blog'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const published = searchParams.get('published')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    const posts = await getBlogPosts({
      published: published === 'true' ? true : undefined,
      category: category || undefined,
      featured: featured === 'true' ? true : undefined,
    })

    const response = NextResponse.json(posts)
    // Cache for 5 minutes, revalidate on hard reload
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    return response
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
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
      title,
      excerpt,
      content,
      coverImage,
      author,
      category,
      tags,
      published,
      featured,
    } = body

    const post = await prisma.blogPost.create({
      data: {
        slug,
        title,
        excerpt,
        content,
        coverImage,
        author: author || 'TheWeekendWorld',
        category,
        tags: tags || [],
        published: published || false,
        featured: featured || false,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
}

