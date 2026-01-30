'use client'

import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
// Switched to standard img to avoid build resolution errors in preview
// import Image from 'next/image' 
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
  Menu,
  X,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCart } from '@/lib/cart-context'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const t = useTranslations()
  const router = useRouter()
  const pathname = usePathname()
  const { getItemCount } = useCart()
  const [mounted, setMounted] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  
  // New state for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  // Animation variants for the mobile menu
  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
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
            <img 
              src="/icon.png" 
              alt="Logo" 
              className="object-contain h-10 w-auto" 
            />
          </Link>

          {/* Navigation Links (Desktop) */}
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

          {/* Right Side Controls (Desktop & Mobile Header) */}
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
<div className="hidden sm:flex items-center bg-muted p-1 rounded-full border border-border">
  <button
    onClick={() => switchLanguage("en")}
    className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
      currentLocale === "en" 
        ? "bg-primary text-primary-foreground shadow-sm" 
        : "text-muted-foreground hover:text-foreground"
    }`}
  >
    EN
  </button>
  <button
    onClick={() => switchLanguage("bn")}
    className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
      currentLocale === "bn" 
        ? "bg-primary text-primary-foreground shadow-sm" 
        : "text-muted-foreground hover:text-foreground"
    }`}
  >
    BN
  </button>
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

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors text-foreground"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Animated Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="md:hidden overflow-hidden border-t border-border"
            >
              <div className="flex flex-col gap-4 py-6 px-2">
                <Link
                  href={`/${currentLocale}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
                >
                  <Home className="w-5 h-5" />
                  {t('nav.home')}
                </Link>
                <Link
                  href={`/${currentLocale}/items`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
                >
                  <Package className="w-5 h-5" />
                  {t('nav.items')}
                </Link>
                <Link
                  href={`/${currentLocale}/cart`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors relative"
                >
                  <div className="relative">
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  {t('nav.cart')}
                </Link>
                <Link
                  href={`/${currentLocale}/profile`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
                >
                  <User className="w-5 h-5" />
                  {t('nav.profile')}
                </Link>
                <Link
                  href={`/${currentLocale}/customization`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
                >
                  <Sparkles className="w-5 h-5" />
                  Custom
                </Link>
                <Link
                  href={`/${currentLocale}/about`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
                >
                  <Info className="w-5 h-5" />
                  {t('nav.about')}
                </Link>
                <Link
                  href={`/${currentLocale}/contact`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  {t('nav.contact')}
                </Link>
                
                {/* Mobile Language Switcher (since hidden in header on mobile) */}
                <div className="flex items-center gap-3 p-2 border-t border-border mt-2 pt-4">
                    <Globe className="w-5 h-5" />
                    <div className="flex gap-2">
                        <button 
                            onClick={() => switchLanguage("en")}
                            className={`px-3 py-1 text-xs rounded-full border ${currentLocale === "en" ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}
                        >
                            English
                        </button>
                        <button 
                            onClick={() => switchLanguage("bn")}
                            className={`px-3 py-1 text-xs rounded-full border ${currentLocale === "bn" ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}
                        >
                            বাংলা
                        </button>
                    </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}