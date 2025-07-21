"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { fetchAd, type Ad } from "@/lib/ad-service"

type BannerAdProps = {
  adSize: Ad["size"]
  className?: string
}

export function BannerAd({ adSize, className }: BannerAdProps) {
  const [ad, setAd] = React.useState<Ad | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const loadAd = async () => {
      setLoading(true)
      const fetchedAd = await fetchAd(adSize)
      setAd(fetchedAd)
      setLoading(false)
    }
    loadAd()
  }, [adSize])

  if (loading) {
    return (
      <div className={`bg-muted animate-pulse rounded-lg ${className}`}>
        <div className="flex items-center justify-center h-full text-muted-foreground">Loading Ad...</div>
      </div>
    )
  }

  if (!ad) {
    return null // No ad to display
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <Link href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
        {ad.type === "image" && ad.imageUrl && (
          <Image
            src={ad.imageUrl || "/placeholder.svg"}
            alt={ad.altText || "Advertisement"}
            width={adSize === "large" ? 970 : adSize === "medium" ? 600 : 250}
            height={adSize === "large" ? 250 : adSize === "medium" ? 150 : 100}
            className="w-full h-full object-cover"
          />
        )}
        {ad.type === "text" && ad.content && (
          <CardContent className="flex items-center justify-center p-4 h-full">
            <p className="text-center font-medium">{ad.content}</p>
          </CardContent>
        )}
      </Link>
    </Card>
  )
}
