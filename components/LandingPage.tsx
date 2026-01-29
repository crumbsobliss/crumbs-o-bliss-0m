"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic"; // Import dynamic for code splitting
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ArrowRight, Star, Leaf, Clock, Award, MapPin, Instagram,
  Coffee, Play, Quote, ChefHat
} from "lucide-react";
import details from "@/config/details.json";

// --- Lazy Load Heavy Components ---
// This prevents the 3D gallery JS from blocking the initial page load
const CircularGallery = dynamic(() => import("@/components/CircularGallery"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[var(--feat-bg-start)] animate-pulse" />
});

// --- Performance Component: Lazy Video ---
// Replaces heavy video tags with an image that swaps to video only when visible
const LazyVideo = ({ src, poster, className, label }: { src: string, poster?: string, className?: string, label?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "200px" }); // Load 200px before appearing
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div ref={containerRef} className={`relative overflow-hidden bg-gray-900 ${className}`}>
      {isInView ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isLoaded ? 'opacity-90' : 'opacity-0'}`}
          onLoadedData={() => setIsLoaded(true)}
          poster={poster} // Native poster as fallback
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : null}
      
      {/* Poster Image (LCP Savior) - Always visible until video is ready */}
      <div className={`absolute inset-0 z-0 transition-opacity duration-500 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}>
         {poster && <Image src={poster} alt={label || "Video content"} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />}
         <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none" />
    </div>
  );
};

interface LandingPageProps {
  locale: string;
  featuredItems: any[];
  bakeryGalleryItems: any[];
}

