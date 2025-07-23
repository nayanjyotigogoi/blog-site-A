"use server"

import { createServerSupabaseClient } from "./server"

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    console.error("Login error:", error.message)
    return { error: error.message }
  }

  return { error: null }
}

export async function logout() {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Logout error:", error.message)
    return { error: error.message }
  }

  return { error: null }
}

export async function getSession() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return session
}
