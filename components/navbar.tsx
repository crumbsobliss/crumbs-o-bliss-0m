'use client'

import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Moon,
  Sun,
  Globe,
  ShoppingCart,
  Home,
  Package,
  User,
  Sparkles,
  Info,
  Mail,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCart } from '@/lib/cart-context'

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const t = useTranslations()
  const router = useRouter()
  const pathname = usePathname()
  const { getItemCount } = useCart()
  const [mounted, setMounted] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      setCartCount(getItemCount())
    }
  }, [mounted, getItemCount])

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
              className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              {t('nav.home')}
            </Link>
            <Link
              href={`/${currentLocale}/items`}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <Package className="w-4 h-4" />
              {t('nav.items')}
            </Link>
            <Link
              href={`/${currentLocale}/cart`}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors relative flex items-center gap-1"
            >
              <ShoppingCart className="w-4 h-4" />
              {t('nav.cart')}
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              href={`/${currentLocale}/profile`}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <User className="w-4 h-4" />
              {t('nav.profile')}
            </Link>
            <Link
              href={`/${currentLocale}/customization`}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-4 h-4" />
              Custom
            </Link>
            <Link
              href={`/${currentLocale}/about`}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <Info className="w-4 h-4" />
              {t('nav.about')}
            </Link>

            <Link
              href={`/${currentLocale}/contact`}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <Mail className="w-4 h-4" />
              {t('nav.contact')}
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
        <div className="md:hidden flex items-center justify-center gap-4 pb-4 border-t border-border pt-4 flex-wrap">
          <Link
            href={`/${currentLocale}`}
            className="text-xs font-medium flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Home className="w-3 h-3" />
            {t('nav.home')}
          </Link>
          <Link
            href={`/${currentLocale}/items`}
            className="text-xs font-medium flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Package className="w-3 h-3" />
            {t('nav.items')}
          </Link>
          <Link
            href={`/${currentLocale}/about`}
            className="text-xs font-medium flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Info className="w-3 h-3" />
            {t('nav.about')}
          </Link>
          <Link
            href={`/${currentLocale}/cart`}
            className="text-xs font-medium flex items-center gap-1 hover:text-primary transition-colors relative"
          >
            <ShoppingCart className="w-3 h-3" />
            {t('nav.cart')}
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  )
}
