"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";

export function VideoGallery() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { margin: "200px" });

  return (
    <section ref={containerRef} className="py-20 md:py-32 lg:py-40 px-4 md:px-6 lg:px-8 bg-muted/30 backdrop-blur-sm shadow-inner overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 md:mb-16 flex flex-col md:flex-row justify-between items-end gap-8 text-center md:text-left">
          <div className="w-full md:w-auto">
            <span className="inline-block px-5 py-2 mb-5 text-xs md:text-sm font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase glass-effect text-primary shadow-sm font-luxury">
              Featured Content
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground font-display leading-tight">
              Watch the<br/>Experience
            </h2>
          </div>
        </div>

        {/* Video Container with shadow and glass-effect borders */}
        <div className="relative w-full overflow-hidden shadow-2xl rounded-xl border border-white/10 bg-black/5 aspect-video">
          {isInView ? (
            <iframe 
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube-nocookie.com/embed/hWVJucr3Il8?si=4NgmOal7-OBgtN3b" 
              title="Crumbs O Bliss bakery experience video - watch our artisan baking process and customer testimonials"
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
        </div>
      </div>
    </section>
  );
}
