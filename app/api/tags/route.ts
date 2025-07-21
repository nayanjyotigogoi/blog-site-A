import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = createServerSupabaseClient()

  try {
    // Fetch all blog posts and extract unique tags
    const { data, error } = await supabase.from("blog_posts").select("tags")

    if (error) {
      console.error("Error fetching tags:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const allTags = new Set<string>()
    data.forEach((post) => {
      if (Array.isArray(post.tags)) {
        post.tags.forEach((tag: string) => {
          if (tag && tag.trim() !== "") {
            allTags.add(tag.trim())
          }
        })
      }
    })

    // Convert Set to Array and sort alphabetically
    const uniqueTags = Array.from(allTags).sort((a, b) => a.localeCompare(b))

    return NextResponse.json(uniqueTags)
  } catch (err: any) {
    console.error("Unexpected error in /api/tags:", err.message)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
