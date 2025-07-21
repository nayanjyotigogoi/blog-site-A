"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"
import { fetchAd, type Ad } from "@/lib/ad-service"

export function FloatingAd() {
  const [ad, setAd] = React.useState<Ad | null>(null)
  const [isVisible, setIsVisible] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const loadAd = async () => {
      setLoading(true)
      const fetchedAd = await fetchAd("floating")
      setAd(fetchedAd)
      setLoading(false)
      if (fetchedAd) {
        // Show after a short delay
        const timer = setTimeout(() => setIsVisible(true), 3000)
        return () => clearTimeout(timer)
      }
    }
    loadAd()
  }, [])

  const handleClose = () => {
    setIsVisible(false)
  }

  if (loading || !ad || !isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center justify-center">
      <div className="relative bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden w-[120px] h-[120px]">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 h-6 w-6 z-10 bg-background/50 hover:bg-background/70"
          onClick={handleClose}
          aria-label="Close advertisement"
        >
          <XIcon className="h-4 w-4" />
        </Button>
        <Link href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
          {ad.type === "image" && ad.imageUrl && (
            <Image
              src={ad.imageUrl || "/placeholder.svg"}
              alt={ad.altText || "Floating Advertisement"}
              width={120}
              height={120}
              className="w-full h-full object-cover"
            />
          )}
          {ad.type === "text" && ad.content && (
            <div className="flex items-center justify-center p-2 h-full text-center text-sm">{ad.content}</div>
          )}
        </Link>
      </div>
    </div>
  )
}
