"use client"

import { useState, useCallback } from "react"

type LanguageCode = "en" | "as" // English, Assamese

const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.portfolio": "Portfolio",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.blog": "Blog",
    "nav.categories": "Categories", // New translation
    "nav.getStarted": "Get Started",
    "theme.light": "Light",
    "theme.dark": "Dark",
  },
  as: {
    "nav.home": "হোম",
    "nav.services": "সেৱাসমূহ",
    "nav.portfolio": "প'ৰ্টফলিঅ'",
    "nav.about": "আমাৰ বিষয়ে",
    "nav.contact": "যোগাযোগ",
    "nav.blog": "ব্লগ",
    "nav.categories": "শ্ৰেণীসমূহ", // New translation
    "nav.getStarted": "আৰম্ভ কৰক",
    "theme.light": "লাইট",
    "theme.dark": "ডাৰ্ক",
  },
}

export function useLanguage() {
  const [language, setLanguageState] = useState<LanguageCode>("en") // Default to English

  const setLanguage = useCallback((code: LanguageCode) => {
    setLanguageState(code)
  }, [])

  const t = useCallback(
    (key: string) => {
      return translations[language][key] || key // Return key if translation not found
    },
    [language],
  )

  return { language, setLanguage, t }
}
