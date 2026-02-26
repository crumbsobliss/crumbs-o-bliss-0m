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
import { FeaturedSection } from "./landing/FeaturedSection";
import { SvgDivider } from "./ui/SvgDivider";

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

      {/* 2. Featured Products - Green */}
      <div className="bg-[var(--primary)] text-primary-foreground relative pt-12 pb-8 z-20">
        <div className="absolute top-0 left-0 w-full -translate-y-[98%]">
          <SvgDivider type="smoothBlue" className="w-full h-[60px] md:h-[120px]" />
        </div>
        <FeaturedSection items={featuredItems} locale={locale} />
      </div>

      {/* 3. Stats Bar - Yellow */}
      <div className="bg-[var(--highlight)] text-[#4b3000] relative py-8 z-30">
        {/* Top drippy transition (Yellow pointing UP over Green) */}
        <div className="absolute top-0 left-0 w-full -translate-y-[98%] rotate-180">
          <SvgDivider type="drippyPink" className="w-full h-[60px] md:h-[120px]" />
        </div>
        <StatsBar />
        {/* Bottom drippy transition (Yellow pointing DOWN over Pink) */}
        <div className="absolute bottom-0 left-0 w-full translate-y-[98%]">
          <SvgDivider type="drippyPink" className="w-full h-[60px] md:h-[120px]" />
        </div>
      </div>

      {/* 4. Featured Categories - Pink */}
      <div className="bg-[var(--accent)] text-white relative pt-24 pb-12 z-10">
        <CategoryShowcase />
        {/* Bottom wavy transition (Pink pointing DOWN over White Video section) */}
        <div className="absolute bottom-0 left-0 w-full translate-y-[98%]">
          <SvgDivider type="wavyRed" className="w-full h-[60px] md:h-[120px]" />
        </div>
      </div>

      {/* Video Gallery - Lazy loaded on scroll */}
      <div className="pt-32 md:pt-48 relative z-0">
        <Suspense fallback={<div className="h-96 md:h-[600px] bg-muted animate-pulse" />}>
          <VideoGallery />
        </Suspense>
      </div>

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
      <div className="relative z-10">
        <TestimonialSection testimonials={testimonials} />
      </div>

      {/* Brand Story */}
      <div className="relative z-20">
        {/* Wavy top transition (Green waving UP into Testimonials White) */}
        <div className="absolute top-0 left-0 w-full -translate-y-[98%]">
          <SvgDivider type="smoothBlue" className="w-full h-[60px] md:h-[120px]" />
        </div>
        <BrandStory locale={locale} t={t} />
        {/* Wavy bottom transition (Green waving DOWN into Visit White) */}
        <div className="absolute bottom-0 left-0 w-full translate-y-[98%] rotate-180">
          <SvgDivider type="smoothBlue" className="w-full h-[60px] md:h-[120px]" />
        </div>
      </div>

      {/* Visit Section */}
      <div className="relative z-10 pt-20 md:pt-32">
        {/* Decorative outline wave above the visit section */}
        <div className="absolute top-32 left-0 w-full flex items-end justify-center pointer-events-none opacity-40">
          <SvgDivider type="outlineWavy" className="h-[40px] md:h-[80px] text-[var(--accent)]" />
        </div>
        <VisitSection locale={locale} />
      </div>
    </div>
  );
}
