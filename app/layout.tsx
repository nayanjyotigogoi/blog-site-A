import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header" // Import the new Header component
import { SiteFooter } from "@/components/site-footer"
import { FloatingAd } from "@/components/ads/floating-ad"
import { PopupAd } from "@/components/ads/popup-ad"
import { ThemeProvider } from "@/components/theme-provider" // Import ThemeProvider
import { Toaster } from "@/components/ui/toaster" // Import Toaster

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Anvaya Solution",
  description: "Modern business solutions with cutting-edge technology",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex flex-col min-h-screen">
            <Header /> {/* Use the new Header component */}
            <main className="flex-grow">{children}</main>
            <SiteFooter />
          </div>
          <FloatingAd />
          <PopupAd />
          <Toaster /> {/* Add Toaster component here */}
        </ThemeProvider>
      </body>
    </html>
  )
}
