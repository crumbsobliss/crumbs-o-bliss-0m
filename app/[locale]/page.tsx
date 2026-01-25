import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { items } from "@/lib/items";
import {
  ArrowRight,
  Star,
  Leaf,
  Clock,
  Heart,
  Sparkles,
  Award,
  Users,
  MapPin,
  Instagram,
  ChefHat,
  Coffee,
  Croissant,
  Cookie,
  UtensilsCrossed,
  Wheat,
} from "lucide-react";
import CircularGallery from "@/components/CircularGallery";
import {
  Inter,
  Playfair_Display,
  Dancing_Script,
  Cinzel,
  Montserrat,
  Lora,
  Oswald,
} from "next/font/google";

// --- Font Configurations (Variable Fonts for Performance) ---
// Using variable fonts reduces the number of network requests needed for different weights.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: 'swap' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: 'swap' });
const dancing = Dancing_Script({ subsets: ["latin"], variable: "--font-dancing", display: 'swap' });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel", display: 'swap' });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: 'swap' });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora", display: 'swap' });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald", display: 'swap' });

// --- SEO: Metadata ---
export const metadata: Metadata = {
  title: "Crumbs O' Bliss | Artisan Bakery in Shyamnagar",
  description:
    "Experience the magic of 24h fermented sourdough, artisanal pastries, and fresh organic baked goods. Visit Crumbs O' Bliss in Shyamnagar, West Bengal.",
  keywords: ["Bakery", "Sourdough", "Croissant", "Shyamnagar", "Organic Bakery", "Artisan Bread", "West Bengal Cafe"],
  authors: [{ name: "Crumbs O' Bliss" }],
  openGraph: {
    title: "Crumbs O' Bliss | Artisan Bakery",
    description: "Fresh, honest, small-batch baked goods made with time-tested techniques.",
    url: "https://crumbs-o-bliss.com", 
    siteName: "Crumbs O' Bliss",
    images: [
      {
        url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80", 
        width: 1200,
        height: 630,
        alt: "Crumbs O' Bliss Artisan Bread",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crumbs O' Bliss | Artisan Bakery",
    description: "Taste the passion in every bite. 100% Organic, small-batch bakery.",
    images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#e1dcd5', // Set to match your brand/hero background
};

// --- SEO: JSON-LD Structured Data ---
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  "name": "Crumbs O' Bliss",
  "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80",
  "description": "Artisan bakery offering fresh sourdough, pastries, and organic coffee.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "78 Baker Street, Near Central Park",
    "addressLocality": "Shyamnagar",
    "addressRegion": "West Bengal",
    "postalCode": "743127",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 22.8333, 
    "longitude": 88.3667
  },
  "url": "https://crumbs-o-bliss.com",
  "telephone": "+919876543210",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "07:00",
      "closes": "20:00"
    }
  ],
  "priceRange": "₹₹",
  "servesCuisine": "Bakery"
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();

  const featuredItems = items.filter((item) =>
    ["sourdough-bread", "macaron-assortment", "chocolate-croissant"].includes(
      item.slug,
    ),
  );

  const bakeryGalleryItems = [
    { image: "/assets/products/landing-card-1.png", text: "Classic Sourdough" },
    { image: "/assets/products/landing-card-2.png", text: "Chocolate Croissant" },
    { image: "/assets/products/landing-card-3.png", text: "Blueberry Muffin" },
    { image: "/assets/products/landing-card-4.png", text: "Cinnamon Roll" },
    { image: "/assets/products/landing-card-5.png", text: "Almond Croissant" },
  ];

  // A simple base64 shimmer for image placeholders (optional, if blurDataURL not generated at build time)
  // For production, suggest using a library like 'plaiceholder' or similar for dynamic blurDataURLs.
  const shimmer = (w: number, h: number) => `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#f6f7f8" offset="20%" />
          <stop stop-color="#edeef1" offset="50%" />
          <stop stop-color="#f6f7f8" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#f6f7f8" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
    </svg>`;
  const toBase64 = (str: string) =>
    typeof window === "undefined"
      ? Buffer.from(str).toString("base64")
      : window.btoa(str);

  return (
    <div
      className={`w-full overflow-x-hidden bg-background ${inter.variable} ${playfair.variable} ${dancing.variable} ${cinzel.variable} ${montserrat.variable} ${lora.variable} ${oswald.variable} font-sans`}
    >
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative min-h-[95vh] flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-[var(--hero-bg-start)] via-[var(--hero-bg-via)] to-[var(--hero-bg-end)] transition-colors duration-500">
        {/* --- BACKGROUND ATMOSPHERE --- */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--blob-1)] rounded-full blur-3xl animate-pulse opacity-30 will-change-transform" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--blob-2)] rounded-full blur-3xl animate-pulse delay-700 opacity-30 will-change-transform" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[var(--blob-3)] rounded-full blur-3xl animate-pulse delay-1000 opacity-20 will-change-transform" />
        </div>

        {/* Floating Bakery Icon Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden" aria-hidden="true">
          <Croissant className="absolute top-10 left-[10%] w-24 h-24 rotate-12 animate-float" />
          <Cookie className="absolute top-40 right-[15%] w-16 h-16 -rotate-12 animate-float-delayed" />
          <UtensilsCrossed className="absolute bottom-32 left-[20%] w-32 h-32 rotate-45 animate-pulse-slow" />
          <ChefHat className="absolute top-1/2 right-[5%] w-20 h-20 -rotate-12 animate-float" />
          <Wheat className="absolute bottom-10 right-[30%] w-40 h-40 -rotate-12 opacity-50" />
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="relative z-10 max-w-7xl mx-auto text-center pt-10">
          
          {/* Badge */}
          <div
            className={`group inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[var(--badge-bg)] backdrop-blur-md border border-[var(--badge-border)] text-[var(--badge-text)] font-semibold text-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 shadow-lg hover:shadow-[var(--badge-shadow)] transition-all cursor-default font-montserrat`}
          >
            <div className="relative">
              <Star className="w-4 h-4 fill-[var(--badge-icon)] text-[var(--badge-icon)] animate-spin-slow" />
              <div className="absolute inset-0 bg-[var(--badge-icon)] blur-sm opacity-50 animate-pulse" />
            </div>
            <span className="tracking-widest uppercase text-xs font-bold">
              {t("hero.cta")}
            </span>
            <Sparkles className="w-4 h-4 text-[var(--badge-icon)] group-hover:rotate-12 transition-transform" />
          </div>

          {/* Heading */}
          <div className="relative inline-block">
            <Wheat className="hidden md:block absolute -left-16 top-1/2 -translate-y-1/2 w-12 h-12 text-[var(--divider-color)] opacity-60 -rotate-45" />
            <Wheat className="hidden md:block absolute -right-16 top-1/2 -translate-y-1/2 w-12 h-12 text-[var(--divider-color)] opacity-60 rotate-45 flip-x" />

            <h1
              className={`text-6xl md:text-9xl font-black mb-6 text-balance bg-primary  bg-clip-text text-transparent tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 drop-shadow-sm font-cinzel`}
            >
              {t("hero.title")}
            </h1>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 mb-8 animate-in fade-in duration-1000 delay-400 opacity-80" aria-hidden="true">
            <div className="h-px w-12 md:w-24 bg-gradient-to-r from-transparent via-[var(--divider-color)] to-[var(--divider-color)]" />
            <Leaf className="w-5 h-5 text-[var(--divider-color)]" />
            <div className="h-px w-12 md:w-24 bg-gradient-to-l from-transparent via-[var(--divider-color)] to-[var(--divider-color)]" />
          </div>

          {/* Subtitle */}
          <p
            className={`text-2xl md:text-4xl text-[var(--text-body-color)] mb-14 text-balance max-w-4xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 font-dancing`}
          >
            {t("hero.subtitle")}
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700 font-oswald`}
          >
            <Link
              href={`/${locale}/items`}
              className="group relative flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[var(--btn-primary-start)] to-[var(--btn-primary-end)] text-white font-bold rounded-full hover:brightness-110 transition-all hover:scale-105 shadow-2xl shadow-[var(--btn-shadow)] overflow-hidden uppercase tracking-widest ring-offset-2 hover:ring-2 ring-[var(--btn-primary-start)]"
            >
              <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />
              <span className="relative z-10 text-lg">Shop Collection</span>
              <div className="relative z-10 p-1 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href={`/${locale}/about`}
              className="group flex items-center gap-2 px-10 py-5 bg-[var(--badge-bg)] backdrop-blur-sm border-2 border-[var(--badge-border)] text-[var(--badge-text)] font-bold rounded-full hover:bg-[var(--badge-bg)] hover:brightness-105 transition-all hover:scale-105 shadow-lg text-lg tracking-widest uppercase"
            >
              <span>Our Story</span>
              <ChefHat className="w-5 h-5 text-[var(--badge-icon)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </Link>
          </div>

          {/* --- FLOATING GALLERY (LCP Optimization) --- */}
          <div className="mt-24 relative h-64 md:h-80 animate-in fade-in duration-1000 delay-1000 pointer-events-none md:pointer-events-auto perspective-1000">
            {/* Image 1: Main LCP Candidate - High Priority */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-48 h-48 md:w-72 md:h-72 rounded-full md:rounded-[2rem] overflow-hidden shadow-2xl z-20 border-4 border-white dark:border-stone-800 animate-float bg-gray-200">
              <Image
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80"
                alt="Fresh artisan sourdough bread loaf"
                fill
                priority={true} // Priority loading for LCP
                sizes="(max-width: 768px) 192px, 288px" // Accurate sizes
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(300, 300))}`}
                className="object-cover hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute bottom-4 right-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg rotate-[-5deg] z-30 font-sans border border-yellow-200">
                FRESH
              </div>
            </div>

            {/* Image 2: Secondary - Priority but smaller */}
            <div className="absolute left-[5%] md:left-[15%] top-12 w-36 h-36 md:w-56 md:h-56 rounded-full md:rounded-[2rem] overflow-hidden shadow-xl -rotate-6 z-10 border-4 border-white dark:border-stone-800 animate-float-delayed opacity-90 hover:opacity-100 hover:z-30 hover:rotate-0 transition-all bg-gray-200">
              <Image
                src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80"
                alt="Buttery croissants"
                fill
                priority={true}
                sizes="(max-width: 768px) 144px, 224px"
                className="object-cover hover:scale-110 transition-transform duration-700"
              />
            </div>

            {/* Image 3: Secondary - Priority but smaller */}
            <div className="absolute right-[5%] md:right-[15%] top-16 w-36 h-36 md:w-56 md:h-56 rounded-full md:rounded-[2rem] overflow-hidden shadow-xl rotate-6 z-10 border-4 border-white dark:border-stone-800 animate-float-delayed opacity-90 hover:opacity-100 hover:z-30 hover:rotate-0 transition-all bg-gray-200">
              <Image
                src="https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600&q=80"
                alt="Assorted sweet pastries"
                fill
                priority={true}
                sizes="(max-width: 768px) 144px, 224px"
                className="object-cover hover:scale-110 transition-transform duration-700"
              />
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-30 rotate-180">
          <svg
            className="relative block w-full h-16 md:h-24"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-white dark:fill-background"
            ></path>
          </svg>
        </div>
      </section>

      {/* --- PHILOSOPHY STATS --- */}
      <section className="py-16 bg-white dark:bg-background border-y border-[var(--lp-card-border)]/50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            {
              icon: Leaf,
              label: "100% Organic",
              color: "text-green-600 dark:text-green-400",
              bgColor: "bg-green-50 dark:bg-green-950/30",
            },
            {
              icon: Clock,
              label: "24h Fermented",
              color: "text-[var(--badge-icon)]",
              bgColor: "bg-[var(--blob-1)]/30",
            },
            {
              icon: ChefHat,
              label: "Small Batch",
              color: "text-rose-600 dark:text-rose-400",
              bgColor: "bg-rose-50 dark:bg-rose-950/30",
            },
            {
              icon: Award,
              label: "Master Bakers",
              color: "text-orange-600 dark:text-orange-400",
              bgColor: "bg-orange-50 dark:bg-orange-950/30",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center gap-4 group cursor-pointer"
            >
              <div
                className={`w-20 h-20 rounded-2xl ${stat.bgColor} flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shadow-lg group-hover:shadow-xl`}
              >
                <stat.icon className={`w-10 h-10 ${stat.color}`} />
              </div>
              <span
                className={`text-base font-bold uppercase tracking-widest text-[var(--text-body-color)] font-oswald`}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Circular Gallery Section */}
      <div
        style={{ height: "400px", position: "relative" }}
        className="bg-gradient-to-b from-white to-[var(--feat-bg-start)] dark:from-background dark:to-[var(--feat-bg-start)]"
      >
        <CircularGallery bend={3} items={bakeryGalleryItems} />
      </div>

      {/* --- FEATURED COLLECTIONS --- */}
      <section className="py-28 md:py-36 px-4 bg-gradient-to-b from-[var(--feat-bg-start)] to-[var(--feat-bg-end)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
            <div className="max-w-2xl">
              <div
                className={`inline-block mb-4 px-4 py-1 bg-[var(--blob-1)]/50 text-[var(--badge-text)] text-xs font-bold uppercase tracking-widest rounded-full font-montserrat`}
              >
                Featured Collection
              </div>
              <h2
                className={`text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-[var(--text-heading-grad-from)] to-[var(--text-heading-grad-via)] bg-clip-text text-transparent leading-tight font-playfair`}
              >
                {t("items.title")}
              </h2>
              <p
                className={`text-xl md:text-2xl text-[var(--text-body-color)] leading-relaxed italic font-lora`}
              >
                {t("items.description")}
              </p>
            </div>
            <Link
              href={`/${locale}/items`}
              className={`group text-[var(--badge-text)] font-bold flex items-center gap-2 hover:gap-4 transition-all text-lg font-montserrat`}
            >
              View All Items
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredItems.map((item, index) => (
              <Link
                key={item.slug}
                href={`/${locale}/items/${item.slug}`}
                className="group relative bg-[var(--lp-card-bg)] rounded-3xl overflow-hidden border-2 border-[var(--lp-card-border)] hover:border-[var(--lp-card-border-hover)] hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 flex flex-col"
              >
                <div className="aspect-[4/5] relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={item.image}
                    alt={item.name.en}
                    fill
                    loading="lazy" // Explicitly lazy loaded as these are below fold
                    // Specific sizes for grid items
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Floating Price Tag */}
                  <div
                    className={`absolute top-6 right-6 bg-[var(--lp-card-bg)]/95 backdrop-blur-md text-[var(--badge-text)] font-black px-5 py-3 rounded-2xl shadow-xl border border-[var(--lp-card-border)] group-hover:scale-110 transition-transform font-montserrat`}
                  >
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
                      From
                    </span>
                    <span className="text-xl">₹{item.price}</span>
                  </div>

                  {/* Badge */}
                  <div
                    className={`absolute top-6 left-6 bg-[var(--badge-icon)] text-white font-bold px-4 py-2 rounded-full text-xs uppercase tracking-wider shadow-lg font-oswald`}
                  >
                    Bestseller
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {item.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-[var(--blob-1)]/30 text-[var(--badge-text)] border border-[var(--lp-card-border)] font-inter`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3
                    className={`text-2xl font-bold mb-4 text-[var(--text-heading-grad-from)] group-hover:text-[var(--text-heading-grad-via)] transition-colors leading-tight font-cinzel`}
                  >
                    {locale === "en" ? item.name.en : item.name.bn}
                  </h3>
                  <p
                    className={`text-[var(--text-body-color)] line-clamp-3 text-base leading-relaxed mb-6 flex-1 font-lora`}
                  >
                    {locale === "en"
                      ? item.description.en
                      : item.description.bn}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-[var(--lp-card-border)] mt-auto">
                    <span
                      className={`text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 font-inter`}
                    >
                      <span className="w-2 h-2 rounded-full bg-[var(--badge-icon)]" />
                      {item.calories} Cal
                    </span>
                    <div className="w-12 h-12 rounded-full bg-[var(--blob-1)]/50 flex items-center justify-center group-hover:bg-[var(--btn-primary-start)] group-hover:text-white transition-all duration-300 shadow-md">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section className="py-24 px-4 bg-white dark:bg-background overflow-hidden">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <div
            className={`inline-block mb-4 px-4 py-1 bg-rose-100 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100 text-xs font-bold uppercase tracking-widest rounded-full font-montserrat`}
          >
            Customer Love
          </div>
          <h2
            className={`text-4xl md:text-6xl font-black mb-4 text-foreground font-playfair`}
          >
            What Our Family Says
          </h2>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {[
            {
              name: "Priya Sharma",
              role: "Food Blogger",
              image:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
              quote:
                "The sourdough here is absolutely divine. You can taste the passion in every bite!",
              rating: 5,
            },
            {
              name: "Rahul Mehta",
              role: "Local Chef",
              image:
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
              quote:
                "Finally, an authentic bakery that respects traditional methods. Their croissants are perfection.",
              rating: 5,
            },
            {
              name: "Anita Desai",
              role: "Regular Customer",
              image:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
              quote:
                "I drive 30 minutes just for their macarons. Worth every second of the journey!",
              rating: 5,
            },
          ].map((testimonial, i) => (
            <div
              key={i}
              className="group bg-gradient-to-br from-[var(--hero-bg-start)] to-[var(--hero-bg-via)] p-8 rounded-3xl border-2 border-[var(--lp-card-border)] hover:border-[var(--badge-icon)] transition-colors hover:shadow-2xl relative"
            >
              <div className="absolute top-8 right-8 text-[var(--blob-1)]/20">
                <Heart className="w-12 h-12 fill-current" />
              </div>
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 fill-[var(--badge-icon)] text-[var(--badge-icon)]"
                  />
                ))}
              </div>
              <p
                className={`text-[var(--text-body-color)] text-lg mb-8 leading-relaxed italic font-lora`}
              >
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[var(--badge-icon)] bg-gray-200">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p
                    className={`font-bold text-foreground text-lg font-cinzel`}
                  >
                    {testimonial.name}
                  </p>
                  <p
                    className={`text-xs text-muted-foreground uppercase tracking-wider font-montserrat`}
                  >
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- BRAND STORY --- */}
      <section className="relative py-32 md:py-48 px-4 bg-gradient-to-br from-[var(--brand-bg-start)] via-[var(--brand-bg-via)] to-[var(--brand-bg-end)] text-white overflow-hidden attachment-fixed bg-fixed">
        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
          <Image
            src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80"
            alt="texture"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-ping delay-0" />
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-white/30 rounded-full animate-ping delay-[2000ms]" />
          <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-white/30 rounded-full animate-ping delay-[4000ms]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <Award className="w-20 h-20 mx-auto mb-8 text-[var(--badge-icon)] animate-bounce" />
          <h2
            className={`text-5xl md:text-8xl font-black mb-12 leading-tight font-cinzel`}
          >
            {t("about.title")}
          </h2>
          <p
            className={`text-2xl md:text-4xl mb-16 leading-relaxed font-light text-white/90 font-dancing`}
          >
            "{t("about.description")}"
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4 mb-16 opacity-70">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-[var(--divider-color)]" />
            <Sparkles className="w-6 h-6 text-[var(--divider-color)] animate-spin-slow" />
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-[var(--divider-color)]" />
          </div>

          <Link
            href={`/${locale}/about`}
            className={`group inline-block px-14 py-6 bg-white dark:bg-stone-800 text-[var(--badge-text)] dark:text-amber-100 font-black rounded-full hover:scale-110 transition-all shadow-2xl hover:shadow-white/20 text-xl tracking-widest relative overflow-hidden uppercase font-oswald`}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[var(--btn-primary-start)] to-[var(--btn-primary-end)] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative z-10 group-hover:text-white transition-colors">
              Read Our Philosophy
            </span>
          </Link>
        </div>
      </section>

      {/* --- VISIT US SECTION --- */}
      <section className="py-24 px-4 bg-gradient-to-b from-white dark:from-background to-[var(--hero-bg-start)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div
                className={`inline-block mb-4 px-4 py-1 bg-[var(--blob-1)]/50 text-[var(--badge-text)] text-xs font-bold uppercase tracking-widest rounded-full font-montserrat`}
              >
                Visit Us
              </div>
              <h2
                className={`text-4xl md:text-7xl font-black mb-6 text-foreground font-playfair`}
              >
                Experience the Magic
              </h2>
              <p
                className={`text-xl text-[var(--text-body-color)] mb-10 leading-relaxed font-lora`}
              >
                Come visit our bakery and watch master bakers craft each item
                with love and precision. The aroma alone is worth the trip.
              </p>

              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-5 p-4 rounded-xl bg-white/50 dark:bg-black/20 hover:bg-white transition-colors">
                  <MapPin className="w-8 h-8 text-[var(--badge-icon)] flex-shrink-0 mt-1" />
                  <div>
                    <p
                      className={`font-bold text-foreground text-lg font-cinzel`}
                    >
                      Shyamnagar, West Bengal
                    </p>
                    <p className="text-muted-foreground">
                      78 Baker Street, Near Central Park, India
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-5 p-4 rounded-xl bg-white/50 dark:bg-black/20 hover:bg-white transition-colors">
                  <Clock className="w-8 h-8 text-[var(--badge-icon)] flex-shrink-0 mt-1" />
                  <div>
                    <p
                      className={`font-bold text-foreground text-lg font-cinzel`}
                    >
                      Open Daily
                    </p>
                    <p className="text-muted-foreground">
                      7:00 AM - 8:00 PM (Happy Hours: 6-8 PM)
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Link
                  href={`/${locale}/contact`}
                  className={`inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--btn-primary-start)] to-[var(--btn-primary-end)] text-white font-bold rounded-full hover:scale-105 transition-transform shadow-xl uppercase tracking-wider font-oswald`}
                >
                  Get Directions
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="p-4 rounded-full border-2 border-[var(--badge-text)] text-[var(--badge-text)] hover:bg-[var(--badge-text)] hover:text-white transition-all">
                  <Instagram className="w-6 h-6" />
                </button>
              </div>

              {/* Mini Gallery Grid */}
              <div className="mt-12 grid grid-cols-3 gap-4">
                {[
                  "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=300&q=80",
                  "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&q=80",
                  "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=300&q=80",
                ].map((src, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer bg-gray-200"
                  >
                    <Image
                      src={src}
                      alt="Bakery Vibes"
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 33vw, 150px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-stone-800 bg-gray-200">
              <Image
                src="https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=800&q=80"
                alt="Bakery interior"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover hover:scale-110 transition-transform duration-[2s]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Coffee className="w-6 h-6" />
                  <span
                    className={`text-lg uppercase tracking-widest font-oswald`}
                  >
                    Coffee Bar
                  </span>
                </div>
                <p
                  className={`text-3xl font-bold leading-tight font-playfair`}
                >
                  Fresh Brews &<br />
                  Warm Hugs
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}