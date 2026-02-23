'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";

interface FeaturedSectionProps {
  items: any[];
  locale: string;
}

export function FeaturedSection({ items, locale }: FeaturedSectionProps) {
  const t = useTranslations("Landing");

  if (!items || items.length === 0) return null;

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6"
        >
          <div>
            <span className="inline-block mb-3 px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded-full">
              Handpicked Selection
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-display text-foreground">
              Featured Products
            </h2>
          </div>
          <Link
            href={`/${locale}/items`}
            className="group flex items-center gap-2 text-primary font-medium hover:opacity-80 transition-all font-modern uppercase tracking-widest text-sm"
          >
            View All Menu <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              {/* Image Container */}
              <div className="relative h-64 w-full bg-muted/30 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name[locale] || item.name.en}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                   <Link href={`/${locale}/items/${item.slug}`} className="w-full">
                     <div className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg font-medium shadow-lg backdrop-blur-sm">
                        <ShoppingBag className="w-4 h-4" /> View Details
                     </div>
                   </Link>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                   <h3 className="font-display text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
                     {item.name[locale] || item.name.en}
                   </h3>
                </div>
                
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4 font-modern flex-grow">
                  {item.description[locale] || item.description.en || 'A delicious treat crafted with perfection.'}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                  <span className="font-bold text-lg">
                    ₹{item.price}
                  </span>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground bg-muted px-2 py-1 rounded">
                    {item.tags[0]}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
