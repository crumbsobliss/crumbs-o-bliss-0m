import type { Metadata, Viewport } from "next";
// import { items } from "@/lib/items";
import { createClient } from "@/utils/supabase/server";
import details from "@/config/details.json";
import { LandingPage } from "@/components/LandingPage";

// --- SEO: Metadata (Server Side) ---
export const metadata: Metadata = {
  title: "Crumbs O' Bliss | Let's Bliss Together",
  description: `${details.store.slogan} - Experience the magic of artisanal pizzas and custom cakes in ${details.location.state}. Located near ${details.location.landmark}.`,
  keywords: details.seo.keywords,
  authors: [{ name: details.store.name }],
  openGraph: {
    title: `${details.store.name} | Let's Bliss Together`,
    description: details.store.slogan,
    url: details.store.fullDomain,
    siteName: details.store.name,
    images: [
      {
        url: "/icon.png",
        width: 600,
        height: 600,
        alt: `${details.store.name} - ${details.store.slogan}`,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${details.store.name} | Artisan Pizza & Cakes`,
    description: `Taste the passion in every bite. ${details.store.slogan}`,
    images: [
      "/icon.png",
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0f1f1b",
  width: "device-width",
  initialScale: 1,
};

// --- SEO: JSON-LD Structured Data ---
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Bakery",
      name: details.store.name,
      image:
        "/icon.png",
      description: `${details.store.name} - ${details.store.slogan}. Artisan bakery offering fresh pizzas, custom cakes, and organic baked goods.`,
      address: {
        "@type": "PostalAddress",
        streetAddress: details.location.address,
        addressLocality: details.location.city,
        addressRegion: details.location.state,
        postalCode: details.location.postalCode,
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: details.location.latitude,
        longitude: details.location.longitude,
      },
      url: details.store.fullDomain,
      telephone: details.contact.primaryPhone,
      email: details.contact.email,
      sameAs: [details.social.instagramUrl, details.social.facebookUrl],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "09:00",
          closes: "21:00",
        },
      ],
      priceRange: "₹₹",
      servesCuisine: ["Cake", "Pizza", "Bakery"],
    },
  ],
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const supabase = await createClient();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .limit(4);

  // Prepare data for the client component
  // Map Supabase product to the expected format (BakeryItem interface match)
  const featuredItems = products?.map((p: any) => ({
    id: p.id,
    slug: p.id, // using id as slug for now or we need a slug field in DB
    name: { en: p.name, bn: p.name }, // naive localization if DB doesn't support it yet
    description: { en: p.description || '', bn: p.description || '' },
    price: p.price,
    color: p.color,
    discounted_price: p.discounted_price,
    currency: "INR",
    image: p.image_url || "/assets/products/landing-card-1.webp",
    tags: [p.category || 'general'],
    weight: 100, // adding dummy values to satisfy BakeryItem interface if needed
    ingredients: []
  })) || [];

  const bakeryGalleryItems = [
    { image: "/assets/products/landing-card-1.webp", text: "Cake" },
    { image: "/assets/products/landing-card-2.webp", text: "Cake" },
    { image: "/assets/products/landing-card-3.webp", text: "Cake" },
    { image: "/assets/products/landing-card-4.webp", text: "Cake" },
    { image: "/assets/products/landing-card-5.webp", text: "Cake" },
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
