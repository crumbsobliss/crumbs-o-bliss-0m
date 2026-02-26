"use client";

import { motion } from "framer-motion";
import { Leaf, Clock, ChefHat, Award } from "lucide-react";

export function StatsBar() {
  const stats = [
    { icon: Leaf, label: "100% Organic" },
    { icon: Clock, label: "Wood Fired" },
    { icon: ChefHat, label: "Hand Crafted" },
    { icon: Award, label: "Master Chefs" },
  ];

  return (
    <section className="py-8 md:py-12 bg-transparent relative z-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center text-center gap-4 group"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/40 border border-white/60 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:-translate-y-2 backdrop-blur-sm">
              <stat.icon className="w-7 h-7 md:w-9 md:h-9 text-[var(--primary)]" />
            </div>
            <span className="text-xs md:text-sm font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-[#4b3000]/70 font-modern group-hover:text-[#4b3000] transition-colors">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
