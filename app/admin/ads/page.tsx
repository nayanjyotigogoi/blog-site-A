"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, EditIcon, TrashIcon } from "lucide-react"
import type { Ad } from "@/lib/ad-service" // Re-use type from lib/ad-service

export default function ManageAdsPage() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAds = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/ads")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setAds(data)
    } catch (err: any) {
      setError(err.message || "Failed to fetch advertisements.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAds()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this advertisement?")) {
      return
    }
    try {
      const response = await fetch(`/api/ads/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      fetchAds() // Refresh the list
    } catch (err: any) {
      setError(err.message || "Failed to delete advertisement.")
    }
  }

  if (loading) return <div className="container mx-auto px-4 py-8 text-center">Loading advertisements...</div>
  if (error) return <div className="container mx-auto px-4 py-8 text-center text-red-500">Error: {error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Advertisements</h1>
        <Link href="/admin/ads/new" passHref>
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" /> New Ad
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ads.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground">No advertisements found. Create one!</p>
        ) : (
          ads.map((ad) => (
            <Card key={ad.id}>
              <CardHeader>
                <CardTitle>{ad.content || ad.altText || `Ad (${ad.size})`}</CardTitle>
                <CardDescription>
                  Type: {ad.type} | Size: {ad.size}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Link: {ad.linkUrl}</p>
                {ad.imageUrl && <p className="text-sm text-muted-foreground">Image: {ad.imageUrl}</p>}
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Link href={`/admin/ads/${ad.id}/edit`} passHref>
                  <Button variant="outline" size="icon">
                    <EditIcon className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </Link>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(ad.id)}>
                  <TrashIcon className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
