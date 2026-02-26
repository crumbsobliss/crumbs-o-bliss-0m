"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";

export function VideoGallery() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { margin: "200px" });

  return (
    <section ref={containerRef} className="relative py-20 md:py-32 lg:py-40 px-4 md:px-6 lg:px-8 overflow-hidden bg-background">
      {/* Decorative SVGs and background gradients */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 hover:bg-primary/30 blur-[120px] rounded-full mix-blend-multiply opacity-50 transition-colors duration-1000" />
      <div className="absolute bottom-0 right-1/4 translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-secondary/20 hover:bg-secondary/30 blur-[100px] rounded-full mix-blend-multiply opacity-50 transition-colors duration-1000" />

      {/* Abstract SVG Shapes for modern look */}
      <svg className="absolute top-24 right-[10%] w-48 h-48 text-primary/10 animate-[spin_30s_linear_infinite]" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M47.7,-57.2C59.5,-45.5,65.3,-28.4,66.3,-11.7C67.3,5,63.4,21.3,54.4,34.4C45.4,47.5,31.3,57.4,14.7,62.3C-1.9,67.2,-21,67.1,-37,59.3C-53,51.5,-65.9,36.1,-72.1,18.4C-78.3,0.7,-77.8,-19.2,-68.3,-34.7C-58.8,-50.2,-40.3,-61.3,-23.5,-63.3C-6.7,-65.3,8.4,-58.2,23.1,-54.6L47.7,-57.2Z" transform="translate(100 100)" />
      </svg>
      <svg className="absolute bottom-24 left-[10%] w-40 h-40 text-secondary/20 animate-[bounce_8s_ease-in-out_infinite]" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M51.1,-54.1C65.5,-41.2,76,-22.8,76.6,-4.1C77.2,14.6,67.9,33.5,53.8,47.1C39.7,60.7,20.8,69,2.8,65.7C-15.2,62.4,-32.3,47.5,-43.3,32.2C-54.3,16.9,-59.2,1.2,-55.8,-12.3C-52.4,-25.8,-40.7,-37.1,-27.6,-49.6C-14.5,-62.1,-0.1,-75.8,17,-73.2C34.1,-70.6,48.2,-61.7,51.1,-54.1Z" transform="translate(100 100)" />
      </svg>

      {/* Decorative dots grid */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:24px_24px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
        <div className="text-center lg:text-left max-w-2xl lg:w-1/2">
          <div className="inline-flex items-center justify-center lg:justify-start gap-2 px-5 py-2 mb-6 text-xs md:text-sm font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase bg-primary/10 text-primary border border-primary/20 rounded-full shadow-sm backdrop-blur-sm">
            <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" /></svg>
            Featured Reel
          </div>
          <h2 className="text-4xl md:text-5xl xl:text-7xl font-bold text-foreground font-display leading-[1.1] mb-6 drop-shadow-sm">
            Watch the <br /><span className="text-transparent bg-clip-text bg-yellow-500">Experience</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl font-light max-w-lg mx-auto lg:mx-0">
            Dive into the art of exquisite baking. Discover the meticulous passion and behind-the-scenes magic of Crumbs O Bliss.
          </p>
        </div>

        {/* Video Container formatted for vertically oriented Reels */}
        <div className="relative w-full max-w-sm mx-auto lg:mx-0 lg:w-1/2 flex justify-center group">
          {/* Glowing aura effect */}
          <div className="absolute inset-2 md:inset-4 bg-gradient-to-tr from-primary via-purple-500 to-secondary rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"></div>

          <div className="relative w-full max-w-[320px] md:max-w-[360px] overflow-hidden rounded-[2.5rem] border-[6px] border-foreground/5 bg-background shadow-2xl z-10 aspect-[9/16] ring-1 ring-white/10 group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 ease-out">
            {isInView ? (
              <a
                href="https://www.facebook.com/reel/1179695127320227"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/10 transition-colors duration-500 overflow-hidden group/link cursor-pointer"
              >
                {/* Beautiful dynamic gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-purple-500/80 to-secondary/80 mix-blend-multiply z-0 transition-transform duration-700 group-hover/link:scale-110"></div>
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay z-0"></div>

                {/* Animated blur orbs */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/30 rounded-full blur-[50px] z-0 pointer-events-none"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-[40px] z-0 pointer-events-none"></div>

                {/* Play Button */}
                <div className="relative z-20 w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-[0_0_30px_rgba(255,255,255,0.3)] group-hover/link:scale-110 group-hover/link:bg-white/30 transition-all duration-300">
                  <svg className="w-10 h-10 md:w-12 md:h-12 ml-2 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>

                {/* Text Content */}
                <div className="absolute bottom-12 left-0 right-0 z-20 px-6 text-center transform translate-y-4 group-hover/link:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center justify-center gap-2 text-white mb-2">
                    <svg className="w-6 h-6 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                    <span className="font-bold text-lg tracking-wide drop-shadow-md">Watch on Facebook</span>
                  </div>
                  <p className="text-white/80 text-sm font-medium drop-shadow">Click to view our artisan reel</p>
                </div>
              </a>
            ) : (
              <div className="absolute inset-0 bg-muted/40 animate-pulse backdrop-blur-xl flex items-center justify-center">
                <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* Phone notch to simulate reel viewing experience */}
            <div className="absolute top-0 inset-x-0 h-7 bg-gradient-to-b from-black/40 to-transparent flex justify-center items-start pt-[6px] rounded-t-[2.2rem] pointer-events-none">
              <div className="w-16 h-1.5 bg-white/30 backdrop-blur-md rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
