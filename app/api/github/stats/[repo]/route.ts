import { NextRequest, NextResponse } from 'next/server'
import { getGitHubRepoStats } from '@/lib/github'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ repo: string }> }
) {
  try {
    const { repo } = await params
    const token = process.env.GITHUB_TOKEN

    // repo format: owner/repo
    const [owner, repoName] = repo.split('/')
    if (!owner || !repoName) {
      return NextResponse.json(
        { error: 'Invalid repo format. Use owner/repo' },
        { status: 400 }
      )
    }

    const stats = await getGitHubRepoStats(owner, repoName, token)

    if (!stats) {
      return NextResponse.json(
        { error: 'Repository not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching GitHub stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch GitHub stats' },
      { status: 500 }
    )
  }
}

