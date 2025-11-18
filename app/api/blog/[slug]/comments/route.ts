import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { rateLimit, getClientIdentifier } from '@/lib/rate-limit'
import { verifyCaptcha } from '@/lib/captcha'
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
    
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Get approved comments (top-level only, replies loaded separately)
    const comments = await prisma.blogComment.findMany({
      where: {
        blogPostId: post.id,
        approved: true,
        parentId: null, // Only top-level comments
      },
      orderBy: { createdAt: 'desc' },
      include: {
        replies: {
          where: { approved: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
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
    const body = await request.json()
    const { content, authorName, email, isAnonymous, parentId, captchaToken } = body

    // Validate CAPTCHA
    if (!captchaToken) {
      return NextResponse.json(
        { error: 'CAPTCHA verification required' },
        { status: 400 }
      )
    }

    const captchaValid = await verifyCaptcha(captchaToken)
    if (!captchaValid) {
      return NextResponse.json(
        { error: 'CAPTCHA verification failed' },
        { status: 400 }
      )
    }

    // Rate limiting
    const identifier = getClientIdentifier(request)
    const limit = rateLimit(`comment:${identifier}`, 5, 60 * 1000) // 5 comments per minute
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      )
    }

    // Validate content
    if (!content || content.trim().length < 3) {
      return NextResponse.json(
        { error: 'Comment must be at least 3 characters' },
        { status: 400 }
      )
    }

    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Validate parent comment if replying
    if (parentId) {
      const parent = await prisma.blogComment.findFirst({
        where: {
          id: parentId,
          blogPostId: post.id,
        },
      })
      if (!parent) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 400 }
        )
      }
    }

    const hashedId = hashIdentifier(identifier)
    const finalAuthorName = isAnonymous || !authorName ? 'Anonymous' : authorName.trim()

    const comment = await prisma.blogComment.create({
      data: {
        blogPostId: post.id,
        content: content.trim(),
        authorName: finalAuthorName,
        email: email && email.trim() ? email.trim() : null,
        isAnonymous: isAnonymous || !email,
        userIdentifier: hashedId,
        parentId: parentId || null,
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}

