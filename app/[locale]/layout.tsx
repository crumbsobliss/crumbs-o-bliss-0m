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
import details from "@/config/details.json"

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
  metadataBase: new URL(details.store.fullDomain),
  title: {
    default: `${details.store.name} | Artisan Pizza & Cake Bakery`,
    template: `%s | ${details.store.name}`,
  },
  description: `${details.store.name} - ${details.store.slogan}. Fresh artisanal pizzas and custom cakes in ${details.location.state}. Contact: ${details.contact.primaryPhone}`,
  keywords: details.seo.keywords,
  authors: [{ name: `${details.store.name} Team` }],
  creator: details.store.name,
  publisher: details.store.name,
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: `${details.store.name} | Artisan Pizza & Cake Bakery`,
    description: details.store.slogan,
    url: details.store.fullDomain,
    siteName: details.store.name,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: `${details.store.name} - ${details.store.slogan}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${details.store.name} | Artisan Pizza & Cake Bakery`,
    description: details.store.slogan,
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
