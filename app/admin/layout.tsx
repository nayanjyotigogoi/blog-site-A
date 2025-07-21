import type React from "react"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { LogOutIcon } from "lucide-react"
import { logout } from "@/app/auth/actions" // Import the logout action

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login") // Redirect to login page if not authenticated
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <form action={logout}>
          <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80">
            <LogOutIcon className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </form>
      </header>
      <main className="flex-grow p-6">{children}</main>
    </div>
  )
}
