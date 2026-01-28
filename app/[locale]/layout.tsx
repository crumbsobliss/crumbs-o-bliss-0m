import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing" // Import shared routing config
import type { ReactNode } from "react"
import "../globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ThemeProvider from "@/components/theme-provider"
import { CartProvider } from "@/lib/cart-context"

// Optimize fonts: Use 'swap' to ensure text is visible during font load
// and define variables for CSS usage
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

// Viewport settings for theme colors and responsiveness
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" }, // Matches standard shadcn/ui dark background
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL("https://crumbs-o-bliss.com"), // Replaces localhost for social images
  title: {
    default: "Crumbs O' Bliss | Artisan Bakery",
    template: "%s | Crumbs O' Bliss",
  },
  description:
    "Fresh, honest, small-batch baked goods made with time-tested techniques and thoughtfully sourced ingredients. Experience the best sourdough in Shyamnagar.",
  keywords: ["Bakery", "Sourdough", "Croissant", "Shyamnagar", "West Bengal", "Artisan Bread", "Organic Bakery", "Cafe"],
  authors: [{ name: "Crumbs O' Bliss Team" }],
  creator: "Crumbs O' Bliss",
  publisher: "Crumbs O' Bliss",
  icons: {
    icon: "/icon.png", // Simplified to single icon as requested
    apple: "/icon.png", // Fallback for Apple devices
  },
  openGraph: {
    title: "Crumbs O' Bliss | Artisan Bakery",
    description: "Fresh, honest, small-batch baked goods made with time-tested techniques.",
    url: "https://crumbs-o-bliss.com",
    siteName: "Crumbs O' Bliss",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png", // Ensure you have this image in /public
        width: 1200,
        height: 630,
        alt: "Crumbs O' Bliss Artisan Bakery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crumbs O' Bliss | Artisan Bakery",
    description: "Fresh, honest, small-batch baked goods made with time-tested techniques.",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

// Use the shared routing config to generate static params
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Ensure the locale is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} antialiased font-sans`}>
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <CartProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </CartProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
