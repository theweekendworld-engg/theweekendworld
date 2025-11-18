'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'

interface BlogLikesProps {
  slug: string
}

export default function BlogLikes({ slug }: BlogLikesProps) {
  const [likes, setLikes] = useState({ count: 0, hasLiked: false })
  const [loading, setLoading] = useState(true)
  const [isToggling, setIsToggling] = useState(false)

  useEffect(() => {
    async function fetchLikes() {
      try {
        const res = await fetch(`/api/blog/${slug}/likes`)
        if (res.ok) {
          const data = await res.json()
          setLikes(data)
        }
      } catch (error) {
        console.error('Error fetching likes:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchLikes()
  }, [slug])

  const handleToggleLike = async () => {
    if (isToggling) return
    
    setIsToggling(true)
    const previousLikes = { ...likes }
    
    // Optimistic update
    setLikes({
      count: likes.hasLiked ? likes.count - 1 : likes.count + 1,
      hasLiked: !likes.hasLiked,
    })

    try {
      const res = await fetch(`/api/blog/${slug}/likes`, {
        method: 'POST',
      })
      
      if (res.ok) {
        const data = await res.json()
        setLikes(data)
      } else {
        // Revert on error
        setLikes(previousLikes)
        const error = await res.json()
        alert(error.error || 'Failed to toggle like')
      }
    } catch (error) {
      // Revert on error
      setLikes(previousLikes)
      console.error('Error toggling like:', error)
    } finally {
      setIsToggling(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Heart className="h-5 w-5 animate-pulse" />
        <span className="text-sm">...</span>
      </div>
    )
  }

  return (
    <button
      onClick={handleToggleLike}
      disabled={isToggling}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
        likes.hasLiked
          ? 'border-primary bg-primary/10 text-primary hover:bg-primary/20'
          : 'border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <Heart
        className={`h-5 w-5 transition-all ${
          likes.hasLiked ? 'fill-current' : ''
        }`}
      />
      <span className="text-sm font-medium">{likes.count}</span>
      <span className="text-xs text-muted-foreground">
        {likes.count === 1 ? 'like' : 'likes'}
      </span>
    </button>
  )
}

