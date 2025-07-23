"use server"

import { createServerSupabaseClient } from "@/lib/supabase/serverAction"
import { redirect } from "next/navigation"

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Login error:", error.message)
    return { error: error.message }
  }

  // You can redirect here OR handle it on the client side
  redirect("/admin") // If doing server redirect
  // return { error: null } // If handling in client
}

export async function signup(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  })

  if (error) {
    console.error("Signup error:", error.message)
    return { error: error.message }
  }

  return { error: null }
}

export async function resetPassword(formData: FormData) {
  const email = formData.get("email") as string
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/update-password`,
  })

  if (error) {
    console.error("Password reset error:", error.message)
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

  redirect("/login")
}

export async function getSession() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}
