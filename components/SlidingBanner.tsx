"use client";

import { motion } from "framer-motion";

export const SlidingBanner = () => {
  return (
    <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 overflow-hidden py-2 shadow-sm z-50 relative">
      <div className="flex whitespace-nowrap">
        <motion.div
          className="flex gap-16 text-white font-medium text-xs sm:text-sm tracking-wider uppercase px-4"
          animate={{ x: [0, -1000] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 20,
          }}
        >
          {/* Repeated text for seamless loop */}
          {[...Array(10)].map((_, i) => (
            <span key={i} className="flex items-center gap-4">
              <span>✨ Freshly Baked Happiness</span>
              <span className="text-yellow-200">•</span>
              <span>Order Now & Get 10% Off</span>
              <span className="text-yellow-200">•</span>
              <span>Free Delivery on Orders Over $50</span>
              <span className="text-yellow-200">•</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};