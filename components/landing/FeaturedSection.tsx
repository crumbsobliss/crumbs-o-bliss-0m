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
    <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6"
        >
          <div>
            <span className="inline-block mb-3 px-4 py-1.5 bg-background/20 text-background text-xs font-bold uppercase tracking-widest rounded-full">
              Handpicked Selection
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-display text-primary-foreground">
              Featured Products
            </h2>
          </div>
          <Link
            href={`/${locale}/items`}
            className="group flex items-center gap-2 text-primary-foreground/80 font-medium hover:text-white transition-all font-modern uppercase tracking-widest text-sm"
          >
            View All Menu <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12 pt-10">
          {items.map((item, index) => {
            const isSpecialItem = item.price === 0 || item.discounted_price === 0;
            const hasDiscount = !isSpecialItem && item.discounted_price && item.discounted_price > 0 && item.discounted_price < item.price;
            const discountPercent = hasDiscount ? Math.round(((item.price - item.discounted_price) / item.price) * 100) : 0;
            const bgColor = item.color || "var(--primary)";

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -12 }}
                transition={{
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                className="relative cursor-pointer flex flex-col items-center group h-full"
              >
                <Link
                  href={`/${locale}/items/${item.slug}`}
                  className="w-full h-full flex flex-col items-center"
                >
                  {/* Circle Container - Logic for Perfect Roundness */}
                  <div className="relative w-full aspect-square flex items-center justify-center">
                    {/* Background Circle */}
                    <div
                      className={`absolute inset-0 rounded-full transform group-hover:scale-105 transition-transform duration-500 shadow-xl group-hover:shadow-2xl ${isSpecialItem ? "bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]" : ""}`}
                      style={!isSpecialItem ? { backgroundColor: bgColor } : {}}
                    >
                      {/* Inner Decorative Circle */}
                      <div className="absolute inset-[10%] bg-white/40 rounded-full opacity-40 mix-blend-overlay" />
                      {/* Glow effect */}
                      <div className="absolute top-[10%] left-[10%] w-1/3 h-1/3 bg-white/30 rounded-full blur-2xl" />
                    </div>

                    {/* Discount Banner (Tilted) */}
                    {hasDiscount && (
                      <div className="absolute top-0 left-0 z-40 bg-red-600 text-white font-black font-modern text-xs md:text-sm px-4 py-1.5 shadow-xl transform translate-x-0 -translate-y-0 rotate-[-30deg] rounded-md border border-white/30">
                        -{discountPercent}% OFF
                      </div>
                    )}

                    {/* Special Item Banner */}
                    {isSpecialItem && (
                      <div className="absolute top-0 left-0 z-40 bg-[var(--highlight)] text-[#4b3000] font-black font-modern text-[10px] md:text-xs px-3 py-1.5 shadow-xl transform translate-x-0 -translate-y-0 rotate-[-30deg] rounded-md border border-white/50 uppercase tracking-widest">
                        Special
                      </div>
                    )}

                    {/* Floating Product Image */}
                    <div className="relative z-10 w-[70%] h-[70%] transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ease-out">
                      <Image
                        src={item.image}
                        alt={item.name[locale] || item.name.en}
                        fill
                        className="object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)]"
                      />
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="mt-6 text-center flex flex-col items-center flex-grow">
                    <h3 className="font-modern text-lg md:text-xl font-black line-clamp-2 transition-colors mb-4 text-[var(--primary-foreground)] group-hover:text-white">
                      {item.name[locale] || item.name.en}
                    </h3>

                    <div className="mt-auto w-full flex justify-center">
                      {isSpecialItem ? (
                        <span className="font-modern font-black text-sm md:text-base bg-white/10 px-5 py-2 rounded-full border border-white/20 text-white">
                          {locale === "en" ? "Check Details" : "বিবরণ"}
                        </span>
                      ) : hasDiscount ? (
                        <div className="flex justify-center items-center gap-3">
                          <span className="text-sm text-red-300 font-bold line-through decoration-red-300/70 opacity-90 drop-shadow-sm">
                            ₹{item.price}
                          </span>
                          <div className="flex items-baseline gap-0.5 text-[var(--highlight)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                            <span className="text-sm font-extrabold">₹</span>
                            <span className="font-modern font-black text-2xl">{item.discounted_price}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-0.5 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                          <span className="text-sm font-extrabold">₹</span>
                          <span className="font-modern font-black text-2xl">{item.price}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
