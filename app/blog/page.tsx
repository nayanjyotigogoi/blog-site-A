import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getBlogPosts, getUniqueTags } from "@/lib/blog-data" // Import getUniqueTags
import { BannerAd } from "@/components/ads/banner-ad"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Define props for the page component to receive searchParams
type HomePageProps = {
  searchParams: {
    page?: string
    tag?: string // Optional tag parameter
  }
}

export default async function HomePage({ searchParams }: HomePageProps) {
  // Await searchParams to ensure it's fully resolved before accessing properties
  const resolvedSearchParams = await searchParams

  const currentPage = Number.parseInt(resolvedSearchParams.page || "1")
  const postsPerPage = 9 // You can adjust this number
  const activeTag = resolvedSearchParams.tag // Get the active tag

  const { posts: blogPosts, totalCount } = await getBlogPosts(currentPage, postsPerPage, activeTag)
  const uniqueTags = await getUniqueTags() // Fetch unique tags

  const totalPages = Math.ceil(totalCount / postsPerPage)
  const hasNextPage = currentPage < totalPages
  const hasPreviousPage = currentPage > 1

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-5xl font-bold mb-4">Welcome to Anvaya Solution Blog</h1>
      <p className="text-xl text-muted-foreground">
        Explore our insights on modern business solutions and cutting-edge technology.
      </p>

      {/* Large Banner Ad */}
      <div className="my-12">
        <BannerAd adSize="large" className="w-full h-[250px] max-w-[970px] mx-auto" />
      </div>

      <h2 className="text-4xl font-bold text-center mb-10">Latest Blog Posts</h2>

      {/* Tag Filters */}
      {uniqueTags.length > 0 && (
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <span className="text-lg font-medium mr-2">Filter by Tag:</span>
          <Link href="/blog" passHref>
            {" "}
            {/* Changed href to /blog */}
            <Button variant={!activeTag ? "default" : "outline"} size="sm">
              All
            </Button>
          </Link>
          {uniqueTags.map((tag) => (
            <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`} passHref>
              {" "}
              {/* Changed href to /blog */}
              <Button variant={activeTag === tag ? "default" : "outline"} size="sm">
                {tag}
              </Button>
            </Link>
          ))}
        </div>
      )}

      {activeTag && (
        <div className="mb-6 flex justify-center items-center gap-2">
          <span className="text-lg font-medium">Currently showing:</span>
          <Badge variant="default" className="text-lg px-4 py-2">
            {activeTag}
          </Badge>
          <Link href="/blog" passHref>
            {" "}
            {/* Changed href to /blog */}
            <Button variant="ghost" size="sm" className="ml-2">
              Clear Filter
            </Button>
          </Link>
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground">
            No blog posts found {activeTag ? `for tag "${activeTag}"` : ""}. Add some from the admin panel!
          </p>
        ) : (
          blogPosts.map((post) => (
            <Card key={post.id} className="flex flex-col">
              <CardHeader className="p-0">
                <Image
                  src={post.imageUrl || "/placeholder.svg"}
                  alt={post.title}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="flex-grow p-6">
                <CardTitle className="text-2xl font-semibold mb-2">{post.title}</CardTitle>
                <CardDescription className="text-muted-foreground line-clamp-3">{post.excerpt}</CardDescription>
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Link href={`/blog/${post.slug}`} passHref>
                  <Button variant="outline">Read More</Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalCount > postsPerPage && ( // Only show pagination if there's more than one page
        <div className="flex justify-center items-center gap-4 mt-12">
          <Link
            href={{
              pathname: "/blog", // Changed pathname to /blog
              query: { page: currentPage - 1, ...(activeTag && { tag: activeTag }) },
            }}
            passHref
          >
            <Button variant="outline" disabled={!hasPreviousPage}>
              <ChevronLeft className="h-4 w-4 mr-2" /> Previous
            </Button>
          </Link>
          <span className="text-lg font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Link
            href={{
              pathname: "/blog", // Changed pathname to /blog
              query: { page: currentPage + 1, ...(activeTag && { tag: activeTag }) },
            }}
            passHref
          >
            <Button variant="outline" disabled={!hasNextPage}>
              Next <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
