"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic"; 
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ArrowRight, Star, Leaf, Clock, Award, MapPin, Instagram,
  Coffee, Play, Quote, ChefHat, Sparkles
} from "lucide-react";
import details from "../config/details.json";
import { CategoryShowcase } from "./CategoryShowcase";
import { SlidingBanner } from "./SlidingBanner";

// --- Lazy Load Heavy Components ---
const CircularGallery = dynamic(() => import("./CircularGallery"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-primary/5 animate-pulse" />
});

// --- Performance Component: Lazy Video ---
const LazyVideo = ({ src, poster, className, label }: { src: string, poster?: string, className?: string, label?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "200px" });
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div ref={containerRef} className={`relative overflow-hidden bg-muted/30 ${className}`}>
      {isInView ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isLoaded ? 'opacity-90' : 'opacity-0'}`}
          onLoadedData={() => setIsLoaded(true)}
          poster={poster}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : null}
      
      <div className={`absolute inset-0 z-0 transition-opacity duration-500 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}>
         {poster && <Image src={poster} alt={label || "Video content"} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />}
         <div className="absolute inset-0 bg-black/20" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none" />
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
  
  const heroY = useTransform(scrollY, [0, 800], [0, 150]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
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
    <div className="w-full overflow-x-hidden bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Cinzel:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=DM+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        
        .font-display { font-family: 'Playfair Display', serif; }
        .font-elegant { font-family: 'Cormorant Garamond', serif; }
        .font-luxury { font-family: 'Cinzel', serif; }
        .font-modern { font-family: 'Space Grotesk', sans-serif; }
        .font-clean { font-family: 'DM Sans', sans-serif; }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -30px) scale(1.05); }
          50% { transform: translate(-20px, 20px) scale(0.95); }
          75% { transform: translate(20px, 10px) scale(1.02); }
        }
        
        @keyframes gentle-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        .animate-float { animation: float 15s infinite ease-in-out; }
        .animate-float-delayed { animation: float 18s infinite ease-in-out reverse; }
        .animate-gentle-pulse { animation: gentle-pulse 4s infinite ease-in-out; }
        
        .gradient-mesh {
          background: 
            radial-gradient(at 20% 30%, hsl(var(--primary) / 0.15) 0px, transparent 50%),
            radial-gradient(at 80% 70%, hsl(var(--secondary) / 0.12) 0px, transparent 50%),
            radial-gradient(at 40% 80%, hsl(var(--accent) / 0.1) 0px, transparent 50%);
        }
        
        .glass-effect {
          background: hsl(var(--background) / 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid hsl(var(--border) / 0.3);
        }

        .shimmer-effect {
          background: linear-gradient(
            90deg,
            transparent 0%,
            hsl(var(--primary) / 0.1) 50%,
            transparent 100%
          );
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }
      `}</style>

      <SlidingBanner />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center px-4 md:px-6 lg:px-8 overflow-hidden gradient-mesh">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-[-10%] left-[-5%] w-[40vw] md:w-[30vw] h-[40vw] md:h-[30vw] bg-primary/20 rounded-full blur-[100px] animate-float" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] md:w-[40vw] h-[50vw] md:h-[40vw] bg-secondary/15 rounded-full blur-[120px] animate-float-delayed" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] md:w-[35vw] h-[60vw] md:h-[35vw] bg-accent/10 rounded-full blur-[140px] animate-gentle-pulse" />
          </div>
        </div>

        {/* Content */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-7xl mx-auto text-center pt-20 md:pt-24 pb-12"
        >
          {/* Badge */}
          <motion.div className="flex justify-center mb-8 md:mb-12" variants={fadeInUp}>
            <div className="group inline-flex items-center gap-2 md:gap-3 px-6 py-2.5 md:px-8 md:py-3 glass-effect text-primary text-xs md:text-sm tracking-[0.15em] md:tracking-[0.2em] uppercase font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-luxury">
              <Star className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
              <span>{t("hero.cta")}</span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div variants={fadeInUp} className="relative inline-block mb-6 md:mb-10 px-4">
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-balance bg-clip-text text-transparent bg-gradient-to-br from-primary via-primary/90 to-secondary tracking-tighter leading-[0.9] drop-shadow-sm font-display">
              {t("hero.title")}
            </h1>
            <span className="absolute -top-4 -right-2 md:-top-8 md:-right-12 text-xl md:text-4xl text-primary/40 italic font-elegant rotate-12 hidden sm:block">
              Est. 2024
            </span>
          </motion.div>

          {/* Subtitle */}
          <motion.p 
            variants={fadeInUp}
            className="text-lg sm:text-xl md:text-3xl lg:text-4xl text-muted-foreground mb-10 md:mb-16 text-balance max-w-4xl mx-auto leading-relaxed font-elegant italic px-4"
          >
            {t("hero.subtitle")}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 px-4">
            <Link
              href={`/${locale}/items`}
              className="group relative px-10 py-4 md:px-14 md:py-5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-105 w-full sm:w-auto text-center overflow-hidden"
            >
              <span className="absolute inset-0 shimmer-effect"></span>
              <span className="relative z-10 flex items-center justify-center gap-2 md:gap-3 text-sm md:text-base lg:text-lg uppercase tracking-widest font-modern">
                Shop Now <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link
              href={`/${locale}/about`}
              className="group px-10 py-4 md:px-14 md:py-5 glass-effect text-foreground font-bold hover:bg-primary/10 transition-all duration-300 text-sm md:text-base lg:text-lg tracking-widest uppercase font-modern w-full sm:w-auto text-center"
            >
              Our Story
            </Link>
          </motion.div>

          {/* Hero Image */}
          <motion.div 
            style={{ y: heroY }}
            variants={fadeInUp}
            className="mt-16 md:mt-28 relative h-64 md:h-[28rem] lg:h-[32rem] w-full flex justify-center"
          >
             <div className="relative w-64 h-64 md:w-[28rem] md:h-[28rem] lg:w-[32rem] lg:h-[32rem] animate-float">
               <Image
                 src="/icon.png"
                 alt="Artisan Bread"
                 fill
                 sizes="(max-width: 768px) 300px, 500px" 
                 className="object-contain drop-shadow-2xl"
                 priority={true} 
               />
             </div>
          </motion.div>
        </motion.div>
      </section>

      {/* --- STATS BAR --- */}
      <section className="py-16 md:py-20 bg-background/50 backdrop-blur-sm relative z-20 -mt-16 md:-mt-20 pt-20 md:pt-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
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
              <div className="w-16 h-16 md:w-20 md:h-20 glass-effect flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:-translate-y-2">
                <stat.icon className="w-7 h-7 md:w-9 md:h-9 text-primary" />
              </div>
              <span className="text-xs md:text-sm font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-muted-foreground font-modern group-hover:text-primary transition-colors">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- FEATURED CATEGORIES --- */}
      <section className="py-24 md:py-32 lg:py-40 px-4 md:px-6 lg:px-8 bg-background relative overflow-hidden">
         <div className="absolute inset-0 gradient-mesh opacity-40"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-8 text-center md:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl"
            >
              <span className="inline-block mb-5 px-5 py-2 glass-effect text-primary text-xs md:text-sm font-bold uppercase tracking-[0.2em] md:tracking-[0.25em] shadow-sm font-luxury">
                Our Specialties
              </span>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-5 text-foreground font-display">
                Curated Delights
              </h2>
              <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground italic font-elegant leading-relaxed">
                Explore our most loved categories.
              </p>
            </motion.div>
            <div className="flex justify-center md:block">
              <Link
                href={`/${locale}/items`}
                className="group flex items-center gap-4 text-primary font-bold text-base md:text-lg font-modern uppercase tracking-widest hover:text-primary/80 transition-colors"
              >
                View Full Menu
                <span className="w-12 h-[2px] bg-current group-hover:w-20 transition-all duration-300" />
                <ArrowRight className="w-5 h-5 group-hover:-rotate-45 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
            {featuredItems.map((item, idx) => (
              <motion.div
                key={item.slug}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Link
                  href={`/${locale}/items/${item.slug}`}
                  className="group block h-full glass-effect shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                >
                  <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-all duration-500 ${idx % 2 === 0 ? 'bg-primary' : 'bg-secondary'}`} />
                  
                  <div className="aspect-[4/5] relative overflow-hidden p-8 md:p-10 flex items-center justify-center">
                    <div className="relative w-full h-full transform group-hover:scale-110 transition-transform duration-700">
                      <Image
                        src={item.image}
                        alt={item.name.en}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-contain drop-shadow-2xl"
                        loading="lazy"
                      />
                    </div>
                    
                    <div className="absolute top-6 right-6 glass-effect text-foreground font-bold px-5 py-2.5 font-modern text-sm shadow-sm z-10">
                      ₹{item.price}
                    </div>
                  </div>

                  <div className="p-8 md:p-10 relative">
                    <h3 className="text-2xl md:text-3xl font-bold mb-3 text-foreground font-display group-hover:text-primary transition-colors">
                      {locale === "en" ? item.name.en : item.name.bn}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2 text-sm md:text-base mb-6 font-elegant leading-relaxed">
                      {locale === "en" ? item.description.en : item.description.bn}
                    </p>
                    
                    <div className="flex items-center justify-between pt-5 border-t border-border">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.15em] flex items-center gap-2 font-modern">
                        <Sparkles className="w-3.5 h-3.5 text-accent" />
                        Top Pick
                      </span>
                      <div className="w-10 h-10 bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                         <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CategoryShowcase />

      {/* --- VIDEO GALLERY --- */}
      <section className="py-20 md:py-32 lg:py-40 px-4 md:px-6 lg:px-8 bg-muted/30 backdrop-blur-sm shadow-inner overflow-hidden">
        <div className="max-w-7xl mx-auto mb-12 md:mb-16 flex flex-col md:flex-row justify-between items-end gap-8 text-center md:text-left">
          <div className="w-full md:w-auto">
            <span className="inline-block px-5 py-2 mb-5 text-xs md:text-sm font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase glass-effect text-primary shadow-sm font-luxury">
              Behind the Scenes
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground font-display leading-tight">
              Crafting<br/>Perfection
            </h2>
          </div>
          <p className="w-full md:max-w-md text-muted-foreground font-elegant italic text-xl md:text-2xl lg:text-3xl text-center md:text-left leading-relaxed">
            "Experience the art of baking in every frame."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 h-auto md:h-[600px] lg:h-[700px] max-w-7xl mx-auto">
          {/* Main Video */}
          <div className="md:col-span-8 h-[350px] md:h-full overflow-hidden shadow-2xl relative group">
            <LazyVideo 
              src="/assets/videos/cake-edit.mp4" 
              poster="/assets/products/landing-card-1.png" 
              className="w-full h-full"
              label="Live Baking"
            />
            
            <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-20 pointer-events-none">
              <div className="flex items-center gap-2 mb-3">
                 <span className="relative flex h-2.5 w-2.5 md:h-3 md:w-3">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2.5 w-2.5 md:h-3 md:w-3 bg-red-500"></span>
                 </span>
                 <span className="text-xs md:text-sm font-bold tracking-[0.15em] uppercase text-white/90 font-modern">Live</span>
              </div>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-white drop-shadow-lg">Let's Bliss Together</h3>
            </div>
          </div>

          {/* Secondary Videos */}
          <div className="md:col-span-4 flex flex-col gap-6 md:gap-8 h-full">
            {[
              { 
                src: "https://assets.mixkit.co/videos/preview/mixkit-confectioner-decorating-a-chocolate-cake-41927-large.mp4", 
                title: "Cake Artistry",
                poster: "/assets/products/landing-card-2.png"
              },
              { 
                src: "https://assets.mixkit.co/videos/preview/mixkit-melted-cheese-pizza-close-up-41923-large.mp4", 
                title: "Melting Moments",
                poster: "/assets/products/landing-card-3.png"
              }
            ].map((vid, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="relative flex-1 overflow-hidden shadow-lg group min-h-[200px]"
              >
                <LazyVideo 
                  src={vid.src} 
                  poster={vid.poster} 
                  className="w-full h-full"
                  label={vid.title}
                />
                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-20 pointer-events-none">
                  <h4 className="text-xl md:text-2xl font-bold font-display text-white drop-shadow-md">{vid.title}</h4>
                </div>
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="w-14 h-14 md:w-16 md:h-16 glass-effect flex items-center justify-center border border-white/30">
                    <Play className="w-6 h-6 md:w-7 md:h-7 text-white fill-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CIRCULAR GALLERY --- */}
      <div className="h-[400px] md:h-[550px] lg:h-[600px] relative bg-gradient-to-b from-transparent to-background/50 overflow-hidden">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-muted-foreground font-modern">Loading Gallery...</div>}>
          <CircularGallery bend={2} items={bakeryGalleryItems} />
        </Suspense>
      </div>

      {/* --- TESTIMONIALS --- */}
      <section className="py-24 md:py-32 lg:py-40 px-4 md:px-6 lg:px-8 bg-background">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto text-center mb-16 md:mb-24"
        >
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 text-foreground/5 select-none hidden md:block font-luxury">
            TESTIMONIALS
          </h2>
          <div className="md:mt-[-5rem] relative z-10">
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-foreground">Customer Love</h3>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
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
              whileHover={{ y: -6 }}
              className="glass-effect p-10 md:p-12 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
            >
              <Quote className="absolute top-10 right-10 w-16 h-16 md:w-20 md:h-20 text-primary/10 opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="flex gap-1 mb-8">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 md:w-5 md:h-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground text-lg md:text-xl mb-10 leading-relaxed italic font-elegant relative z-10">"{t.quote}"</p>
              <div>
                <p className="font-bold text-foreground text-lg md:text-xl font-display">{t.name}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-modern mt-2">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- BRAND STORY --- */}
      <section className="relative py-28 md:py-40 lg:py-48 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-primary via-primary/90 to-secondary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-5xl mx-auto text-center"
        >
          <Award className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-10 md:mb-12 text-accent animate-pulse" />
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-black mb-8 md:mb-12 font-display text-primary-foreground leading-tight">
            {t("about.title")}
          </h2>
          <p className="text-2xl md:text-4xl lg:text-5xl mb-12 md:mb-20 font-light text-primary-foreground/95 italic font-elegant leading-normal px-4">
            "{t("about.description")}"
          </p>
          <Link
            href={`/${locale}/about`}
            className="inline-block px-12 py-5 md:px-16 md:py-6 bg-primary-foreground text-primary font-bold hover:scale-105 transition-transform uppercase tracking-[0.15em] md:tracking-[0.2em] font-modern shadow-2xl"
          >
            Read Our Philosophy
          </Link>
        </motion.div>
      </section>

      {/* --- VISIT US --- */}
      <section className="py-24 md:py-32 lg:py-40 px-4 md:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <div className="inline-block mb-6 md:mb-8 px-5 py-2 glass-effect text-primary text-xs md:text-sm font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] shadow-sm font-luxury">
              Visit Us
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-10 md:mb-12 text-foreground font-display">
              Experience the Taste
            </h2>
            <div className="space-y-10 md:space-y-12 mb-12 text-muted-foreground text-left max-w-md mx-auto md:mx-0">
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 md:w-16 md:h-16 glass-effect flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0">
                   <MapPin className="w-6 h-6 md:w-7 md:h-7 text-primary transition-colors" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-lg md:text-xl font-display mb-2">Sarisha, West Bengal</p>
                  <p className="font-clean text-base md:text-lg leading-relaxed">{details.location.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 md:w-16 md:h-16 glass-effect flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0">
                   <Clock className="w-6 h-6 md:w-7 md:h-7 text-primary transition-colors" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-lg md:text-xl font-display mb-2">Open Daily</p>
                  <p className="font-clean text-base md:text-lg">09:00 AM - 09:00 PM</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 justify-center md:justify-start">
              <Link href={`/${locale}/contact`} className="px-10 py-5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-bold font-modern uppercase tracking-widest hover:opacity-90 shadow-lg text-center transition-all hover:scale-105">
                Get Directions
              </Link>
              <Link href={"https://instagram.com/crumbsobliss_official"} className="px-10 py-5 glass-effect border-2 border-primary text-primary font-bold font-modern uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-3 text-center">
                <Instagram className="w-5 h-5" /> Follow Us
              </Link>
            </div>
          </motion.div>
           
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[350px] md:h-[600px] lg:h-[700px] overflow-hidden shadow-2xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
              alt="Bakery interior"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-10 left-10 md:bottom-14 md:left-14 text-white max-w-sm">
              <Coffee className="w-10 h-10 md:w-12 md:h-12 mb-6 md:mb-8 text-accent" />
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold font-display italic leading-tight">Fresh Slices &<br />Sweet Delights</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}