export function LandingPage({ locale, featuredItems, bakeryGalleryItems }: LandingPageProps) {
  const t = useTranslations();
  const { scrollY } = useScroll();
  
  // Reduced parallax distance to improve scrolling performance on low-end devices
  const heroY = useTransform(scrollY, [0, 800], [0, 200]);

  // Optimized Variants - utilizing opacity/transform which are GPU accelerated
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 }, // Reduced distance
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  return (
    <div className="w-full overflow-x-hidden bg-[var(--background)] text-[var(--foreground)] font-sans selection:bg-[var(--highlight)] selection:text-[var(--primary)]">
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-[var(--hero-bg-start)] via-[var(--hero-bg-via)] to-[var(--hero-bg-end)]">
        
        {/* OPTIMIZED BACKGROUND: Replaced JS Animation with CSS Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] md:w-[500px] md:h-[500px] bg-[var(--blob-1)] rounded-full blur-[100px] opacity-40 animate-blob-float" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] md:w-[600px] md:h-[600px] bg-[var(--blob-2)] rounded-full blur-[120px] opacity-40 animate-blob-float-delayed" />
        </div>

        {/* CSS Styles for animations included directly to ensure portability */}
        <style jsx global>{`
          @keyframes float {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob-float { animation: float 10s infinite ease-in-out; }
          .animate-blob-float-delayed { animation: float 12s infinite ease-in-out reverse; }
          .animate-spin-slow { animation: spin 8s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>

        {/* Content */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-7xl mx-auto text-center pt-10"
        >
          {/* Badge */}
          <motion.div className="flex justify-center mb-8 md:mb-10" variants={fadeInUp}>
            <div className="group inline-flex items-center gap-3 px-6 py-2 md:px-8 md:py-3 rounded-full bg-[var(--badge-bg)] backdrop-blur-xl border border-[var(--badge-border)] text-[var(--badge-text)] text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold shadow-xl hover:scale-105 transition-transform font-sans will-change-transform">
              <Star className="w-3 h-3 md:w-4 md:h-4 text-[var(--badge-icon)] animate-spin-slow" />
              <span>{t("hero.cta")}</span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div variants={fadeInUp} className="relative inline-block mb-6 md:mb-8">
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-black text-balance bg-clip-text text-transparent bg-gradient-to-r from-[var(--text-heading-grad-from)] via-[var(--text-heading-grad-via)] to-[var(--text-heading-grad-to)] tracking-tighter leading-[0.9] drop-shadow-lg font-serif">
              {t("hero.title")}
            </h1>
            <span 
              className="absolute -top-8 -right-4 md:-top-12 md:-right-16 text-3xl md:text-5xl text-[var(--divider-color)] italic font-serif rotate-12 hidden md:block"
            >
              Est. 2024
            </span>
          </motion.div>

          {/* Subtitle */}
          <motion.p 
            variants={fadeInUp}
            className="text-lg md:text-3xl text-[var(--text-body-color)] mb-10 md:mb-16 text-balance max-w-4xl mx-auto leading-relaxed font-serif italic"
          >
            {t("hero.subtitle")}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 font-mono">
            <Link
              href={`/${locale}/items`}
              className="group relative px-10 py-4 md:px-12 md:py-5 bg-gradient-to-r from-[var(--btn-primary-start)] to-[var(--btn-primary-end)] text-white font-bold rounded-full overflow-hidden shadow-2xl shadow-[var(--btn-shadow)] hover:shadow-[var(--highlight)]/50 transition-all duration-300 w-full sm:w-auto text-center"
            >
              <span className="relative z-10 flex items-center justify-center gap-3 text-sm md:text-lg uppercase tracking-widest">
                Shop Collection <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" />
              </span>
            </Link>

            <Link
              href={`/${locale}/about`}
              className="group px-10 py-4 md:px-12 md:py-5 bg-transparent border-2 border-[var(--badge-border)] text-[var(--badge-text)] font-bold rounded-full hover:bg-[var(--badge-bg)] transition-all text-sm md:text-lg tracking-widest uppercase font-sans w-full sm:w-auto text-center"
            >
              Our Story
            </Link>
          </motion.div>

          {/* Hero Image - LCP ELEMENT */}
          <motion.div 
            style={{ y: heroY }}
            variants={fadeInUp}
            className="mt-16 md:mt-24 relative h-64 md:h-96 w-full pointer-events-none md:pointer-events-auto flex justify-center"
          >
             <div className="relative w-64 h-64 md:w-96 md:h-96 animate-blob-float">
               <Image
                 src="/icon.png"
                 alt="Artisan Bread"
                 fill
                 sizes="(max-width: 768px) 300px, 500px" 
                 className="object-contain drop-shadow-2xl"
                 priority={true} // High Priority for LCP
                 fetchPriority="high"
               />
             </div>
          </motion.div>
        </motion.div>
      </section>

      {/* --- STATS BAR --- */}
      <section className="py-12 md:py-16 bg-[var(--lp-card-bg)] border-y border-[var(--lp-card-border)] relative z-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Leaf, label: "100% Organic" },
            { icon: Clock, label: "Wood Fired" },
            { icon: ChefHat, label: "Hand Crafted" },
            { icon: Award, label: "Master Chefs" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-4 group"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[var(--background)] flex items-center justify-center border border-[var(--badge-border)] shadow-lg">
                <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-[var(--badge-icon)]" />
              </div>
              <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-body-color)] font-sans group-hover:text-[var(--badge-text)] transition-colors">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- VIDEO GALLERY --- */}
      <section className="py-20 md:py-32 px-4 bg-[var(--background)] overflow-hidden">
        <div className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="text-left">
            <span className="inline-block px-4 py-1 mb-6 text-xs font-bold tracking-[0.3em] uppercase border border-[var(--badge-border)] text-[var(--badge-text)] rounded-full font-mono">
              Behind the Scenes
            </span>
            <h2 className="text-4xl md:text-7xl font-bold text-[var(--text-heading-grad-from)] font-serif leading-tight">
              Crafting<br/>Perfection
            </h2>
          </div>
          <p className="max-w-md text-[var(--text-body-color)] font-serif italic text-xl md:text-3xl text-right md:text-left leading-relaxed">
            "From the wood-fired oven to your plate, experience the art of baking."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 h-auto md:h-[700px] max-w-7xl mx-auto">
          {/* Main Video - Uses LazyVideo */}
          <div className="md:col-span-8 h-[400px] md:h-full rounded-[2rem] overflow-hidden shadow-2xl border border-[var(--lp-card-border)] group relative">
            <LazyVideo 
              src="/assets/videos/cake-edit.mp4" 
              // Using a placeholder image or generating a poster reduces LCP drastically
              poster="/assets/images/video-poster-main.jpg" 
              className="w-full h-full"
              label="Live Baking"
            />
            
            <div className="absolute bottom-10 left-10 z-20 pointer-events-none">
              <div className="flex items-center gap-3 mb-4">
                 <span className="relative flex h-3 w-3">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                 </span>
                 <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/90 font-sans">Live</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold font-serif text-white mb-3 shadow-black drop-shadow-md">Let's Bliss Together</h3>
            </div>
          </div>

          {/* Secondary Videos - Lazy Loaded */}
          <div className="md:col-span-4 flex flex-col gap-6 md:gap-8 h-full">
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
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="relative flex-1 rounded-[2rem] overflow-hidden border border-[var(--lp-card-border)] group min-h-[250px]"
              >
                <LazyVideo 
                  src={vid.src} 
                  poster={vid.poster} 
                  className="w-full h-full"
                  label={vid.title}
                />
                <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
                  <h4 className="text-xl font-bold font-serif text-white drop-shadow-md">{vid.title}</h4>
                </div>
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/50">
                    <Play className="w-5 h-5 text-white fill-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CIRCULAR GALLERY (Lazy Loaded via Dynamic Import) --- */}
      <div className="h-[400px] md:h-[500px] relative bg-gradient-to-b from-[var(--background)] to-[var(--feat-bg-start)] border-t border-[var(--border)] overflow-hidden">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-[var(--muted-foreground)]">Loading Gallery...</div>}>
          <CircularGallery bend={2} items={bakeryGalleryItems} />
        </Suspense>
      </div>

      {/* --- FEATURED COLLECTIONS --- */}
      <section className="py-20 md:py-32 px-4 bg-gradient-to-b from-[var(--feat-bg-start)] to-[var(--feat-bg-end)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl"
            >
              <span className="inline-block mb-6 px-4 py-1 bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] text-xs font-bold uppercase tracking-[0.25em] rounded-full font-sans">
                Selected Works
              </span>
              <h2 className="text-4xl md:text-8xl font-black mb-6 text-[var(--text-heading-grad-from)] font-serif">
                {t("items.title")}
              </h2>
              <p className="text-xl md:text-2xl text-[var(--text-body-color)] italic font-serif opacity-80">
                {t("items.description")}
              </p>
            </motion.div>
            <div>
              <Link
                href={`/${locale}/items`}
                className="group flex items-center gap-3 text-[var(--text-heading-grad-via)] font-bold text-lg font-mono uppercase tracking-widest hover:text-[var(--primary)] transition-colors"
              >
                View Full Menu
                <span className="w-12 h-[1px] bg-current group-hover:w-20 transition-all duration-300" />
                <ArrowRight className="w-5 h-5 group-hover:-rotate-45 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {featuredItems.map((item, idx) => (
              <motion.div
                key={item.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link
                  href={`/${locale}/items/${item.slug}`}
                  className="group block h-full bg-[var(--lp-card-bg)] rounded-[2rem] overflow-hidden border border-[var(--lp-card-border)] hover:border-[var(--lp-card-border-hover)] hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-[4/5] relative overflow-hidden bg-[var(--background)]">
                    <Image
                      src={item.image}
                      alt={item.name.en}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 will-change-transform"
                      loading="lazy"
                    />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur text-[var(--text)] font-bold px-4 py-1 rounded-full border border-[var(--border)] font-sans text-sm md:text-lg tracking-wider shadow-lg z-10">
                      ₹{item.price}
                    </div>
                  </div>

                  <div className="p-6 md:p-8">
                    <h3 className="text-2xl md:text-3xl font-bold mb-3 text-[var(--text-heading-grad-from)] font-serif group-hover:text-[var(--badge-icon)] transition-colors">
                      {locale === "en" ? item.name.en : item.name.bn}
                    </h3>
                    <p className="text-[var(--text-body-color)] line-clamp-2 text-base md:text-lg mb-6 font-serif opacity-80 leading-relaxed">
                      {locale === "en" ? item.description.en : item.description.bn}
                    </p>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-[var(--lp-card-border)]">
                      <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-[0.2em] flex items-center gap-2 font-sans">
                        <span className="w-2 h-2 rounded-full bg-[var(--badge-icon)]" />
                        {item.calories} Cal
                      </span>
                      <span className="text-xs md:text-sm font-bold text-[var(--badge-icon)] uppercase tracking-widest group-hover:underline underline-offset-4 decoration-2 font-sans">
                        Details
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className="py-20 md:py-32 px-4 bg-[var(--background)]">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto text-center mb-16 md:mb-20"
        >
          <h2 className="text-5xl md:text-8xl font-black mb-6 text-[var(--text-heading-grad-from)] font-sans opacity-20 select-none">
            TESTIMONIALS
          </h2>
          <div className="mt-[-3rem] md:mt-[-4rem] relative z-10">
            <h3 className="text-3xl md:text-5xl font-bold font-serif text-[var(--foreground)]">Customer Love</h3>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            { name: "Priya Sharma", role: "Food Blogger", quote: "The truffle pizza here is absolutely divine. A masterpiece of flavors.", rating: 5 },
            { name: "Rahul Mehta", role: "Local Chef", quote: "Finally, an authentic bakery that respects traditional methods. Truly exceptional.", rating: 5 },
            { name: "Anita Desai", role: "Regular Customer", quote: "I drive 30 minutes just for their red velvet cake. It's that good.", rating: 5 },
          ].map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-[var(--lp-card-bg)] p-8 md:p-10 rounded-[2rem] border border-[var(--lp-card-border)] hover:border-[var(--highlight)] shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              <Quote className="absolute top-8 right-8 w-12 h-12 md:w-16 md:h-16 text-[var(--badge-icon)] opacity-10 group-hover:opacity-20 transition-opacity" />
              <div className="flex gap-1 mb-6 md:mb-8">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-[var(--badge-icon)] text-[var(--badge-icon)]" />
                ))}
              </div>
              <p className="text-[var(--text-body-color)] text-lg md:text-xl mb-8 leading-relaxed italic font-serif relative z-10">"{t.quote}"</p>
              <div>
                <p className="font-bold text-[var(--badge-text)] text-lg md:text-xl font-serif">{t.name}</p>
                <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-widest font-sans mt-1">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- BRAND STORY --- */}
      <section className="relative py-24 md:py-40 px-4 bg-gradient-to-br from-[var(--brand-bg-start)] via-[var(--brand-bg-via)] to-[var(--brand-bg-end)] text-white overflow-hidden">
        {/* Decorative elements - CSS Pattern instead of Image if possible, but kept image for fidelity */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-5xl mx-auto text-center"
        >
          <Award className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-8 md:mb-10 text-[var(--badge-icon)] animate-pulse" />
          <h2 className="text-4xl md:text-8xl font-black mb-8 md:mb-10 font-serif text-white leading-tight">
            {t("about.title")}
          </h2>
          <p className="text-2xl md:text-6xl mb-10 md:mb-16 font-light text-white/90 italic font-serif leading-normal">
            "{t("about.description")}"
          </p>
          <Link
            href={`/${locale}/about`}
            className="inline-block px-10 py-4 md:px-14 md:py-5 bg-white text-[var(--brand-bg-start)] font-bold rounded-full hover:scale-105 transition-transform uppercase tracking-[0.2em] font-sans shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            Read Our Philosophy
          </Link>
        </motion.div>
      </section>

      {/* --- VISIT US --- */}
      <section className="py-20 md:py-32 px-4 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-block mb-6 px-4 py-1 bg-[var(--badge-bg)] text-[var(--badge-text)] text-xs font-bold uppercase tracking-[0.2em] rounded-full font-mono border border-[var(--badge-border)]">
              Visit Us
            </div>
            <h2 className="text-4xl md:text-7xl font-black mb-10 text-[var(--text-heading-grad-from)] font-serif">
              Experience the Taste
            </h2>
            <div className="space-y-8 md:space-y-10 mb-12 text-[var(--text-body-color)]">
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-full bg-[var(--secondary)] flex items-center justify-center group-hover:bg-[var(--badge-icon)] transition-colors shrink-0">
                   <MapPin className="w-6 h-6 text-[var(--foreground)] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="font-bold text-[var(--foreground)] text-xl font-serif mb-1">Sarisha, West Bengal</p>
                  <p className="font-sans text-lg opacity-80">{details.location.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-full bg-[var(--secondary)] flex items-center justify-center group-hover:bg-[var(--badge-icon)] transition-colors shrink-0">
                   <Clock className="w-6 h-6 text-[var(--foreground)] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="font-bold text-[var(--foreground)] text-xl font-serif mb-1">Open Daily</p>
                  <p className="font-sans text-lg opacity-80">09:00 AM - 09:00 PM</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <Link href={`/${locale}/contact`} className="px-10 py-4 bg-gradient-to-r from-[var(--btn-primary-start)] to-[var(--btn-primary-end)] text-white font-bold rounded-full font-sans uppercase tracking-widest hover:opacity-90 shadow-lg text-center">
                Get Directions
              </Link>
              <Link href={"https://instagram.com/crumbsobliss_official"} className="px-10 py-4 rounded-full border-2 border-[var(--badge-text)] text-[var(--badge-text)] font-bold font-sans uppercase tracking-widest hover:bg-[var(--badge-text)] hover:text-white transition-all flex items-center justify-center gap-2 text-center">
                <Instagram className="w-5 h-5" /> Follow Us
              </Link>
            </div>
          </motion.div>
           
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[400px] md:h-[600px] rounded-[3rem] overflow-hidden border-8 border-[var(--lp-card-border)] shadow-2xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
              alt="Bakery interior"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-bg-end)] via-transparent to-transparent opacity-90" />
            <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 text-white max-w-sm">
              <Coffee className="w-8 h-8 md:w-10 md:h-10 mb-4 md:mb-6 text-[var(--badge-icon)]" />
              <p className="text-3xl md:text-5xl font-bold font-serif italic leading-tight">Fresh Slices &<br />Sweet Delights</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}