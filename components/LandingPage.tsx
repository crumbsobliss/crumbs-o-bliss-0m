"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight, Star, Leaf, Clock, Award, MapPin, Instagram,
  Coffee, Play, Quote, ChefHat
} from "lucide-react";
import CircularGallery from "@/components/CircularGallery";
import details from "@/config/details.json";

// --- No External Font Imports ---
// We rely on standard CSS fonts: font-sans, font-serif, font-mono

interface LandingPageProps {
  locale: string;
  featuredItems: any[];
  bakeryGalleryItems: any[];
}

export function LandingPage({ locale, featuredItems, bakeryGalleryItems }: LandingPageProps) {
  const t = useTranslations();
  const { scrollY } = useScroll();
  
  // Parallax effects
  const heroY = useTransform(scrollY, [0, 1000], [0, 400]);
  const blobY = useTransform(scrollY, [0, 1000], [0, -200]);

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  return (
    <div className="w-full overflow-x-hidden bg-[var(--background)] text-[var(--foreground)] font-sans selection:bg-[var(--highlight)] selection:text-[var(--primary)]">
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-[var(--hero-bg-start)] via-[var(--hero-bg-via)] to-[var(--hero-bg-end)]">
        
        {/* Animated Background Blobs */}
        <motion.div style={{ y: blobY }} className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-[var(--blob-1)] rounded-full blur-[120px] opacity-40" 
          />
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[var(--blob-2)] rounded-full blur-[140px] opacity-40" 
          />
        </motion.div>

        {/* Content */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-7xl mx-auto text-center pt-10"
        >
          {/* Badge */}
          <motion.div  className="flex justify-center mb-10" variants={fadeInUp}>
            <div className="group inline-flex items-center gap-3 px-8 py-3 rounded-full bg-[var(--badge-bg)] backdrop-blur-xl border border-[var(--badge-border)] text-[var(--badge-text)] text-xs tracking-[0.2em] uppercase font-bold shadow-2xl hover:scale-105 transition-transform font-sans">
              <Star className="w-4 h-4 text-[var(--badge-icon)] animate-[spin_4s_linear_infinite]" />
              <span>{t("hero.cta")}</span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div variants={fadeInUp} animate="active" className="relative inline-block mb-8">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-balance bg-clip-text text-transparent bg-gradient-to-r from-[var(--text-heading-grad-from)] via-[var(--text-heading-grad-via)] to-[var(--text-heading-grad-to)] tracking-tighter leading-[0.9] drop-shadow-lg font-serif">
              {t("hero.title")}
            </h1>
            <motion.span 
              initial={{ opacity: 0, rotate: -10, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 12, scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="absolute -top-12 -right-8 md:-right-16 text-5xl text-[var(--divider-color)] italic font-serif rotate-12 hidden md:block"
            >
              Est. 2024
            </motion.span>
          </motion.div>

          {/* Subtitle */}
          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-3xl text-[var(--text-body-color)] mb-16 text-balance max-w-4xl mx-auto leading-relaxed font-serif italic"
          >
            {t("hero.subtitle")}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-6 font-mono">
            <Link
              href={`/${locale}/items`}
              className="group relative px-12 py-5 bg-gradient-to-r from-[var(--btn-primary-start)] to-[var(--btn-primary-end)] text-white font-bold rounded-full overflow-hidden shadow-2xl shadow-[var(--btn-shadow)] hover:shadow-[var(--highlight)]/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <span className="relative z-10 flex items-center gap-3 text-lg uppercase tracking-widest">
                Shop Collection <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </span>
            </Link>

            <Link
              href={`/${locale}/about`}
              className="group px-12 py-5 bg-transparent border-2 border-[var(--badge-border)] text-[var(--badge-text)] font-bold rounded-full hover:bg-[var(--badge-bg)] transition-all text-lg tracking-widest uppercase font-sans"
            >
              Our Story
            </Link>
          </motion.div>

          {/* Hero Image Parallax */}
          <motion.div 
            style={{ y: heroY }}
            variants={fadeInUp}
            className="mt-24 relative h-64 md:h-96 w-full pointer-events-none md:pointer-events-auto flex justify-center"
          >
             <div className="relative w-64 h-64 md:w-96 md:h-96 animate-float">
               <Image
                 src="/icon.png"
                 alt="Artisan Bread"
                 fill
                 className="object-contain drop-shadow-2xl"
                 priority
               />
             </div>
          </motion.div>
        </motion.div>
      </section>

      {/* --- STATS BAR --- */}
      <section className="py-16 bg-[var(--lp-card-bg)] border-y border-[var(--lp-card-border)] relative z-20">
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
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-4 group"
            >
              <div className="w-16 h-16 rounded-full bg-[var(--background)] flex items-center justify-center border border-[var(--badge-border)] group-hover:border-[var(--highlight)] transition-colors shadow-lg">
                <stat.icon className="w-8 h-8 text-[var(--badge-icon)] group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-sm md:text-base font-bold uppercase tracking-[0.2em] text-[var(--text-body-color)] font-sans group-hover:text-[var(--badge-text)] transition-colors">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- VIDEO GALLERY --- */}
      <section className="py-32 px-4 bg-[var(--background)] overflow-hidden">
        <div className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1 mb-6 text-xs font-bold tracking-[0.3em] uppercase border border-[var(--badge-border)] text-[var(--badge-text)] rounded-full font-mono">
              Behind the Scenes
            </span>
            <h2 className="text-5xl md:text-7xl font-bold text-[var(--text-heading-grad-from)] font-serif leading-tight">
              Crafting<br/>Perfection
            </h2>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-md text-[var(--text-body-color)] font-serif italic text-3xl text-right md:text-left leading-relaxed"
          >
            "From the wood-fired oven to your plate, experience the art of baking."
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-auto md:h-[700px] max-w-7xl mx-auto">
          {/* Main Video */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-8 h-[500px] md:h-full rounded-[2rem] overflow-hidden shadow-2xl border border-[var(--lp-card-border)] group relative"
          >
            <video 
              autoPlay loop muted playsInline 
              className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
              
            >
              <source src="/assets/videos/cake-edit.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            <div className="absolute bottom-10 left-10 z-20">
              <div className="flex items-center gap-3 mb-4">
                 <span className="relative flex h-3 w-3">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                 </span>
                 <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/90 font-sans">Live</span>
              </div>
              <h3 className="text-4xl font-bold font-serif text-white mb-3">Let's Bliss Together</h3>
            </div>
          </motion.div>

          {/* Secondary Videos */}
          <div className="md:col-span-4 flex flex-col gap-8 h-full">
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
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + (idx * 0.2) }}
                className="relative flex-1 rounded-[2rem] overflow-hidden border border-[var(--lp-card-border)] group"
              >
                <video 
                  autoPlay loop muted playsInline 
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                  poster={vid.poster}
                >
                  <source src={vid.src} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-500" />
                <div className="absolute bottom-6 left-6 z-10">
                  <h4 className="text-xl font-bold font-serif text-white">{vid.title}</h4>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-50 group-hover:scale-100">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/50">
                    <Play className="w-6 h-6 text-white fill-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CIRCULAR GALLERY --- */}
      <div className="h-[500px] relative bg-gradient-to-b from-[var(--background)] to-[var(--feat-bg-start)] border-t border-[var(--border)] overflow-hidden">
        <CircularGallery bend={2} items={bakeryGalleryItems} />
      </div>

      {/* --- FEATURED COLLECTIONS --- */}
      <section className="py-32 px-4 bg-gradient-to-b from-[var(--feat-bg-start)] to-[var(--feat-bg-end)]">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8"
          >
            <motion.div variants={fadeInUp} className="max-w-2xl">
              <span className="inline-block mb-6 px-4 py-1 bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] text-xs font-bold uppercase tracking-[0.25em] rounded-full font-sans">
                Selected Works
              </span>
              <h2 className="text-5xl md:text-8xl font-black mb-6 text-[var(--text-heading-grad-from)] font-serif">
                {t("items.title")}
              </h2>
              <p className="text-2xl text-[var(--text-body-color)] italic font-serif opacity-80">
                {t("items.description")}
              </p>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Link
                href={`/${locale}/items`}
                className="group flex items-center gap-3 text-[var(--text-heading-grad-via)] font-bold text-lg font-mono uppercase tracking-widest hover:text-[var(--primary)] transition-colors"
              >
                View Full Menu
                <span className="w-12 h-[1px] bg-current group-hover:w-20 transition-all duration-300" />
                <ArrowRight className="w-5 h-5 group-hover:-rotate-45 transition-transform duration-300" />
              </Link>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredItems.map((item, idx) => (
              <motion.div
                key={item.slug}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
              >
                <Link
                  href={`/${locale}/items/${item.slug}`}
                  className="group block h-full bg-[var(--lp-card-bg)] rounded-[2rem] overflow-hidden border border-[var(--lp-card-border)] hover:border-[var(--lp-card-border-hover)] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name.en}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur text-[var(--text)] font-bold px-6 py-2 rounded-full border border-[var(--border)] font-sans text-lg tracking-wider shadow-lg">
                      ₹{item.price}
                    </div>
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  <div className="p-8">
                    <h3 className="text-3xl font-bold mb-3 text-[var(--text-heading-grad-from)] font-serif group-hover:text-[var(--badge-icon)] transition-colors">
                      {locale === "en" ? item.name.en : item.name.bn}
                    </h3>
                    <p className="text-[var(--text-body-color)] line-clamp-2 text-lg mb-6 font-serif opacity-80 leading-relaxed">
                      {locale === "en" ? item.description.en : item.description.bn}
                    </p>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-[var(--lp-card-border)]">
                      <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-[0.2em] flex items-center gap-2 font-sans">
                        <span className="w-2 h-2 rounded-full bg-[var(--badge-icon)] animate-pulse" />
                        {item.calories} Cal
                      </span>
                      <span className="text-sm font-bold text-[var(--badge-icon)] uppercase tracking-widest group-hover:underline underline-offset-4 decoration-2 font-sans">
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
      <section className="py-32 px-4 bg-[var(--background)]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto text-center mb-20"
        >
          <h2 className="text-6xl md:text-8xl font-black mb-6 text-[var(--text-heading-grad-from)] font-sans opacity-20">
            TESTIMONIALS
          </h2>
          <div className="mt-[-4rem] relative z-10">
            <h3 className="text-4xl md:text-5xl font-bold font-serif text-[var(--foreground)]">Customer Love</h3>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Priya Sharma", role: "Food Blogger", quote: "The truffle pizza here is absolutely divine. A masterpiece of flavors.", rating: 5 },
            { name: "Rahul Mehta", role: "Local Chef", quote: "Finally, an authentic bakery that respects traditional methods. Truly exceptional.", rating: 5 },
            { name: "Anita Desai", role: "Regular Customer", quote: "I drive 30 minutes just for their red velvet cake. It's that good.", rating: 5 },
          ].map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-[var(--lp-card-bg)] p-10 rounded-[2rem] border border-[var(--lp-card-border)] hover:border-[var(--highlight)] shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              <Quote className="absolute top-8 right-8 w-16 h-16 text-[var(--badge-icon)] opacity-10 group-hover:opacity-20 transition-opacity" />
              <div className="flex gap-1 mb-8">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-[var(--badge-icon)] text-[var(--badge-icon)]" />
                ))}
              </div>
              <p className="text-[var(--text-body-color)] text-xl mb-8 leading-relaxed italic font-serif relative z-10">"{t.quote}"</p>
              <div>
                <p className="font-bold text-[var(--badge-text)] text-xl font-serif">{t.name}</p>
                <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-widest font-sans mt-1">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- BRAND STORY --- */}
      <section className="relative py-40 px-4 bg-gradient-to-br from-[var(--brand-bg-start)] via-[var(--brand-bg-via)] to-[var(--brand-bg-end)] text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-5xl mx-auto text-center"
        >
          <Award className="w-20 h-20 mx-auto mb-10 text-[var(--badge-icon)] animate-pulse" />
          <h2 className="text-5xl md:text-8xl font-black mb-10 font-serif text-white leading-tight">
            {t("about.title")}
          </h2>
          <p className="text-3xl md:text-6xl mb-16 font-light text-white/90 italic font-serif leading-normal">
            "{t("about.description")}"
          </p>
          <Link
            href={`/${locale}/about`}
            className="inline-block px-14 py-5 bg-white text-[var(--brand-bg-start)] font-bold rounded-full hover:scale-110 transition-transform uppercase tracking-[0.2em] font-sans shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            Read Our Philosophy
          </Link>
        </motion.div>
      </section>

      {/* --- VISIT US --- */}
      <section className="py-32 px-4 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-block mb-6 px-4 py-1 bg-[var(--badge-bg)] text-[var(--badge-text)] text-xs font-bold uppercase tracking-[0.2em] rounded-full font-mono border border-[var(--badge-border)]">
              Visit Us
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-10 text-[var(--text-heading-grad-from)] font-serif">
              Experience the Taste
            </h2>
            <div className="space-y-10 mb-12 text-[var(--text-body-color)]">
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-full bg-[var(--secondary)] flex items-center justify-center group-hover:bg-[var(--badge-icon)] transition-colors">
                   <MapPin className="w-6 h-6 text-[var(--foreground)] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="font-bold text-[var(--foreground)] text-xl font-serif mb-1">Sarisha, West Bengal</p>
                  <p className="font-sans text-lg opacity-80">{details.location.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-full bg-[var(--secondary)] flex items-center justify-center group-hover:bg-[var(--badge-icon)] transition-colors">
                   <Clock className="w-6 h-6 text-[var(--foreground)] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="font-bold text-[var(--foreground)] text-xl font-serif mb-1">Open Daily</p>
                  <p className="font-sans text-lg opacity-80">09:00 AM - 09:00 PM</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              <Link href={`/${locale}/contact`} className="px-10 py-4 bg-gradient-to-r from-[var(--btn-primary-start)] to-[var(--btn-primary-end)] text-white font-bold rounded-full font-sans uppercase tracking-widest hover:opacity-90 shadow-lg">
                Get Directions
              </Link>
              <Link href={"https://instagram.com/crumbsobliss_official"} className="px-10 py-4 rounded-full border-2 border-[var(--badge-text)] text-[var(--badge-text)] font-bold font-sans uppercase tracking-widest hover:bg-[var(--badge-text)] hover:text-white transition-all flex items-center gap-2">
                <Instagram className="w-5 h-5" /> Follow Us
              </Link>
            </div>
          </motion.div>
           
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 1.5 }}
            className="relative h-[600px] rounded-[3rem] overflow-hidden border-8 border-[var(--lp-card-border)] shadow-2xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
              alt="Bakery interior"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-bg-end)] via-transparent to-transparent opacity-90" />
            <div className="absolute bottom-12 left-12 text-white max-w-sm">
              <Coffee className="w-10 h-10 mb-6 text-[var(--badge-icon)]" />
              <p className="text-5xl font-bold font-serif italic leading-tight">Fresh Slices &<br />Sweet Delights</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}