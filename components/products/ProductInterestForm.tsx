'use client'

import { useState } from 'react'
import { executeRecaptcha } from '@/lib/recaptcha-v3'
import { Send, CheckCircle2 } from 'lucide-react'

interface ProductInterestFormProps {
  productId: string
  productName: string
}

export default function ProductInterestForm({ productId, productName }: ProductInterestFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and email are required')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    setSubmitting(true)

    // Execute reCAPTCHA v3
    const captchaToken = await executeRecaptcha('product_interest')
    if (!captchaToken) {
      setError('CAPTCHA verification failed. Please try again.')
      setSubmitting(false)
      return
    }

    try {
      const res = await fetch(`/api/products/${productId}/interest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          captchaToken,
        }),
      })

      if (res.ok) {
        setSubmitted(true)
        setFormData({ name: '', email: '', message: '' })
      } else {
        const errorData = await res.json()
        setError(errorData.error || 'Failed to submit. Please try again.')
      }
    } catch (err) {
      console.error('Error submitting interest:', err)
      setError('Something went wrong. Please try again later.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 dark:bg-green-900/20 p-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">
          Thank You!
        </h3>
        <p className="text-green-700 dark:text-green-300">
          We've received your interest in {productName}. We'll get back to you soon!
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
      <div className="mb-6">
        <h3 className="text-2xl font-bold tracking-tight mb-2">
          Interested in {productName}?
        </h3>
        <p className="text-muted-foreground">
          Let us know if you'd like to try it out or have questions. We'll get back to you!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Name <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email <span className="text-destructive">*</span>
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            Message (optional)
          </label>
          <textarea
            id="message"
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Tell us about your use case or any questions..."
          />
        </div>


        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="h-4 w-4" />
          {submitting ? 'Submitting...' : 'Submit Interest'}
        </button>
      </form>
    </div>
  )
}

