"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import type { BlogPost } from "@/lib/blog-data"

type EditBlogPostPageProps = {
  params: {
    id: string
  }
}

// Define a type for the form state, where keywords and tags are strings
type BlogPostFormState = Omit<BlogPost, "keywords" | "tags"> & {
  keywords: string
  tags: string
}

export default function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const router = useRouter()
  const { id } = params
  const [formData, setFormData] = useState<BlogPostFormState>({
    // Use BlogPostFormState
    id: "",
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    imageUrl: "",
    keywords: "", // Initialize as string
    tags: "", // Initialize as string
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlogPost = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/blog/${id}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: BlogPost = await response.json()
        setFormData({
          ...data,
          // Convert array of strings to comma-separated string for the input fields
          keywords: Array.isArray(data.keywords) ? data.keywords.join(", ") : "",
          tags: Array.isArray(data.tags) ? data.tags.join(", ") : "",
        })
      } catch (err: any) {
        setError(err.message || "Failed to fetch blog post.")
        toast({
          title: "Error",
          description: err.message || "Failed to fetch blog post.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchBlogPost()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const payload = {
        ...formData,
        // Now formData.keywords and formData.tags are guaranteed to be strings
        keywords: formData.keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }

      const response = await fetch(`/api/blog/${id}`, {
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
        description: "Blog post updated successfully.",
      })
      router.push("/admin/blog")
    } catch (err: any) {
      setError(err.message || "Failed to update blog post.")
      toast({
        title: "Error",
        description: err.message || "Failed to update blog post.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="container mx-auto px-4 py-8 text-center">Loading blog post data...</div>
  if (error) return <div className="container mx-auto px-4 py-8 text-center text-red-500">Error: {error}</div>

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Blog Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea id="excerpt" name="excerpt" value={formData.excerpt} onChange={handleChange} rows={3} />
            </div>
            <div>
              <Label htmlFor="content">Content (HTML allowed)</Label>
              <Textarea id="content" name="content" value={formData.content} onChange={handleChange} rows={10} />
            </div>
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="keywords">Keywords (comma-separated)</Label>
              <Input
                id="keywords"
                name="keywords"
                value={formData.keywords} // Now formData.keywords is always a string
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags} // Now formData.tags is always a string
                onChange={handleChange}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" disabled={submitting}>
              {submitting ? "Updating..." : "Update Blog Post"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
