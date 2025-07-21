"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, EditIcon, TrashIcon } from "lucide-react"
import type { BlogPost } from "@/lib/blog-data" // Re-use type from lib/blog-data

export default function ManageBlogPostsPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBlogPosts = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/blog")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setBlogPosts(data.posts)
    } catch (err: any) {
      setError(err.message || "Failed to fetch blog posts.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) {
      return
    }
    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      fetchBlogPosts() // Refresh the list
    } catch (err: any) {
      setError(err.message || "Failed to delete blog post.")
    }
  }

  if (loading) return <div className="container mx-auto px-4 py-8 text-center">Loading blog posts...</div>
  if (error) return <div className="container mx-auto px-4 py-8 text-center text-red-500">Error: {error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Blog Posts</h1>
        <Link href="/admin/blog/new" passHref>
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" /> New Blog Post
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground">No blog posts found. Create one!</p>
        ) : (
          blogPosts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Slug: {post.slug}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Link href={`/admin/blog/${post.id}/edit`} passHref>
                  <Button variant="outline" size="icon">
                    <EditIcon className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </Link>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(post.id)}>
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
