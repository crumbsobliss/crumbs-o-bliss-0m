"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Clock, Instagram, Coffee } from "lucide-react";
import details from "../../config/details.json";

interface VisitSectionProps {
  locale: string;
}

export function VisitSection({ locale }: VisitSectionProps) {
  return (
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
            <Link href={`https://share.google/p08I8OODU4upoJy48`} className="px-10 py-5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-bold font-modern uppercase tracking-widest hover:opacity-90 shadow-lg text-center transition-all hover:scale-105">
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
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80&auto=format&fit=crop"
            alt="Bakery interior showcase with fresh pastries and warm ambiance"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            loading="lazy"
            quality={75}
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-10 left-10 md:bottom-14 md:left-14 text-white max-w-sm">
            <Coffee className="w-10 h-10 md:w-12 md:h-12 mb-6 md:mb-8 text-accent" />
            <p className="text-3xl md:text-4xl lg:text-5xl font-bold font-display italic leading-tight">Fresh Slices &<br />Sweet Delights</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
