import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Admin Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/blog" passHref>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>Manage Blog Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Create, edit, and delete blog articles.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/ads" passHref>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>Manage Advertisements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Add, update, and remove advertisements.</p>
            </CardContent>
          </Card>
        </Link>
        {/* Add more admin sections here */}
      </div>
    </div>
  )
}
