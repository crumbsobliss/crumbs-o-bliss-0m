import type { Metadata, Viewport } from "next";
import { items } from "@/lib/items";
import details from "@/config/details.json";
import { LandingPage } from "@/components/LandingPage";

// --- SEO: Metadata (Server Side) ---
export const metadata: Metadata = {
  title: "Crumbs O' Bliss | Artisan Pizza & Cake Studio",
  description: `${details.store.slogan} - Experience the magic of artisanal pizzas and custom cakes in ${details.location.state}. Located near ${details.location.landmark}.`,
  keywords: details.seo.keywords,
  authors: [{ name: details.store.name }],
  openGraph: {
    title: `${details.store.name} | Artisan Pizza & Cakes`,
    description: details.store.slogan,
    url: details.store.fullDomain,
    siteName: details.store.name,
    images: [
      {
        url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: `${details.store.name} Artisan Pizza`,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${details.store.name} | Artisan Pizza & Cakes`,
    description: `Taste the passion in every bite. ${details.store.slogan}`,
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
      "name": details.store.name,
      "image": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80",
      "description": `${details.store.name} - ${details.store.slogan}. Artisan bakery offering fresh pizzas, custom cakes, and organic baked goods.`,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": details.location.address,
        "addressLocality": details.location.city,
        "addressRegion": details.location.state,
        "postalCode": details.location.postalCode,
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": details.location.latitude,
        "longitude": details.location.longitude
      },
      "url": details.store.fullDomain,
      "telephone": details.contact.primaryPhone,
      "email": details.contact.email,
      "sameAs": [
        details.social.instagramUrl,
        details.social.facebookUrl
      ],
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "09:00",
          "closes": "21:00"
        }
      ],
      "priceRange": "₹₹",
      "servesCuisine": ["Pizza", "Bakery"]
    }
  ]
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Prepare data for the client component
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

  return (
    <>
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Render Client UI */}
      <LandingPage 
        locale={locale}
        featuredItems={featuredItems}
        bakeryGalleryItems={bakeryGalleryItems}
      />
    </>
  );
}