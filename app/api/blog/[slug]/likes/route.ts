import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { rateLimit, getClientIdentifier } from '@/lib/rate-limit'
import crypto from 'crypto'

// Hash IP for privacy
function hashIdentifier(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex').slice(0, 32)
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    // Get blog post
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Get like count
    const likeCount = await prisma.blogLike.count({
      where: { blogPostId: post.id },
    })

    // Check if current user has liked (if identifier provided)
    const identifier = request.headers.get('x-user-identifier')
    let hasLiked = false
    if (identifier) {
      const hashedId = hashIdentifier(identifier)
      const existingLike = await prisma.blogLike.findUnique({
        where: {
          blogPostId_userIdentifier: {
            blogPostId: post.id,
            userIdentifier: hashedId,
          },
        },
      })
      hasLiked = !!existingLike
    }

    return NextResponse.json({
      count: likeCount,
      hasLiked,
    })
  } catch (error) {
    console.error('Error fetching likes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch likes' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    // Rate limiting
    const identifier = getClientIdentifier(request)
    const limit = rateLimit(`like:${identifier}`, 10, 60 * 1000) // 10 likes per minute
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      )
    }

    // Get blog post
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const hashedId = hashIdentifier(identifier)

    // Check if already liked
    const existingLike = await prisma.blogLike.findUnique({
      where: {
        blogPostId_userIdentifier: {
          blogPostId: post.id,
          userIdentifier: hashedId,
        },
      },
    })

    if (existingLike) {
      // Unlike
      await prisma.blogLike.delete({
        where: { id: existingLike.id },
      })
      const newCount = await prisma.blogLike.count({
        where: { blogPostId: post.id },
      })
      return NextResponse.json({ count: newCount, hasLiked: false })
    }

    // Like
    await prisma.blogLike.create({
      data: {
        blogPostId: post.id,
        userIdentifier: hashedId,
      },
    })

    const newCount = await prisma.blogLike.count({
      where: { blogPostId: post.id },
    })

    return NextResponse.json({ count: newCount, hasLiked: true })
  } catch (error: any) {
    if (error.code === 'P2002') {
      // Duplicate like (race condition)
      const { slug } = await params
      const post = await prisma.blogPost.findUnique({
        where: { slug },
        select: { id: true },
      })
      if (post) {
        const count = await prisma.blogLike.count({
          where: { blogPostId: post.id },
        })
        return NextResponse.json({ count, hasLiked: true })
      }
    }
    console.error('Error toggling like:', error)
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    )
  }
}

