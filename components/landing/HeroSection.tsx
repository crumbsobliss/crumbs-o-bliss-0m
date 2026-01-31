"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  locale: string;
  t: any;
}

export function HeroSection({ locale, t }: HeroSectionProps) {
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
        <motion.div variants={fadeInUp} className="relative inline-block mb-6 md:mb-10 px-4 py-4">
          <h1 className="py-6 text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-balance bg-clip-text text-transparent bg-primary via-primary/90 to-secondary tracking-tighter leading-[0.9] drop-shadow-sm font-display">
            {t("hero.title")}
          </h1>
          <span className="absolute -top-4 -right-2 md:-top-8 md:-right-12 text-xl md:text-4xl text-primary/40 italic font-elegant rotate-12 hidden sm:block">
            Est. 2026
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
  );
}
