interface GitHubRepoStats {
  stars: number
  forks: number
  watchers: number
  openIssues: number
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const cache = new Map<string, { data: GitHubRepoStats; timestamp: number }>()

export async function getGitHubRepoStats(
  owner: string,
  repo: string,
  token?: string
): Promise<GitHubRepoStats | null> {
  const cacheKey = `${owner}/${repo}`
  const cached = cache.get(cacheKey)

  // Return cached data if still valid
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  try {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
    }

    if (token) {
      headers.Authorization = `token ${token}`
    }

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers,
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const data = await response.json()
    const stats: GitHubRepoStats = {
      stars: data.stargazers_count || 0,
      forks: data.forks_count || 0,
      watchers: data.watchers_count || 0,
      openIssues: data.open_issues_count || 0,
    }

    // Update cache
    cache.set(cacheKey, { data: stats, timestamp: Date.now() })

    return stats
  } catch (error) {
    console.error('Error fetching GitHub stats:', error)
    // Return cached data if available, even if expired
    if (cached) {
      return cached.data
    }
    return null
  }
}

export function extractRepoFromUrl(url: string): { owner: string; repo: string } | null {
  try {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    if (match) {
      return {
        owner: match[1],
        repo: match[2].replace(/\.git$/, ''),
      }
    }
    return null
  } catch {
    return null
  }
}

