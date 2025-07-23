import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import Header from "@/components/header"
import { SiteFooter } from "@/components/site-footer"
import { FloatingAd } from "@/components/ads/floating-ad"
import { PopupAd } from "@/components/ads/popup-ad"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import SupabaseProvider from "@/components/supabase-provider" // ✅ Supabase Provider
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

const inter = Inter({ subsets: ["latin"] })


export const metadata: Metadata = {
  title: "Anvaya Blog – Insights on AI, Business Tech, and Automation",
  description: "Stay updated with expert articles from Anvaya Solution on AI automation, web development, technical consulting, mobile apps, and more.",
  keywords: "Anvaya Blog, AI automation, web development, business consulting, tech insights, mobile apps, software development, cloud solutions, digital transformation, IT solutions, AI trends, business technology",
  generator: "Anvaya Blog",
  authors: [{ name: "Anvaya Team", url: "https://anvayasolution.com" }],
  creator: "Anvaya Solution",
  publisher: "Anvaya Solution",
  metadataBase: new URL("https://blog.anvayasolution.com"),
  alternates: {
    canonical: "https://blog.anvayasolution.com",
  },
  applicationName: "Anvaya Blog",
  category: "Technology",
  colorScheme: "light dark",
  themeColor: "#0ea5e9", // Tailwind's cyan-500
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-snippet': -1,
      'max-image-preview': "large",
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon_io/favicon.ico" },
      { url: "/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/favicon_io/apple-touch-icon.png",
  },
  openGraph: {
    title: "Anvaya Blog – Insights on AI, Business Tech, and Automation",
    description: "Explore real-world use cases and insights on AI, web development, and modern business solutions from Anvaya Solution.",
    url: "https://blog.anvayasolution.com",
    siteName: "Anvaya Blog",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/Logo/Anvaya-Light.png",
        width: 1200,
        height: 630,
        alt: "Anvaya Blog Cover Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anvaya Blog – Insights on AI, Business Tech, and Automation",
    description: "Stay informed with expert tech content from Anvaya Solution.",
    creator: "@anvayasolution", // Update if you have a Twitter handle
    site: "@anvayasolution",
    images: ["/Logo/Anvaya-Light.png"],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // ✅ Get session server-side
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SupabaseProvider session={session}>
            <div className="flex flex-col min-h-screen">
              <Header /> {/* Auth-aware Header */}
              <main className="flex-grow">{children}</main>
              <SiteFooter />
            </div>
            <FloatingAd />
            <PopupAd />
            <Toaster />
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
