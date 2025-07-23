// lib/blog.ts

export type BlogPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  image_url: string // ✅ Matches Supabase column
  keywords: string[]
  tags: string[]
  created_at?: string
  updated_at?: string
}

// ✅ Reusable fetch function
async function fetchApi<T>(path: string): Promise<T | null> {
  const isServer = typeof window === "undefined"
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const url = isServer ? `${baseUrl}${path}` : path

  try {
    const response = await fetch(url, {
      next: { revalidate: 60 }, // ISR: Revalidate every 60s
    })

    if (!response.ok) {
      let errorDetail = response.statusText
      try {
        const errorBody = await response.json()
        if (errorBody?.error) {
          errorDetail = errorBody.error
        }
      } catch {}
      console.error(`Failed to fetch from ${url}: ${response.status} - ${errorDetail}`)
      return null
    }

    return response.json()
  } catch (networkError: any) {
    console.error(`Network error fetching from ${url}:`, networkError.message)
    return null
  }
}

// ✅ Fetch paginated blog posts
export async function getBlogPosts(
  page = 1,
  limit = 9,
  tag?: string
): Promise<{ posts: BlogPost[]; totalCount: number }> {
  const queryParams = new URLSearchParams()
  queryParams.append("page", page.toString())
  queryParams.append("limit", limit.toString())
  if (tag) queryParams.append("tag", tag)

  const data = await fetchApi<{ posts: BlogPost[]; totalCount: number }>(
    `/api/blog?${queryParams.toString()}`
  )
  return data || { posts: [], totalCount: 0 }
}

// ✅ Fetch a single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return await fetchApi<BlogPost>(`/api/blog?slug=${slug}`)
}

// ✅ Fetch all unique tags (optional endpoint)
export async function getUniqueTags(): Promise<string[]> {
  const data = await fetchApi<string[]>("/api/tags")
  return data || []
}
