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
    // Top down artisan pizza transparent png
    image: "/assets/images/pizza.png",
    bgColor: "from-orange-400/90 to-orange-300/90",
    circleColor: "bg-orange-200",
    link: "/en/items",
  },
  {
    id: "cake",
    title: "Decadent Cakes",
    subtitle: "Sweet Celebrations",
    // Gourmet whole cake transparent png
    image: "/assets/images/cake.webp",
    bgColor: "from-pink-400/90 to-pink-300/90",
    circleColor: "bg-pink-200",
    link: "/en/items",
  },
  {
    id: "flower",
    title: "Fresh Flowers",
    subtitle: "Elegant Arrangements",
    // Bouquet of flowers transparent png
    image: "/assets/images/flowers.webp",
    bgColor: "from-purple-400/90 to-purple-300/90",
    circleColor: "bg-purple-200",
    link: "/en/items",
  },
];

export const CategoryShowcase = () => {
  // Note: Ensure your next-intl messages are configured for these IDs
  const t = useTranslations("Landing");
  
  return (
    <section className="py-16 md:py-24 lg:py-32 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
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
          <span className="inline-block mb-4 px-5 py-2 bg-primary/10 text-primary text-xs md:text-sm font-bold uppercase tracking-[0.2em] font-luxury shadow-sm">
            Explore Categories
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground mb-5 font-display">
            Our Specialties
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-xl lg:text-2xl font-elegant italic leading-relaxed">
            Explore our most popular categories, crafted with love and the finest ingredients.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {categories.map((cat, index) => (
            <Link href={cat.link} key={cat.id} className="block group">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -8 }}
                transition={{ 
                  delay: index * 0.08, 
                  type: "spring", 
                  stiffness: 300,
                  damping: 20 
                }}
                className="relative h-56 md:h-72 lg:h-80 overflow-visible cursor-pointer"
              >
                <div className="relative h-full w-full flex items-center justify-center">
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.bgColor} rounded-full transform group-hover:scale-105 transition-transform duration-500 shadow-xl group-hover:shadow-2xl`}>
                    <div className={`absolute inset-4 md:inset-6 ${cat.circleColor} rounded-full opacity-40`} />
                    <div className="absolute top-4 left-4 md:top-8 md:left-8 w-16 h-16 md:w-24 md:h-24 bg-white/30 rounded-full blur-2xl" />
                  </div>

                  <div className="relative z-10 w-32 h-32 md:w-44 md:h-44 lg:w-52 lg:h-52 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      unoptimized // Added because using external web URLs
                      sizes="(max-width: 768px) 150px, 250px"
                      className="object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>

                <div className="mt-4 md:mt-6 text-center px-2">
                  <h3 className="text-base md:text-xl lg:text-2xl font-bold text-foreground mb-1 font-display group-hover:text-primary transition-colors">
                    {cat.title}
                  </h3>
                  <div className="inline-flex items-center gap-2 text-xs md:text-sm uppercase tracking-widest font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-modern">
                    View <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
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
          className="text-center mt-12 md:mt-20"
        >
          <Link
            href="/en/items"
            className="inline-flex items-center gap-3 px-8 md:px-12 py-4 md:py-5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-105 font-modern uppercase tracking-widest text-sm md:text-base"
          >
            View All Products
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Cinzel:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        
        .font-display { font-family: 'Playfair Display', serif; }
        .font-elegant { font-family: 'Cormorant Garamond', serif; }
        .font-luxury { font-family: 'Cinzel', serif; }
        .font-modern { font-family: 'Space Grotesk', sans-serif; }
        .font-clean { font-family: 'DM Sans', sans-serif; }
      `}</style>
    </section>
  );
};