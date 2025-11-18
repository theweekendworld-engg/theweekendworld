'use client'

import { useState, useEffect } from 'react'
import { executeRecaptcha } from '@/lib/recaptcha-v3'
import { MessageSquare, Send, User } from 'lucide-react'

interface Comment {
  id: string
  content: string
  authorName: string | null
  email: string | null
  isAnonymous: boolean
  createdAt: string
  replies?: Comment[]
}

interface BlogCommentsProps {
  slug: string
}

export default function BlogComments({ slug }: BlogCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    content: '',
    authorName: '',
    email: '',
    isAnonymous: false,
  })

  useEffect(() => {
    fetchComments()
  }, [slug])

  async function fetchComments() {
    try {
      const res = await fetch(`/api/blog/${slug}/comments`)
      if (res.ok) {
        const data = await res.json()
        setComments(data)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.content.trim()) {
      alert('Please enter a comment')
      return
    }

    if (!formData.isAnonymous && !formData.authorName.trim()) {
      alert('Please enter your name or select anonymous')
      return
    }

    setSubmitting(true)

    // Execute reCAPTCHA v3
    const captchaToken = await executeRecaptcha('blog_comment')
    if (!captchaToken) {
      alert('CAPTCHA verification failed. Please try again.')
      setSubmitting(false)
      return
    }

    try {
      const res = await fetch(`/api/blog/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          parentId: replyingTo || null,
          captchaToken,
        }),
      })

      if (res.ok) {
        const newComment = await res.json()
        if (replyingTo) {
          // Add reply to parent comment
          setComments((prev) =>
            prev.map((comment) =>
              comment.id === replyingTo
                ? { ...comment, replies: [...(comment.replies || []), newComment] as Comment[] }
                : comment
            )
          )
        } else {
          // Add new top-level comment
          setComments([newComment, ...comments])
        }
        // Reset form
        setFormData({ content: '', authorName: '', email: '', isAnonymous: false })
        setShowForm(false)
        setReplyingTo(null)
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to submit comment')
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
      alert('Failed to submit comment')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="mt-16 pt-12 border-t border-border">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/4"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-16 pt-12 border-t border-border">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            Comments ({comments.length})
          </h2>
          <p className="text-muted-foreground">
            Share your thoughts and join the discussion
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            Add Comment
          </button>
        )}
      </div>

      {/* Comment Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-12 p-6 rounded-2xl border border-border bg-card space-y-4"
        >
          {replyingTo && (
            <div className="text-sm text-muted-foreground mb-2">
              Replying to comment
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-2">
              Comment <span className="text-destructive">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              required
              className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Write your comment here..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="anonymous"
              checked={formData.isAnonymous}
              onChange={(e) =>
                setFormData({ ...formData, isAnonymous: e.target.checked })
              }
              className="rounded border-border"
            />
            <label htmlFor="anonymous" className="text-sm text-muted-foreground">
              Post as Anonymous
            </label>
          </div>

          {!formData.isAnonymous && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.authorName}
                  onChange={(e) =>
                    setFormData({ ...formData, authorName: e.target.value })
                  }
                  required={!formData.isAnonymous}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email (optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="your@email.com"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Optional. Used for notifications only.
                </p>
              </div>
            </>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              <Send className="h-4 w-4" />
              {submitting ? 'Submitting...' : 'Post Comment'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setReplyingTo(null)
                setFormData({ content: '', authorName: '', email: '', isAnonymous: false })
              }}
              className="rounded-lg border border-border px-6 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-8">
        {comments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={(id) => {
                setReplyingTo(id)
                setShowForm(true)
              }}
            />
          ))
        )}
      </div>
    </div>
  )
}

function CommentItem({
  comment,
  onReply,
}: {
  comment: Comment
  onReply: (id: string) => void
}) {
  return (
    <div className="border-l-2 border-border pl-6">
      <div className="flex items-start gap-3 mb-2">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
          {comment.isAnonymous ? (
            <User className="h-5 w-5 text-primary" />
          ) : (
            <span className="text-sm font-semibold text-primary">
              {comment.authorName?.charAt(0).toUpperCase() || 'A'}
            </span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-foreground">
              {comment.authorName || 'Anonymous'}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(comment.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
            {comment.content}
          </p>
          <button
            onClick={() => onReply(comment.id)}
            className="mt-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Reply
          </button>
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-12 mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="border-l-2 border-muted pl-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                  {reply.isAnonymous ? (
                    <User className="h-4 w-4 text-primary" />
                  ) : (
                    <span className="text-xs font-semibold text-primary">
                      {reply.authorName?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-foreground">
                      {reply.authorName || 'Anonymous'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(reply.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                    {reply.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

