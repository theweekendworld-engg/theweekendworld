import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { rateLimit, getClientIdentifier } from '@/lib/rate-limit'
import { verifyCaptcha } from '@/lib/captcha'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, email, message, captchaToken } = body

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
    const limit = rateLimit(`interest:${identifier}`, 3, 60 * 60 * 1000) // 3 requests per hour
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': '3600' } }
      )
    }

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
      select: { id: true, name: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const interest = await prisma.productInterest.create({
      data: {
        productId: id,
        name: name.trim(),
        email: email.trim(),
        message: message?.trim() || null,
        status: 'pending',
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your interest! We will get back to you soon.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating product interest:', error)
    return NextResponse.json(
      { error: 'Failed to submit interest' },
      { status: 500 }
    )
  }
}

