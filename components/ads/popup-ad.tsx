"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { XIcon } from "lucide-react"
import { fetchAd, type Ad } from "@/lib/ad-service"

export function PopupAd() {
  const [ad, setAd] = React.useState<Ad | null>(null)
  const [isOpen, setIsOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const loadAd = async () => {
      setLoading(true)
      const fetchedAd = await fetchAd("popup")
      setAd(fetchedAd)
      setLoading(false)
      if (fetchedAd) {
        // Show popup after a delay, e.g., 5 seconds
        const timer = setTimeout(() => {
          setIsOpen(true)
        }, 5000)
        return () => clearTimeout(timer)
      }
    }
    loadAd()
  }, [])

  if (loading || !ad) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 z-10 bg-background/50 hover:bg-background/70"
          onClick={() => setIsOpen(false)}
          aria-label="Close advertisement"
        >
          <XIcon className="h-5 w-5" />
        </Button>
        <Link href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="block">
          {ad.type === "image" && ad.imageUrl && (
            <Image
              src={ad.imageUrl || "/placeholder.svg"}
              alt={ad.altText || "Popup Advertisement"}
              width={400}
              height={250}
              className="w-full h-auto object-cover"
            />
          )}
          {ad.type === "text" && ad.content && (
            <DialogHeader className="p-6">
              <DialogTitle className="text-2xl font-bold">Special Announcement!</DialogTitle>
              <DialogDescription className="text-lg text-center mt-2">{ad.content}</DialogDescription>
            </DialogHeader>
          )}
        </Link>
      </DialogContent>
    </Dialog>
  )
}
