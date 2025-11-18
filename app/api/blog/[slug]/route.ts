import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getBlogPostBySlug } from '@/lib/data/blog'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    // Check if slug is actually an ID (cuid format) or a slug
    const post = await prisma.blogPost.findFirst({
      where: {
        OR: [
          { id: slug },
          { slug: slug },
        ],
      },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const response = NextResponse.json(post)
    // Cache for 5 minutes, revalidate on hard reload
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    return response
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params
    const body = await request.json()

    // Check if slug is actually an ID (cuid format) or a slug
    const post = await prisma.blogPost.findFirst({
      where: {
        OR: [
          { id: slug },
          { slug: slug },
        ],
      },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const updatedPost = await prisma.blogPost.update({
      where: { id: post.id },
      data: body,
    })

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params

    // Check if slug is actually an ID (cuid format) or a slug
    const post = await prisma.blogPost.findFirst({
      where: {
        OR: [
          { id: slug },
          { slug: slug },
        ],
      },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    await prisma.blogPost.delete({
      where: { id: post.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    )
  }
}

