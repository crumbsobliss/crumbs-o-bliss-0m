"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  rating: number;
}

interface TestimonialSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialSection({ testimonials }: TestimonialSectionProps) {
  return (
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
        {testimonials.map((t, i) => (
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
            <p className="text-foreground text-lg md:text-xl mb-10 leading-relaxed italic font-elegant relative z-10">{`"${t.quote}"`}</p>
            <div>
              <p className="font-bold text-foreground text-lg md:text-xl font-display">{t.name}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-modern mt-2">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
