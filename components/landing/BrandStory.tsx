"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Award } from "lucide-react";

interface BrandStoryProps {
  locale: string;
  t: any;
}

export function BrandStory({ locale, t }: BrandStoryProps) {
  return (
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
          {`"${t("about.description")}"`}
        </p>
        <Link
          href={`/${locale}/about`}
          className="inline-block px-12 py-5 md:px-16 md:py-6 bg-primary-foreground text-primary font-bold hover:scale-105 transition-transform uppercase tracking-[0.15em] md:tracking-[0.2em] font-modern shadow-2xl"
        >
          Read Our Philosophy
        </Link>
      </motion.div>
    </section>
  );
}
