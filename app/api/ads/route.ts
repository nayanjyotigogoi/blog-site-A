import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const size = searchParams.get("size")

    let query = supabase.from("advertisements").select("*")

    if (size) {
      query = query.eq("size", size)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase query error in /api/ads:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data)
  } catch (err: any) {
    console.error("Unexpected error in /api/ads GET:", err.message)
    return NextResponse.json({ error: "Internal server error: " + err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Added try-catch block
    const supabase = createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const ad = await request.json()
    const { data, error } = await supabase.from("advertisements").insert([ad]).select().single()

    if (error) {
      console.error("Supabase insert error in /api/ads POST:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    // Catch any unexpected errors
    console.error("Unexpected error in /api/ads POST:", err.message)
    return NextResponse.json({ error: "Internal server error: " + err.message }, { status: 500 })
  }
}
