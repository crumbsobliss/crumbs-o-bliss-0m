"use client";

import { Suspense, useRef } from "react";
import dynamic from "next/dynamic"; 
import { useTranslations } from "next-intl";
import { useInView } from "framer-motion";
import { CategoryShowcase } from "./CategoryShowcase";
import { SlidingBanner } from "./SlidingBanner";
import { HeroSection } from "./landing/HeroSection";
import { StatsBar } from "./landing/StatsBar";
import { TestimonialSection } from "./landing/TestimonialSection";
import { BrandStory } from "./landing/BrandStory";
import { VisitSection } from "./landing/VisitSection";
import { VideoGallery } from "./landing/VideoGallery";

// Lazy load heavy 3D components with dynamic import
const CircularGallery = dynamic(() => import("./CircularGallery"), {
  ssr: false,
  loading: () => <div className="h-[400px] md:h-[550px] lg:h-[600px] bg-primary/5 animate-pulse" />
});

interface LandingPageProps {
  locale: string;
  featuredItems: any[];
  bakeryGalleryItems: any[];
}

export function LandingPage({ locale, featuredItems, bakeryGalleryItems }: LandingPageProps) {
  const t = useTranslations();
  const galleryRef = useRef(null);
  const shouldLoadGallery = useInView(galleryRef, { margin: "200px" });

  // Testimonials data
  const testimonials = [
    { name: "Priya Sharma", role: "Food Blogger", quote: "The truffle pizza here is absolutely divine. A masterpiece of flavors.", rating: 5 },
    { name: "Rahul Mehta", role: "Local Chef", quote: "Finally, an authentic bakery that respects traditional methods. Truly exceptional.", rating: 5 },
    { name: "Anita Desai", role: "Regular Customer", quote: "I drive 30 minutes just for their red velvet cake. It's that good.", rating: 5 },
  ];

  return (
    <div className="w-full overflow-x-hidden bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Sliding Banner */}
      <SlidingBanner />

      {/* Hero Section */}
      <HeroSection locale={locale} t={t} />

      {/* Stats Bar */}
      <StatsBar />

      {/* Featured Categories */}
      <CategoryShowcase />

      {/* Video Gallery - Lazy loaded on scroll */}
      <Suspense fallback={<div className="h-96 md:h-[600px] bg-muted animate-pulse" />}>
        <VideoGallery />
      </Suspense>

      {/* Circular Gallery - Lazy loaded with dynamic import and scroll detection */}
      <div 
        ref={galleryRef}
        className="h-[400px] md:h-[550px] lg:h-[600px] relative bg-gradient-to-b from-transparent to-background/50 overflow-hidden"
      >
        {shouldLoadGallery ? (
          <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-muted-foreground font-modern">Loading Gallery...</div>}>
            <CircularGallery bend={0} items={bakeryGalleryItems} />
          </Suspense>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground font-modern bg-primary/5 animate-pulse">
            Scroll to load gallery...
          </div>
        )}
      </div>

      {/* Testimonials */}
      <TestimonialSection testimonials={testimonials} />

      {/* Brand Story */}
      <BrandStory locale={locale} t={t} />

      {/* Visit Section */}
      <VisitSection locale={locale} />
    </div>
  );
}
