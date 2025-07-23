// app/api/blog/route.ts
import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const supabase = createServerSupabaseClient()
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug")
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "9")
  const tag = searchParams.get("tag")
  const offset = (page - 1) * limit

  if (slug) {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    if (!data) {
      return NextResponse.json({ message: "Blog post not found" }, { status: 404 })
    }
    return NextResponse.json(data)
  } else {
    let query = supabase.from("blog_posts").select("*", { count: "exact" })

    if (tag) {
      query = query.contains("tags", [tag])
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ posts: data, totalCount: count })
  }
}

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const blogPost = await request.json()

    const { data, error } = await supabase
      .from("blog_posts")
      .insert([{ ...blogPost, user_id: user.id }])
      .select()
      .single()

    if (error) {
      console.error("Supabase insert error:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    console.error("Unexpected error:", err.message)
    return NextResponse.json({ error: "Internal server error: " + err.message }, { status: 500 })
  }
}
