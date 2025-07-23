import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12 text-center min-h-[calc(100vh-64px-128px)] flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-4 text-primary">Welcome to Anvaya Solution</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
        Your partner in modern business solutions and cutting-edge technology. Explore our services, portfolio, and
        insights.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/blog" passHref>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            Explore Our Blog
          </Button>
        </Link>
        <Link href="https://www.anvayasolution.com/contact" target="_blank" rel="noopener noreferrer" passHref>
          <Button size="lg" variant="outline">
            Get in Touch
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 w-full max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Our Services</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Discover how our web development, mobile apps, and AI solutions can transform your business.
            </p>
            <Link
              href="https://www.anvayasolution.com/services"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline mt-4 block"
            >
              Learn More
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Our Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">See examples of our successful projects and client collaborations.</p>
            <Link
              href="https://www.anvayasolution.com/portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline mt-4 block"
            >
              View Portfolio
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
