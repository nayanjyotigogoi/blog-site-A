export type BlogPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  imageUrl: string
  keywords: string[]
  tags: string[]
  created_at?: string // Add created_at and updated_at from DB
  updated_at?: string
}

// Reusable fetch function with improved error handling
async function fetchApi<T>(path: string): Promise<T | null> {
  // Use relative path for server-side fetches, and window.location.origin for client-side
  const url = typeof window === "undefined" ? path : `${window.location.origin}${path}`

  try {
    const response = await fetch(url, {
      next: { revalidate: 60 }, // Revalidate data every 60 seconds
    })

    if (!response.ok) {
      let errorDetail = response.statusText // Default to statusText
      try {
        const errorBody = await response.json()
        if (errorBody && errorBody.error) {
          errorDetail = errorBody.error // Use the error message from the API route's JSON response
        }
      } catch (jsonParseError) {
        console.warn(`Could not parse error response as JSON for ${url}:`, jsonParseError)
      }
      console.error(`Failed to fetch from ${url}: ${response.status} - ${errorDetail || "Unknown error"}`)
      return null
    }

    return response.json()
  } catch (networkError: any) {
    console.error(`Network error fetching from ${url}:`, networkError.message)
    return null
  }
}

export async function getBlogPosts(
  page = 1,
  limit = 9,
  tag?: string, // New: Optional tag parameter
): Promise<{ posts: BlogPost[]; totalCount: number }> {
  const queryParams = new URLSearchParams()
  queryParams.append("page", page.toString())
  queryParams.append("limit", limit.toString())
  if (tag) {
    queryParams.append("tag", tag)
  }
  const data = await fetchApi<{ posts: BlogPost[]; totalCount: number }>(`/api/blog?${queryParams.toString()}`)
  return data || { posts: [], totalCount: 0 }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const data = await fetchApi<BlogPost>(`/api/blog?slug=${slug}`)
  return data
}

export async function getUniqueTags(): Promise<string[]> {
  const data = await fetchApi<string[]>("/api/tags")
  return data || []
}

// Keep the dummy data for reference or initial seeding if needed, but it won't be used by the new fetch functions
export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "getting-started-with-nextjs",
    title: "Getting Started with Next.js",
    excerpt: "A comprehensive guide to setting up your first Next.js project and understanding its core concepts.",
    content: `
      <p>Next.js is a powerful React framework that enables you to build server-rendered React applications with ease. It provides a great developer experience with features like file-system based routing, API routes, and built-in CSS support.</p>
      <p>To get started, you'll need Node.js installed on your machine. Then, you can create a new Next.js project using Create Next App:</p>
      <pre><code>npx create-next-app@latest my-blog-app</code></pre>
      <p>This command will set up a new Next.js project with all the necessary configurations. Once the project is created, navigate into the directory and start the development server:</p>
      <pre><code>cd my-blog-app\nnpm run dev</code></pre>
      <p>Your Next.js application will now be running on \`http://localhost:3000\`. You can start editing the \`app/page.tsx\` file to see your changes reflected in the browser.</p>
      <p>Next.js uses file-system based routing, meaning you can define routes by creating folders and files inside the \`app\` directory. For example, \`app/about/page.tsx\` will create an \`/about\` route.</p>
      <p>Happy coding!</p>
    `,
    imageUrl: "/placeholder.svg?height=200&width=400",
    keywords: ["Next.js", "React", "Web Development"],
    tags: ["Next.js", "React", "Frameworks", "Frontend"],
  },
  {
    id: "2",
    slug: "understanding-server-components",
    title: "Understanding React Server Components",
    excerpt:
      "Dive deep into the world of React Server Components and how they change the way we build web applications.",
    content: `
      <p>React Server Components (RSCs) are a new paradigm in React that allow you to render components on the server, reducing the amount of JavaScript sent to the client and improving initial page load performance.</p>
      <p>Unlike traditional server-side rendering (SSR), RSCs are not hydrated on the client. Instead, they are rendered once on the server and their output (HTML and a special JSON format) is sent to the client. This means less client-side JavaScript, faster page loads, and better user experience.</p>
      <p>In Next.js App Router, components are Server Components by default. You can opt into Client Components by adding the \`"use client"\` directive at the top of your file.</p>
      <p>Key benefits of Server Components include:</p>
      <ul>
        <li><strong>Zero-bundle size:</strong> Server Components don't contribute to the client-side JavaScript bundle.</li>
        <li><strong>Direct database access:</strong> You can directly access databases or file systems from Server Components without needing API routes.</li>
        <li><strong>Improved performance:</strong> Faster initial page loads and better Core Web Vitals.</li>
      </ul>
      <p>While Server Components offer many advantages, it's important to understand when to use them versus Client Components. Client Components are still necessary for interactivity, state management, and browser-specific APIs.</p>
    `,
    imageUrl: "/placeholder.svg?height=200&width=400",
    keywords: ["React Server Components", "RSC", "Next.js", "Performance"],
    tags: ["React", "Next.js", "Server Components", "Performance", "Web Dev"],
  },
  {
    id: "3",
    slug: "optimizing-images-in-nextjs",
    title: "Optimizing Images in Next.js",
    excerpt: "Learn how to effectively optimize images in your Next.js applications for better performance and SEO.",
    content: `
      <p>Images often account for a significant portion of page weight, impacting loading times and user experience. Next.js provides a built-in \`next/image\` component that automatically optimizes images for you.</p>
      <p>The \`next/image\` component offers several optimization features:</p>
      <ul>
        <li><strong>Automatic Image Optimization:</strong> Images are optimized on demand as users request them, even if they are hosted on external data sources.</li>
        <li><strong>Lazy Loading:</strong> Images are loaded only when they enter the viewport, improving initial page load performance.</li>
        <li><strong>Image Resizing:</strong> Images are automatically resized to the correct dimensions for different screen sizes.</li>
        <li><strong>Modern Formats:</strong> Images are converted to modern formats like WebP when supported by the browser.</li>
      </ul>
      <p>To use \`next/image\`, simply import it and replace your \`&lt;img&gt;\` tags:</p>
      <pre><code>import Image from 'next/image';\n\n&lt;Image src="/my-image.jpg" alt="My Image" width={500} height={300} /&gt;</code></pre>
      <p>Remember to always provide \`width\` and \`height\` props to avoid layout shifts and ensure proper image optimization. For external images, you might need to configure your \`next.config.js\` to allow the domain.</p>
    `,
    imageUrl: "/placeholder.svg?height=200&width=400",
    keywords: ["Image Optimization", "Next.js", "Performance", "SEO"],
    tags: ["Next.js", "Images", "Optimization", "SEO", "Web Performance"],
  },
]
