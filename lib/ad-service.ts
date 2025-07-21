export type Ad = {
  id: string
  type: "image" | "text"
  imageUrl?: string | null
  linkUrl: string
  altText?: string | null
  content?: string | null
  size: "large" | "medium" | "small" | "floating" | "popup"
}

export async function fetchAd(adSize: Ad["size"]): Promise<Ad | null> {
  // Use relative path for server-side fetches, and window.location.origin for client-side
  const url =
    typeof window === "undefined" ? `/api/ads?size=${adSize}` : `${window.location.origin}/api/ads?size=${adSize}`

  try {
    const response = await fetch(url, {
      next: { revalidate: 60 }, // Revalidate data every 60 seconds
    })

    if (!response.ok) {
      let errorDetail = response.statusText // Default to statusText
      try {
        const errorBody = await response.json()
        if (errorBody && errorBody.error) {
          errorDetail = errorBody.error // Use the error message from the API route's JSON response
        }
      } catch (jsonParseError) {
        // If response is not JSON, or parsing fails, stick with statusText
        console.warn(`Could not parse error response as JSON for ${url}:`, jsonParseError)
      }
      console.error(`Failed to fetch ad for size ${adSize}: ${response.status} - ${errorDetail || "Unknown error"}`)
      return null
    }

    const data: Ad[] = await response.json()
    return data.length > 0 ? data[0] : null
  } catch (networkError: any) {
    console.error(`Network error fetching ad for size ${adSize}:`, networkError.message)
    return null
  }
}
