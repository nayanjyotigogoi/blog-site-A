import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="bg-muted py-12 w-full">
      <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 px-4 md:px-6">
        {/* Logo and Contact Info */}
        <div className="space-y-4 sm:col-span-2 md:col-span-1 lg:col-span-2 text-left">
          <Link href="/" className="text-2xl font-bold">
            Anvaya Solution
          </Link>
          <p className="text-sm text-muted-foreground">Modern business solutions with cutting-edge technology</p>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>+91 97073 85552</p>
            <p>admin@anvayasolution.com</p>
            <p>Guwahati, Assam</p>
          </div>
        </div>

        {/* Company Links */}
        <div className="space-y-3 sm:col-span-1 md:col-span-1 lg:col-span-1 text-left">
          <h3 className="text-lg font-semibold">Company</h3>
          <nav className="space-y-2">
            <Link href="/about" className="block text-sm text-muted-foreground hover:text-foreground">
              About Us
            </Link>
            <Link href="/team" className="block text-sm text-muted-foreground hover:text-foreground">
              Our Team
            </Link>
            <Link href="/careers" className="block text-sm text-muted-foreground hover:text-foreground">
              Careers
            </Link>
            <Link href="/contact" className="block text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </nav>
        </div>

        {/* Services Links */}
        <div className="space-y-3 sm:col-span-1 md:col-span-1 lg:col-span-1 text-left">
          <h3 className="text-lg font-semibold">Services</h3>
          <nav className="space-y-2">
            <Link
              href="/services/web-development"
              className="block text-sm text-muted-foreground hover:text-foreground"
            >
              Web Development
            </Link>
            <Link href="/services/mobile-apps" className="block text-sm text-muted-foreground hover:text-foreground">
              Mobile Apps
            </Link>
            <Link
              href="/services/cloud-solutions"
              className="block text-sm text-muted-foreground hover:text-foreground"
            >
              Cloud Solutions
            </Link>
            <Link href="/services/ai-ml" className="block text-sm text-muted-foreground hover:text-foreground">
              AI & ML
            </Link>
          </nav>
        </div>

        {/* Resources Links */}
        <div className="space-y-3 sm:col-span-1 md:col-span-1 lg:col-span-1 text-left">
          <h3 className="text-lg font-semibold">Resources</h3>
          <nav className="space-y-2">
            <Link href="/blog" className="block text-sm text-muted-foreground hover:text-foreground">
              Blog
            </Link>
            <Link href="/case-studies" className="block text-sm text-muted-foreground hover:text-foreground">
              Case Studies
            </Link>
            <Link href="/documentation" className="block text-sm text-muted-foreground hover:text-foreground">
              Documentation
            </Link>
          </nav>
        </div>

        {/* Support Links */}
        <div className="space-y-3 sm:col-span-1 md:col-span-1 lg:col-span-1 text-left">
          <h3 className="text-lg font-semibold">Support</h3>
          <nav className="space-y-2">
            <Link href="/privacy" className="block text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="block text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/cookie" className="block text-sm text-muted-foreground hover:text-foreground">
              Cookie Policy
            </Link>
            <Link href="/gdpr" className="block text-sm text-muted-foreground hover:text-foreground">
              GDPR
            </Link>
          </nav>
        </div>
      </div>
      <div className="container mt-8 border-t pt-8 text-center text-sm text-muted-foreground px-4 md:px-6">
        <p>&copy; 2024 Anvaya Solution. All rights reserved. Built with ❤️ for innovation.</p>
      </div>
    </footer>
  )
}
