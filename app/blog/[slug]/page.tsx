import { getBlogPostBySlug, type BlogPost } from "@/lib/blog-data"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BannerAd } from "@/components/ads/banner-ad"

type BlogPostPageProps = {
  params: {
    slug: string
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post: BlogPost | null = await getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/blog" passHref>
          {" "}
          {/* Changed href to /blog */}
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8">
        {/* Main Content Area */}
        <div className="col-span-1">
          <div className="my-8">
            <BannerAd adSize="medium" className="w-full h-[150px] mx-auto" />
          </div>

          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
            <Image
              src={post.imageUrl || "/placeholder.svg"}
              alt={post.title}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="my-8">
            <BannerAd adSize="medium" className="w-full h-[150px] mx-auto" />
          </div>
        </div>

        {/* Sidebar Area */}
        <aside className="col-span-1 space-y-6">
          {/* What is the keyword */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">What is the keyword?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {post.keywords && post.keywords.length > 0 ? post.keywords[0] : "N/A"}
              </p>
            </CardContent>
          </Card>

          {/* Related Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Related Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-primary hover:underline">
                    Advanced Next.js Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-primary hover:underline">
                    React Hooks Deep Dive
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-primary hover:underline">
                    Web Performance Best Practices
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Tags</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {post.tags &&
                post.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
            </CardContent>
          </Card>

          <div className="my-6">
            <BannerAd adSize="small" className="w-full h-[100px] mx-auto" />
          </div>

          <div className="my-6">
            <BannerAd adSize="small" className="w-full h-[100px] mx-auto" />
          </div>

          {/* Other important content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Other Important Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Check out our latest whitepapers on modern web architecture.</p>
              <Link href="#" className="text-primary hover:underline mt-2 block">
                Download Whitepaper
              </Link>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
