"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    id: "pizza",
    title: "Artisan Pizzas",
    subtitle: "Wood-Fired Perfection",
    image: "/assets/images/pizza.png",
    bgColor: "from-orange-400/90 to-orange-300/90",
    circleColor: "bg-orange-200",
    link: "/en/items",
  },
  {
    id: "cake",
    title: "Decadent Cakes",
    subtitle: "Sweet Celebrations",
    image: "/assets/images/cake.webp",
    bgColor: "from-pink-400/90 to-pink-300/90",
    circleColor: "bg-pink-200",
    link: "/en/items",
  },
  {
    id: "flower",
    title: "Fresh Flowers",
    subtitle: "Elegant Arrangements",
    image: "/assets/images/flowers.webp",
    bgColor: "from-purple-400/90 to-purple-300/90",
    circleColor: "bg-purple-200",
    link: "/en/items",
  },
];

export const CategoryShowcase = () => {
  const t = useTranslations("Landing");

  return (
    <section className="py-12 md:py-24 lg:py-32 px-4 md:px-6 lg:px-8 bg-transparent relative overflow-hidden">
      {/* Background Decorative Blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-20"
        >
          <span className="inline-block mb-4 px-5 py-2 bg-white/20 text-white text-xs md:text-sm font-bold uppercase tracking-[0.2em] font-luxury shadow-sm rounded-full">
            Explore Categories
          </span>
          <h2 className="text-3xl md:text-6xl lg:text-7xl font-black text-white mb-5 font-display">
            Our Specialties
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto text-sm md:text-xl lg:text-2xl font-elegant italic leading-relaxed px-4">
            Explore our most popular categories, crafted with love and the finest ingredients.
          </p>
        </motion.div>

        {/* Responsive Grid: 1 col on mobile, 3 on md+ */}
        <div className="grid grid-cols-3 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12 max-w-md md:max-w-none mx-auto">
          {categories.map((cat, index) => (
            <Link href={cat.link} key={cat.id} className="block group">
              <motion.div
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
                className="relative cursor-pointer flex flex-col items-center"
              >
                {/* Circle Container - Logic for Perfect Roundness */}
                <div className="relative w-full aspect-square flex items-center justify-center">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${cat.bgColor} rounded-full transform group-hover:scale-105 transition-transform duration-500 shadow-xl group-hover:shadow-2xl`}
                  >
                    {/* Inner Decorative Circle */}
                    <div className={`absolute inset-[10%] ${cat.circleColor} rounded-full opacity-40`} />
                    {/* Glow effect */}
                    <div className="absolute top-[10%] left-[10%] w-1/3 h-1/3 bg-white/30 rounded-full blur-2xl" />
                  </div>

                  {/* Floating Product Image */}
                  <div className="relative z-10 w-[70%] h-[70%] transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ease-out">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 60vw, 30vw"
                      className="object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)]"
                    />
                  </div>
                </div>

                {/* Text Content */}
                <div className="mt-6 text-center">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2 font-display group-hover:text-white/80 transition-colors">
                    {cat.title}
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-xs md:text-sm uppercase tracking-widest font-semibold text-white/90 group-hover:translate-x-1 transition-transform duration-300 font-modern">
                    View Selection <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16 md:mt-24"
        >
          <Link
            href="/en/items"
            className="inline-flex items-center gap-3 px-10 py-4 md:py-5 bg-white text-[var(--accent)] font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-modern uppercase tracking-widest text-sm md:text-base"
          >
            View All Products
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Cormorant+Garamond:ital,wght@1,400&family=Cinzel:wght@700&family=Space+Grotesk:wght@500;700&display=swap");

        .font-display { font-family: "Playfair Display", serif; }
        .font-elegant { font-family: "Cormorant Garamond", serif; }
        .font-luxury { font-family: "Cinzel", serif; }
        .font-modern { font-family: "Space Grotesk", sans-serif; }
      `}</style>
    </section>
  );
};