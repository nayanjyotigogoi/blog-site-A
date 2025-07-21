"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown, Globe, Sun, Moon, LogInIcon, LogOutIcon } from "lucide-react" // Added LogInIcon, LogOutIcon
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"
import { useTheme } from "next-themes"
import { getSession, logout } from "@/app/auth/actions" // Import getSession and logout
import { toast } from "@/hooks/use-toast"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [session, setSession] = useState<any>(null) // State to hold session
  const { language, setLanguage, t } = useLanguage()
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Fetch session on component mount
  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const currentSession = await getSession()
        setSession(currentSession)
      } catch (error: any) {
        console.error("Failed to fetch session:", error.message)
        toast({
          title: "Authentication Error",
          description: error.message || "Could not load user session. Please check environment variables.",
          variant: "destructive",
        })
      }
    }
    fetchUserSession()
  }, [pathname]) // Re-fetch session if pathname changes (e.g., after login/logout)

  const handleExternalNavigation = (url: string, pageName: string) => {
    const confirmed = window.confirm(
      `You are being redirected to our main website (${pageName} page). Do you want to continue?`,
    )
    if (confirmed) {
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const navigation = [
    {
      name: t("nav.home"),
      href: "#", // Home link still uses external navigation
      onClick: () => handleExternalNavigation("https://www.anvayasolution.com/", "Home"),
    },
    {
      name: t("nav.services"),
      href: "#",
      onClick: () => handleExternalNavigation("https://www.anvayasolution.com/services", "Services"),
    },
    {
      name: t("nav.portfolio"),
      href: "#",
      onClick: () => handleExternalNavigation("https://www.anvayasolution.com/portfolio", "Portfolio"),
    },
    {
      name: t("nav.about"),
      href: "#",
      onClick: () => handleExternalNavigation("https://www.anvayasolution.com/about", "About"),
    },
    {
      name: t("nav.blog"),
      href: "/", // Blog link points to the local root (which is the blog)
      onClick: undefined, // No external navigation for blog
    },
    {
      name: t("nav.contact"),
      href: "#",
      onClick: () => handleExternalNavigation("https://www.anvayasolution.com/contact", "Contact"),
    },
  ]

  const languages = [
    { code: "en", name: "English", flag: "en" },
    { code: "as", name: "অসমীয়া", flag: "as" },
  ]

  // isActiveBlogPage now checks if the current path is the root or starts with /blog/
  const isActiveBlogPage = pathname === "/" || pathname?.startsWith("/blog/")

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/Logo/Anvaya-logo-only.png" // Replace with the correct path to your logo file
              alt="Anvaya Solution Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="font-bold text-xl">Anvaya Solution</span>
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                {item.onClick ? (
                  <button
                    onClick={item.onClick}
                    className={`flex items-center transition-colors duration-200 font-medium ${
                      // Only apply active styling if it's the blog link AND it's an active blog page
                      item.name === t("nav.blog") && isActiveBlogPage
                        ? "text-blue-600 dark:text-blue-400 font-semibold"
                        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center transition-colors duration-200 font-medium ${
                      // Apply active styling if it's the blog link AND it's an active blog page
                      item.name === t("nav.blog") && isActiveBlogPage
                        ? "text-blue-600 dark:text-blue-400 font-semibold"
                        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                  >
                    {item.name}
                    {/* Show active indicator only for the blog link when active */}
                    {item.name === t("nav.blog") && isActiveBlogPage && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </nav>
          {/* Theme Toggle, Language Switcher & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <Globe className="h-5 w-5" />
                <span className="text-sm font-medium">{languages.find((lang) => lang.code === language)?.flag}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {isLanguageOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                  <div className="py-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code as "en" | "as")
                          setIsLanguageOpen(false)
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                          language === lang.code
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        <span className="mr-2">{lang.flag}</span>
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {session ? (
              <form action={logout}>
                <Button
                  type="submit"
                  variant="ghost"
                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <LogOutIcon className="mr-2 h-4 w-4" /> Logout
                </Button>
              </form>
            ) : (
              <Link href="/login" passHref>
                <Button
                  variant="ghost"
                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <LogInIcon className="mr-2 h-4 w-4" /> Login
                </Button>
              </Link>
            )}
            <Button
              onClick={() => handleExternalNavigation("https://www.anvayasolution.com/contact", "Contact")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              {t("nav.getStarted")}
            </Button>
          </div>
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-lg border-t dark:border-gray-800">
            <div className="px-4 py-6 space-y-4">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.onClick ? (
                    <button
                      onClick={() => {
                        item.onClick()
                        setIsMenuOpen(false)
                      }}
                      className={`block w-full text-left transition-colors duration-200 font-medium py-2 ${
                        item.name === t("nav.blog") && isActiveBlogPage
                          ? "text-blue-600 dark:text-blue-400 font-semibold"
                          : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                      }`}
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`block transition-colors duration-200 font-medium py-2 ${
                        item.name === t("nav.blog") && isActiveBlogPage
                          ? "text-blue-600 dark:text-blue-400 font-semibold"
                          : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              {/* Mobile Theme & Language Controls */}
              <div className="flex items-center justify-between pt-4 border-t dark:border-gray-800">
                <button
                  onClick={toggleTheme}
                  className="flex items-center space-x-2 p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  <span className="text-sm">{theme === "dark" ? t("theme.light") : t("theme.dark")}</span>
                </button>
                <div className="flex space-x-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code as "en" | "as")}
                      className={`p-2 rounded-lg text-sm transition-colors duration-200 ${
                        language === lang.code
                          ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {lang.flag}
                    </button>
                  ))}
                </div>
              </div>
              {session ? (
                <form action={logout}>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 rounded-lg transition-all duration-200 mt-4"
                  >
                    <LogOutIcon className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </form>
              ) : (
                <Link href="/login" passHref>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 rounded-lg transition-all duration-200 mt-4">
                    <LogInIcon className="mr-2 h-4 w-4" /> Login
                  </Button>
                </Link>
              )}
              <Button
                onClick={() => {
                  handleExternalNavigation("https://www.anvayasolution.com/contact", "Contact")
                  setIsMenuOpen(false)
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 rounded-lg transition-all duration-200 mt-4"
              >
                {t("nav.getStarted")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
