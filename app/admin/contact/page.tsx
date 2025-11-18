'use client'

import { useState, useEffect } from 'react'

interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  read: boolean
  createdAt: Date | string
}

export default function AdminContactPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  useEffect(() => {
    fetchSubmissions()
  }, [filter])

  async function fetchSubmissions() {
    try {
      const params = new URLSearchParams()
      if (filter !== 'all') {
        params.append('read', filter === 'read' ? 'true' : 'false')
      }
      const res = await fetch(`/api/admin/contact?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setSubmissions(data)
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  async function markAsRead(id: string) {
    try {
      const res = await fetch(`/api/admin/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      })
      if (res.ok) {
        setSubmissions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, read: true } : s))
        )
        if (selectedSubmission?.id === id) {
          setSelectedSubmission({ ...selectedSubmission, read: true })
        }
      }
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  async function markAsUnread(id: string) {
    try {
      const res = await fetch(`/api/admin/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: false }),
      })
      if (res.ok) {
        setSubmissions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, read: false } : s))
        )
        if (selectedSubmission?.id === id) {
          setSelectedSubmission({ ...selectedSubmission, read: false })
        }
      }
    } catch (error) {
      console.error('Error marking as unread:', error)
    }
  }

  async function deleteSubmission(id: string) {
    if (!confirm('Are you sure you want to delete this submission?')) {
      return
    }
    try {
      const res = await fetch(`/api/admin/contact/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== id))
        if (selectedSubmission?.id === id) {
          setSelectedSubmission(null)
        }
      }
    } catch (error) {
      console.error('Error deleting submission:', error)
    }
  }

  const unreadCount = submissions.filter((s) => !s.read).length

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Contact Messages</h1>
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Contact Messages</h1>
          <p className="mt-2 text-muted-foreground">
            {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-md px-4 py-2 text-sm font-medium ${
            filter === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          All ({submissions.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`rounded-md px-4 py-2 text-sm font-medium ${
            filter === 'unread'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`rounded-md px-4 py-2 text-sm font-medium ${
            filter === 'read'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Read ({submissions.length - unreadCount})
        </button>
      </div>

      {submissions.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center">
          <p className="text-muted-foreground">No contact messages found.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* List */}
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                onClick={() => setSelectedSubmission(submission)}
                className={`cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md ${
                  selectedSubmission?.id === submission.id
                    ? 'border-primary bg-primary/5'
                    : submission.read
                    ? 'border-border bg-card'
                    : 'border-primary/50 bg-primary/5'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{submission.name}</h3>
                      {!submission.read && (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{submission.email}</p>
                    {submission.subject && (
                      <p className="mt-1 text-sm font-medium">{submission.subject}</p>
                    )}
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {submission.message}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(submission.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detail View */}
          {selectedSubmission && (
            <div className="rounded-lg border bg-card p-6">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedSubmission.name}</h2>
                  <p className="mt-1 text-muted-foreground">{selectedSubmission.email}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {new Date(selectedSubmission.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {selectedSubmission.read ? (
                    <button
                      onClick={() => markAsUnread(selectedSubmission.id)}
                      className="rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted"
                    >
                      Mark Unread
                    </button>
                  ) : (
                    <button
                      onClick={() => markAsRead(selectedSubmission.id)}
                      className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteSubmission(selectedSubmission.id)}
                    className="rounded-md border border-red-200 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 text-sm font-medium text-red-800 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-900/30"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {selectedSubmission.subject && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Subject</h3>
                  <p className="mt-1 text-lg font-semibold">{selectedSubmission.subject}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Message</h3>
                <p className="mt-2 whitespace-pre-wrap text-foreground">
                  {selectedSubmission.message}
                </p>
              </div>

              <div className="mt-6 flex gap-2">
                <a
                  href={`mailto:${selectedSubmission.email}`}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

