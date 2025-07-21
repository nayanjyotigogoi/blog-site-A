"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import type { Ad } from "@/lib/ad-service"

type EditAdPageProps = {
  params: {
    id: string
  }
}

export default function EditAdPage({ params }: EditAdPageProps) {
  const router = useRouter()
  const { id } = params
  const [formData, setFormData] = useState<Ad>({
    id: "",
    type: "image",
    imageUrl: "",
    linkUrl: "",
    altText: "",
    content: "",
    size: "large",
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAd = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/ads/${id}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: Ad = await response.json()
        setFormData(data)
      } catch (err: any) {
        setError(err.message || "Failed to fetch advertisement.")
        toast({
          title: "Error",
          description: err.message || "Failed to fetch advertisement.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchAd()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: keyof Ad) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const payload = {
        ...formData,
        // Clear irrelevant fields based on ad type
        imageUrl: formData.type === "image" ? formData.imageUrl : null,
        altText: formData.type === "image" ? formData.altText : null,
        content: formData.type === "text" ? formData.content : null,
      }

      const response = await fetch(`/api/ads/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      toast({
        title: "Success!",
        description: "Advertisement updated successfully.",
      })
      router.push("/admin/ads")
    } catch (err: any) {
      setError(err.message || "Failed to update advertisement.")
      toast({
        title: "Error",
        description: err.message || "Failed to update advertisement.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="container mx-auto px-4 py-8 text-center">Loading advertisement data...</div>
  if (error) return <div className="container mx-auto px-4 py-8 text-center text-red-500">Error: {error}</div>

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Advertisement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="type">Ad Type</Label>
              <Select name="type" value={formData.type} onValueChange={handleSelectChange("type")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ad type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image Ad</SelectItem>
                  <SelectItem value="text">Text Ad</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.type === "image" && (
              <>
                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="altText">Alt Text</Label>
                  <Input id="altText" name="altText" value={formData.altText || ""} onChange={handleChange} />
                </div>
              </>
            )}

            {formData.type === "text" && (
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content || ""}
                  onChange={handleChange}
                  required
                  rows={3}
                />
              </div>
            )}

            <div>
              <Label htmlFor="linkUrl">Link URL</Label>
              <Input id="linkUrl" name="linkUrl" value={formData.linkUrl} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="size">Ad Size</Label>
              <Select name="size" value={formData.size} onValueChange={handleSelectChange("size")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ad size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="large">Large (970x250)</SelectItem>
                  <SelectItem value="medium">Medium (600x150)</SelectItem>
                  <SelectItem value="small">Small (250x100)</SelectItem>
                  <SelectItem value="floating">Floating (120x120)</SelectItem>
                  <SelectItem value="popup">Popup (400x250)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" disabled={submitting}>
              {submitting ? "Updating..." : "Update Advertisement"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
