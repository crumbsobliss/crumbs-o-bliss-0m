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
        {/* Badge
        <motion.div className="flex justify-center mb-8 md:mb-12" variants={fadeInUp}>
          <div className="group inline-flex items-center gap-2 md:gap-3 px-6 py-2.5 md:px-8 md:py-3 glass-effect text-primary text-xs md:text-sm tracking-[0.15em] md:tracking-[0.2em] uppercase font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-luxury">
            <Star className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
            <span>{t("hero.cta")}</span>
          </div>
        </motion.div> */}

        {/* Heading */}
        <motion.div variants={fadeInUp} className="relative inline-block mb-4 md:mb-6 px-4 py-4 w-full">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-balance bg-clip-text text-transparent bg-gradient-to-br from-[var(--vivid-pink)] to-[var(--accent)] tracking-tighter leading-tight drop-shadow-sm font-modern">
            Let's Bliss Together
          </h1>
        </motion.div>

        {/* Giant Arch & Cake Image */}
        <motion.div
          style={{ y: heroY }}
          variants={fadeInUp}
          className="mt-6 md:mt-10 relative flex flex-col items-center w-full max-w-3xl mx-auto"
        >
          {/* Main Cake Image placed overlapping the arch */}
          <div className="relative w-56 h-56 md:w-[22rem] md:h-[22rem] lg:w-[26rem] lg:h-[26rem] z-20 -mb-24 md:-mb-32">
            <Image
              src="/icon.png"
              alt="Crumbs O' Bliss"
              fill
              sizes="(max-width: 768px) 250px, 400px"
              className="object-contain drop-shadow-2xl"
              priority={true}
            />
          </div>

          {/* Massive Curvy Dark Green Arch */}
          <div className="relative w-full bg-primary pt-32 pb-16 md:pt-40 md:pb-20 px-6 rounded-t-[50%] flex flex-col items-center z-10 shadow-2xl">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 font-modern max-w-md text-balance leading-snug">
              When you share a cake, you share love!
            </h2>
            <p className="text-primary-foreground/80 text-sm md:text-base font-medium mb-10 max-w-sm">
              Fresh bakes made with the best ingredients
            </p>

            {/* Yellow CTA Button inside the arch taking up width */}
            <Link
              href={`/${locale}/items`}
              className="relative group w-full max-w-xs md:max-w-sm bg-[var(--highlight)] text-[#4b3000] font-bold rounded-full py-4 px-8 text-center text-lg md:text-xl shadow-[0_8px_30px_rgb(251,189,22,0.4)] hover:shadow-[0_8px_30px_rgb(251,189,22,0.6)] hover:scale-105 transition-all duration-300 font-modern flex justify-center items-center gap-2"
            >
              Buy Now & Get Offers <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
