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
  MapPin,
  Instagram,
  ChefHat,
  Coffee,
  Croissant,
  Cookie,
  UtensilsCrossed,
  Wheat,
  Play,
  Film,
  Quote
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
  Great_Vibes,
  Merriweather,
  Syne,
  Prata,
  Space_Grotesk
} from "next/font/google";


// --- 1. Font Configurations (12 Fonts) ---
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: 'swap' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: 'swap' });
const dancing = Dancing_Script({ subsets: ["latin"], variable: "--font-dancing", display: 'swap' });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel", display: 'swap' });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: 'swap' });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora", display: 'swap' });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald", display: 'swap' });
const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-great-vibes", display: 'swap' });
const merriweather = Merriweather({ weight: ["300", "400", "700"], subsets: ["latin"], variable: "--font-merriweather", display: 'swap' });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne", display: 'swap' });
const prata = Prata({ weight: "400", subsets: ["latin"], variable: "--font-prata", display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", display: 'swap' });


// --- SEO: Metadata ---
export const metadata: Metadata = {
  title: "Crumbs O' Bliss | Artisan Pizza & Cake Studio",
  description:
    "Experience the magic of wood-fired pizzas, artisanal cakes, and fresh organic baked goods in Shyamnagar.",
  keywords: ["Bakery", "Sourdough", "Pizza", "Cake", "Shyamnagar", "Organic Bakery", "Artisan Bread", "West Bengal Cafe", "Bakery Video"],
  authors: [{ name: "Crumbs O' Bliss" }],
  openGraph: {
    title: "Crumbs O' Bliss | Artisan Pizza & Cakes",
    description: "Fresh, honest, small-batch pizzas and cakes made with passion.",
    url: "https://crumbs-o-bliss.com", 
    siteName: "Crumbs O' Bliss",
    images: [
      {
        url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80", 
        width: 1200,
        height: 630,
        alt: "Crumbs O' Bliss Artisan Pizza",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crumbs O' Bliss | Artisan Pizza & Cakes",
    description: "Taste the passion in every bite. 100% Organic, small-batch bakery.",
    images: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&q=80"],
  },
  robots: {
    index: true,
    follow: true,
  },
};


export const viewport: Viewport = {
  themeColor: '#0f1f1b', 
  width: 'device-width',
  initialScale: 1,
};


// --- SEO: JSON-LD Structured Data ---
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Bakery",
      "name": "Crumbs O' Bliss",
      "image": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80",
      "description": "Artisan bakery offering fresh sourdough, pizzas, cakes, and organic coffee.",
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
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "07:00",
          "closes": "20:00"
        }
      ],
      "priceRange": "₹₹",
      "servesCuisine": "Bakery"
    },
    {
      "@type": "VideoObject",
      "name": "Wood Fired Pizza Process",
      "description": "Watch our master bakers create artisanal pizza.",
      "thumbnailUrl": "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=1200&q=80",
      "uploadDate": "2024-01-01",
      "contentUrl": "https://assets.mixkit.co/videos/preview/mixkit-chef-putting-pizza-in-oven-41924-large.mp4"
    }
  ]
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


  const shimmer = (w: number, h: number) => `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#333" offset="20%" />
          <stop stop-color="#222" offset="50%" />
          <stop stop-color="#333" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#333" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
    </svg>`;
  const toBase64 = (str: string) =>
    typeof window === "undefined"
      ? Buffer.from(str).toString("base64")
      : window.btoa(str);


  return (
    <div
      className={`
        w-full overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]
        ${inter.variable} ${playfair.variable} ${dancing.variable} ${cinzel.variable}
        ${montserrat.variable} ${lora.variable} ${oswald.variable} ${greatVibes.variable}
        ${merriweather.variable} ${syne.variable} ${prata.variable} ${spaceGrotesk.variable}
        font-sans transition-colors duration-500
      `}
    >
      {/* --- INJECTED COLOR SYSTEM --- */}
      <style>{`
        /* Bakery color system for light mode */
        :root {
          --primary: #164a3e;
          --accent: #acd038;
          --highlight: #fcb042;
          --background: #ffffff;
          --text: #164a3e;
          --border-light: #e8e8e8;


          --foreground: var(--text);
          --card: #fafaf9;
          --card-foreground: var(--text);
          --popover: #ffffff;
          --popover-foreground: var(--text);
          --primary-foreground: #ffffff;
          --secondary: #f5f5f5;
          --secondary-foreground: var(--text);
          --muted: #e8e8e8;
          --muted-foreground: #666666;
          --accent-foreground: #ffffff;
          --destructive: #ef4444;
          --destructive-foreground: #ffffff;
          --border: var(--border-light);
          --input: var(--border-light);
          --ring: var(--primary);
          --chart-1: #164a3e;
          --chart-2: #acd038;
          --chart-3: #fcb042;
          --chart-4: #87ceeb;
          --chart-5: #f0a0a0;
          --radius: 0.625rem;
          --sidebar: #fafaf9;
          --sidebar-foreground: var(--text);
          --sidebar-primary: var(--primary);
          --sidebar-primary-foreground: #ffffff;
          --sidebar-accent: var(--accent);
          --sidebar-accent-foreground: #000000;
          --sidebar-border: var(--border-light);
          --sidebar-ring: var(--primary);


          /* --- LANDING PAGE SPECIFIC VARIABLES (Light Mode) --- */
          --hero-bg-start: #fffbeb; /* amber-50 */
          --hero-bg-via: #fff7ed;   /* orange-50 */
          --hero-bg-end: #fff1f2;   /* rose-50 */
          
          --blob-1: #fde68a; /* amber-200 */
          --blob-2: #fecdd3; /* rose-200 */
          --blob-3: #fed7aa; /* orange-200 */


          --text-heading-grad-from: #1eb300; /* amber-900 */
          --text-heading-grad-via: #00ad1d;  /* orange-800 */
          --text-heading-grad-to: #881337;   /* rose-900 */
          
          --text-body-color: #374151; /* gray-700 */
          --divider-color: #fbbf24;   /* amber-400 */
          
          --badge-bg: rgba(255, 255, 255, 0.8);
          --badge-border: #fde68a; /* amber-200 */
          --badge-text: #78350f;   /* amber-900 */
          --badge-icon: #f59e0b;   /* amber-500 */
          
          --btn-primary-start: #d97706; /* amber-600 */
          --btn-primary-end: #ea580c;   /* orange-600 */
          --btn-shadow: rgba(245, 158, 11, 0.5);
          
          --lp-card-bg: #ffffff;
          --lp-card-border: #fef3c7; /* amber-100 */
          --lp-card-border-hover: #fcd34d; /* amber-300 */
          
          --feat-bg-start: #ffffff;
          --feat-bg-end: rgba(255, 251, 235, 0.3); /* amber-50/30 */
          
          --brand-bg-start: #78350f; /* amber-900 */
          --brand-bg-via: #7c2d12;   /* orange-900 */
          --brand-bg-end: #881337;   /* rose-900 */
        }


        /* Bakery color system for dark mode */
        .dark {
          --primary: #acd038;
          --accent: #fcb042;
          --highlight: #fcb042;
          --background: #0f1f1b;
          --text: #eaf5f2;
          --border-light: #1f3a33;


          --foreground: var(--text);
          --card: #162c26;
          --card-foreground: var(--text);
          --popover: #162c26;
          --popover-foreground: var(--text);
          --primary-foreground: #0f1f1b;
          --secondary: #1f3a33;
          --secondary-foreground: var(--text);
          --muted: #1f3a33;
          --muted-foreground: #a0a0a0;
          --accent-foreground: #0f1f1b;
          --destructive: #f87171;
          --destructive-foreground: #0f1f1b;
          --border: var(--border-light);
          --input: var(--border-light);
          --ring: var(--primary);
          --chart-1: #acd038;
          --chart-2: #fcb042;
          --chart-3: #87ceeb;
          --chart-4: #f0a0a0;
          --chart-5: #a8d8ea;
          --sidebar: #162c26;
          --sidebar-foreground: var(--text);
          --sidebar-primary: var(--primary);
          --sidebar-primary-foreground: #0f1f1b;
          --sidebar-accent: var(--accent);
          --sidebar-accent-foreground: #0f1f1b;
          --sidebar-border: var(--border-light);
          --sidebar-ring: var(--primary);


          /* --- LANDING PAGE SPECIFIC VARIABLES (Dark Mode) --- */
          --hero-bg-start: #0c0a09; /* stone-950 */
          --hero-bg-via: #1c1917;   /* stone-900 */
          --hero-bg-end: #292524;   /* stone-800 */
          
          --blob-1: #451a03; /* amber-950/deep */
          --blob-2: #4c0519; /* rose-950/deep */
          --blob-3: #431407; /* orange-950/deep */


          --text-heading-grad-from: #fef3c7; /* amber-100 */
          --text-heading-grad-via: #ffedd5;  /* orange-100 */
          --text-heading-grad-to: #ffe4e6;   /* rose-100 */
          
          --text-body-color: #d6d3d1; /* stone-300 */
          --divider-color: #d97706;   /* amber-600 */
          
          --badge-bg: rgba(28, 25, 23, 0.8);
          --badge-border: #78350f; /* amber-900 */
          --badge-text: #fcd34d;   /* amber-300 */
          --badge-icon: #fbbf24;   /* amber-400 */
          
          --btn-primary-start: #b45309; /* amber-700 */
          --btn-primary-end: #c2410c;   /* orange-700 */
          --btn-shadow: rgba(0, 0, 0, 0.5);
          
          --lp-card-bg: #1c1917; /* stone-900 */
          --lp-card-border: #44403c; /* stone-700 */
          --lp-card-border-hover: #d97706; /* amber-600 */
          
          --feat-bg-start: #0c0a09;
          --feat-bg-end: #1c1917;
          
          --brand-bg-start: #0f0f0f;
          --brand-bg-via: #1a1a1a;
          --brand-bg-end: #262626;
        }
      `}</style>


      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />


      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-[var(--hero-bg-start)] via-[var(--hero-bg-via)] to-[var(--hero-bg-end)]">
        
        {/* Abstract Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--blob-1)] rounded-full blur-[100px] animate-pulse opacity-40 will-change-transform" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--blob-2)] rounded-full blur-[120px] animate-pulse delay-700 opacity-40 will-change-transform" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[var(--blob-3)] rounded-full blur-[90px] animate-pulse delay-1000 opacity-30 will-change-transform" />
        </div>


        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto text-center pt-10">
          
          {/* Badge */}
          <div
            className={`group inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[var(--badge-bg)] backdrop-blur-md border border-[var(--badge-border)] text-[var(--badge-text)] text-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 shadow-lg cursor-default font-[family-name:var(--font-montserrat)] tracking-widest uppercase font-bold`}
          >
            <Star className="w-4 h-4 text-[var(--badge-icon)] animate-spin-slow" />
            <span>{t("hero.cta")}</span>
          </div>


          {/* Heading */}
          <div className="relative inline-block">
            <h1
              className={`text-6xl md:text-8xl lg:text-9xl font-extrabold mb-6 text-balance bg-clip-text text-transparent bg-gradient-to-r from-[var(--text-heading-grad-from)] via-[var(--text-heading-grad-via)] to-[var(--text-heading-grad-to)] tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 drop-shadow-sm font-[family-name:var(--font-syne)]`}
            >
              {t("hero.title")}
            </h1>
            <span className="absolute -top-8 -right-8 text-4xl text-[var(--divider-color)] font-[family-name:var(--font-great-vibes)] opacity-80 rotate-12 hidden md:block">
              Est. 2024
            </span>
          </div>


          {/* Subtitle */}
          <p
            className={`text-xl md:text-3xl text-[var(--text-body-color)] mb-14 text-balance max-w-4xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 font-[family-name:var(--font-prata)]`}
          >
            {t("hero.subtitle")}
          </p>


          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700 font-[family-name:var(--font-space)]`}
          >
            <Link
              href={`/${locale}/items`}
              className="group relative flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[var(--btn-primary-start)] to-[var(--btn-primary-end)] text-white font-bold rounded-full hover:brightness-110 transition-all hover:scale-105 shadow-2xl shadow-[var(--btn-shadow)] overflow-hidden uppercase tracking-widest"
            >
              <span className="relative z-10 text-lg">Shop Collection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
            </Link>


            <Link
              href={`/${locale}/about`}
              className="group flex items-center gap-2 px-10 py-5 bg-transparent border-2 border-[var(--badge-border)] text-[var(--badge-text)] font-bold rounded-full hover:bg-[var(--badge-bg)] transition-all hover:scale-105 shadow-lg text-lg tracking-widest uppercase"
            >
              <span>Our Story</span>
            </Link>
          </div>


          {/* Hero Image */}
          <div className="mt-20 relative h-64 md:h-80 w-full animate-in fade-in duration-1000 delay-1000 pointer-events-none md:pointer-events-auto">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-48 h-48 md:w-72 md:h-72 z-20 animate-float ">
              <Image
                src="/icon.png"
                alt="Fresh artisan sourdough bread loaf"
                fill
                priority
  //              placeholder="blur"
//                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(300, 300))}`}
    //            className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>


      {/* --- STATS BAR --- */}
      <section className="py-12 bg-[var(--lp-card-bg)] border-y border-[var(--lp-card-border)]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Leaf, label: "100% Organic" },
            { icon: Clock, label: "Wood Fired" },
            { icon: ChefHat, label: "Hand Crafted" },
            { icon: Award, label: "Master Chefs" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-3 group">
              <stat.icon className={`w-8 h-8 md:w-10 md:h-10 text-[var(--badge-icon)] group-hover:scale-110 transition-transform`} />
              <span className="text-sm md:text-base font-bold uppercase tracking-widest text-[var(--text-body-color)] font-[family-name:var(--font-oswald)]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>


      {/* --- VIDEO SHOWCASE GALLERY --- */}
      <section className="relative py-24 px-4 bg-[var(--background)] overflow-hidden">
        <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
              <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest uppercase border border-[var(--badge-border)] text-[var(--badge-text)] rounded-full font-[family-name:var(--font-space)]">
              Behind the Scenes
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-[var(--text-heading-grad-from)] font-[family-name:var(--font-playfair)]">
              Crafting Perfection
            </h2>
          </div>
          <p className="max-w-md text-[var(--text-body-color)] font-[family-name:var(--font-dancing)] text-2xl text-right md:text-left">
            "From the wood-fired oven to your plate, experience the art of baking."
          </p>
        </div>


        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px] max-w-7xl mx-auto">
          
          {/* Main Hero Video */}
          <div className="relative md:col-span-8 h-[400px] md:h-full rounded-3xl overflow-hidden shadow-2xl border border-[var(--lp-card-border)] group">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
              poster="https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=1200&q=80"
            >
              <source src="https://assets.mixkit.co/videos/preview/mixkit-chef-putting-pizza-in-oven-41924-large.mp4" type="video/mp4" />
            </video>
            
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent opacity-90" />
            
            <div className="absolute bottom-8 left-8 right-8 z-10">
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                 <span className="text-xs font-bold tracking-widest uppercase text-[var(--foreground)] font-[family-name:var(--font-inter)]">Live Kitchen Cam</span>
              </div>
              <h3 className="text-3xl font-bold font-[family-name:var(--font-cinzel)] text-[var(--text-heading-grad-from)] mb-2">Wood-Fired Magic</h3>
              <p className="text-sm text-[var(--text-body-color)] font-[family-name:var(--font-lora)] max-w-lg">Authentic Napoletana style pizzas baked at 400°C for that perfect leopard spotting.</p>
            </div>
          </div>


          {/* Secondary Vertical Videos */}
          <div className="md:col-span-4 flex flex-col gap-6 h-full">
            {[
              { 
                src: "https://assets.mixkit.co/videos/preview/mixkit-confectioner-decorating-a-chocolate-cake-41927-large.mp4", 
                title: "Cake Artistry",
                poster: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80"
              },
              { 
                src: "https://assets.mixkit.co/videos/preview/mixkit-melted-cheese-pizza-close-up-41923-large.mp4", 
                title: "Melting Moments",
                poster: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80"
              }
            ].map((vid, idx) => (
              <div key={idx} className="relative flex-1 rounded-3xl overflow-hidden border border-[var(--lp-card-border)] group">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105 transition-transform"
                  poster={vid.poster}
                >
                  <source src={vid.src} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-[var(--background)]/20 mix-blend-multiply" />
                <div className="absolute bottom-6 left-6 z-10">
                  <h4 className="text-xl font-bold font-[family-name:var(--font-cinzel)] text-[var(--foreground)]">{vid.title}</h4>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-[var(--badge-icon)]/90 flex items-center justify-center">
                    <Play className="w-5 h-5 text-white fill-current" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* --- CIRCULAR GALLERY --- */}
      <div
        style={{ height: "400px", position: "relative" }}
        className="bg-gradient-to-b from-[var(--background)] to-[var(--feat-bg-start)] border-t border-[var(--border)]"
      >
        <CircularGallery bend={1} items={bakeryGalleryItems} />
      </div>


      {/* --- FEATURED COLLECTIONS --- */}
      <section className="py-24 px-4 bg-gradient-to-b from-[var(--feat-bg-start)] to-[var(--feat-bg-end)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <div className="inline-block mb-4 px-4 py-1 bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] text-xs font-bold uppercase tracking-widest rounded-full font-[family-name:var(--font-montserrat)]">
                Featured Collection
              </div>
              <h2 className="text-5xl md:text-7xl font-black mb-4 text-[var(--text-heading-grad-from)] font-[family-name:var(--font-playfair)]">
                {t("items.title")}
              </h2>
              <p className="text-xl text-[var(--text-body-color)] italic font-[family-name:var(--font-merriweather)]">
                {t("items.description")}
              </p>
            </div>
            <Link
              href={`/${locale}/items`}
              className="group text-[var(--text-heading-grad-via)] font-bold flex items-center gap-2 hover:gap-4 transition-all text-lg font-[family-name:var(--font-space)] uppercase tracking-widest"
            >
              View All Items
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map((item) => (
              <Link
                key={item.slug}
                href={`/${locale}/items/${item.slug}`}
                className="group relative bg-[var(--lp-card-bg)] rounded-3xl overflow-hidden border border-[var(--lp-card-border)] hover:border-[var(--lp-card-border-hover)] transition-all duration-500 hover:-translate-y-2 flex flex-col"
              >
                <div className="aspect-[4/5] relative overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name.en}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  <div className="absolute top-4 right-4 bg-[var(--lp-card-bg)]/90 backdrop-blur text-[var(--badge-text)] font-bold px-4 py-2 rounded-xl border border-[var(--lp-card-border)] font-[family-name:var(--font-oswald)] tracking-wider shadow-sm">
                    ₹{item.price}
                  </div>
                </div>


                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold mb-2 text-[var(--text-heading-grad-from)] group-hover:text-[var(--text-heading-grad-via)] transition-colors font-[family-name:var(--font-cinzel)]">
                    {locale === "en" ? item.name.en : item.name.bn}
                  </h3>
                  <p className="text-[var(--text-body-color)] line-clamp-2 text-sm mb-4 font-[family-name:var(--font-lora)] flex-1">
                    {locale === "en" ? item.description.en : item.description.bn}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-[var(--lp-card-border)] mt-auto">
                    <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest flex items-center gap-2 font-[family-name:var(--font-inter)]">
                      <span className="w-2 h-2 rounded-full bg-[var(--badge-icon)]" />
                      {item.calories} Cal
                    </span>
                    <div className="w-10 h-10 rounded-full bg-[var(--blob-1)] flex items-center justify-center text-[var(--badge-text)] group-hover:bg-[var(--badge-icon)] group-hover:text-white transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* --- TESTIMONIALS --- */}
      <section className="py-24 px-4 bg-[var(--background)]">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black mb-4 text-[var(--text-heading-grad-from)] font-[family-name:var(--font-syne)]">
            Customer Love
          </h2>
        </div>


        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Priya Sharma", role: "Food Blogger", quote: "The truffle pizza here is absolutely divine.", rating: 5 },
            { name: "Rahul Mehta", role: "Local Chef", quote: "Finally, an authentic bakery that respects traditional methods.", rating: 5 },
            { name: "Anita Desai", role: "Regular Customer", quote: "I drive 30 minutes just for their red velvet cake.", rating: 5 },
          ].map((t, i) => (
            <div key={i} className="bg-[var(--lp-card-bg)] p-8 rounded-3xl border border-[var(--lp-card-border)] hover:border-[var(--lp-card-border-hover)] transition-colors relative">
              <Quote className="absolute top-8 right-8 w-12 h-12 text-[var(--lp-card-border)] opacity-50" />
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-[var(--badge-icon)] text-[var(--badge-icon)]" />
                ))}
              </div>
              <p className="text-[var(--text-body-color)] text-lg mb-6 leading-relaxed italic font-[family-name:var(--font-merriweather)]">"{t.quote}"</p>
              <div>
                <p className="font-bold text-[var(--badge-text)] text-lg font-[family-name:var(--font-prata)]">{t.name}</p>
                <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider font-[family-name:var(--font-inter)]">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* --- BRAND STORY --- */}
      <section className="relative py-32 px-4 bg-gradient-to-br from-[var(--brand-bg-start)] via-[var(--brand-bg-via)] to-[var(--brand-bg-end)] text-white overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <Award className="w-16 h-16 mx-auto mb-6 text-[var(--badge-icon)]" />
          <h2 className="text-5xl md:text-7xl font-black mb-8 font-[family-name:var(--font-cinzel)] text-white">
            {t("about.title")}
          </h2>
          <p className="text-3xl md:text-5xl mb-12 font-light text-white/90 font-[family-name:var(--font-great-vibes)]">
            "{t("about.description")}"
          </p>
          <Link
            href={`/${locale}/about`}
            className="inline-block px-10 py-4 bg-white text-[var(--brand-bg-start)] font-bold rounded-full hover:scale-105 transition-transform uppercase tracking-widest font-[family-name:var(--font-oswald)]"
          >
            Read Our Philosophy
          </Link>
        </div>
      </section>


      {/* --- VISIT US --- */}
      <section className="py-24 px-4 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block mb-4 px-4 py-1 bg-[var(--badge-bg)] text-[var(--badge-text)] text-xs font-bold uppercase tracking-widest rounded-full font-[family-name:var(--font-space)]">
              Visit Us
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-[var(--text-heading-grad-from)] font-[family-name:var(--font-playfair)]">
              Experience the Taste
            </h2>
            <div className="space-y-6 mb-10 text-[var(--text-body-color)]">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-[var(--badge-icon)] mt-1" />
                <div>
                  <p className="font-bold text-[var(--foreground)] text-lg font-[family-name:var(--font-cinzel)]">Shyamnagar, West Bengal</p>
                  <p className="font-[family-name:var(--font-inter)]">78 Baker Street, Near Central Park, India</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-[var(--badge-icon)] mt-1" />
                <div>
                  <p className="font-bold text-[var(--foreground)] text-lg font-[family-name:var(--font-cinzel)]">Open Daily</p>
                  <p className="font-[family-name:var(--font-inter)]">7:00 AM - 10:00 PM</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <Link href={`/${locale}/contact`} className="px-8 py-3 bg-gradient-to-r from-[var(--btn-primary-start)] to-[var(--btn-primary-end)] text-white font-bold rounded-full font-[family-name:var(--font-montserrat)] uppercase hover:opacity-90">
                Get Directions
              </Link>
              <button className="p-3 rounded-full border border-[var(--badge-text)] text-[var(--badge-text)] hover:bg-[var(--badge-text)] hover:text-white transition-all">
                <Instagram className="w-6 h-6" />
              </button>
            </div>
          </div>
           
          <div className="relative h-[500px] rounded-[3rem] overflow-hidden border-4 border-[var(--lp-card-border)]">
            <Image
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
              alt="Bakery interior"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-bg-end)] via-transparent to-transparent opacity-90" />
            <div className="absolute bottom-8 left-8 text-white">
              <Coffee className="w-8 h-8 mb-4 text-[var(--badge-icon)]" />
              <p className="text-4xl font-bold font-[family-name:var(--font-great-vibes)]">Fresh Slices &<br />Sweet Delights</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}