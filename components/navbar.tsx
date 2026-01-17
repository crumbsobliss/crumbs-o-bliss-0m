"use client"

import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Moon, Sun, Globe } from "lucide-react"
import { useState, useEffect } from "react"

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const t = useTranslations()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Extract locale from pathname
  const locale = pathname.split("/")[1]
  const currentLocale = locale === "en" || locale === "bn" ? locale : "en"

  const switchLanguage = (newLocale: string) => {
    const newPathname = pathname.replace(`/${currentLocale}`, `/${newLocale}`)
    router.push(newPathname)
    setIsLanguageOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link
            href={`/${currentLocale}`}
            className="relative flex items-center justify-center w-32 h-full hover:opacity-80 transition-opacity"
          >
            <Image 
              src="/icon.png" 
              alt="Logo" 
              fill
              className="object-contain " 
              priority
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href={`/${currentLocale}`}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {t("nav.home")}
            </Link>
            <Link
              href={`/${currentLocale}/items`}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {t("nav.items")}
            </Link>
            <Link
              href={`/${currentLocale}/about`}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {t("nav.about")}
            </Link>
            <Link
              href={`/${currentLocale}/terms`}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {t("nav.terms")}
            </Link>
            <Link
              href={`/${currentLocale}/cart`}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {t("nav.cart")}
            </Link>
            <Link
              href={`/${currentLocale}/contact`}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {t("nav.contact")}
            </Link>
            <Link
              href={`/${currentLocale}/profile`}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {t("nav.profile")}
            </Link>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="p-2 rounded-lg bg-card hover:bg-muted transition-colors flex items-center gap-2"
                aria-label="Select language"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium uppercase">{currentLocale}</span>
              </button>
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                  <button
                    onClick={() => switchLanguage("en")}
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-muted transition-colors ${
                      currentLocale === "en" ? "bg-primary text-primary-foreground" : ""
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => switchLanguage("bn")}
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-muted transition-colors ${
                      currentLocale === "bn" ? "bg-primary text-primary-foreground" : ""
                    }`}
                  >
                    বাংলা
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg bg-card hover:bg-muted transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center justify-center gap-4 pb-4 border-t border-border pt-4">
          <Link href={`/${currentLocale}`} className="text-xs font-medium">
            {t("nav.home")}
          </Link>
          <Link href={`/${currentLocale}/items`} className="text-xs font-medium">
            {t("nav.items")}
          </Link>
          <Link href={`/${currentLocale}/about`} className="text-xs font-medium">
            {t("nav.about")}
          </Link>
          <Link href={`/${currentLocale}/terms`} className="text-xs font-medium">
            {t("nav.terms")}
          </Link>
          <Link href={`/${currentLocale}/cart`} className="text-xs font-medium">
            {t("nav.cart")}
          </Link>
        </div>
      </div>
    </nav>
  )
}