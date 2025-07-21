"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import type { Ad } from "@/lib/ad-service"

export default function NewAdPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<Omit<Ad, "id">>({
    type: "image",
    imageUrl: "",
    linkUrl: "",
    altText: "",
    content: "",
    size: "large",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: keyof Omit<Ad, "id">) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = {
        ...formData,
        // Clear irrelevant fields based on ad type
        imageUrl: formData.type === "image" ? formData.imageUrl : null,
        altText: formData.type === "image" ? formData.altText : null,
        content: formData.type === "text" ? formData.content : null,
      }

      const response = await fetch("/api/ads", {
        method: "POST",
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
        description: "Advertisement created successfully.",
      })
      router.push("/admin/ads")
    } catch (err: any) {
      setError(err.message || "Failed to create advertisement.")
      toast({
        title: "Error",
        description: err.message || "Failed to create advertisement.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Advertisement</CardTitle>
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
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Advertisement"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
