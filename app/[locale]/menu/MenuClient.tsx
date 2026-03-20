
"use client"

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut
} from "lucide-react";
import details from "@/config/details.json"

export interface MenuItem {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  description: string;
}

export default function MenuClient({ menuPages }: { menuPages: MenuItem[] }) {
  const [selectedImage, setSelectedImage] = useState<MenuItem | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Close lightbox on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedImage) return;
    
    const currentIndex = menuPages.findIndex(img => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % menuPages.length;
    setSelectedImage(menuPages[nextIndex]);
    setZoomLevel(1);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedImage) return;

    const currentIndex = menuPages.findIndex(img => img.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + menuPages.length) % menuPages.length;
    setSelectedImage(menuPages[prevIndex]);
    setZoomLevel(1);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans pb-20">
      {/* Header Section */}
      <header className="pt-20 pb-16 px-6 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 border border-[var(--accent)] text-[var(--accent)] text-[10px] uppercase tracking-[0.3em] font-bold rounded-full">
            Our Digital Menu
          </span>
          <h1 className="font-display text-5xl md:text-7xl mb-6 italic text-[var(--primary)]">
            Crumbs O' Bliss Menu
          </h1>
          <p className="font-elegant text-[var(--muted-foreground)] text-xl leading-relaxed max-w-2xl mx-auto">
            Explore our artisanal collection. Click on any page to view full details in high resolution.
          </p>
        </motion.div>
      </header>

      {/* Grid Showcase */}
      <main className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {menuPages.map((page, index) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group cursor-pointer"
              onClick={() => setSelectedImage(page)}
            >
              <div className="relative overflow-hidden rounded-sm bg-[var(--card)] shadow-2xl transition-all duration-500 group-hover:shadow-[var(--accent)]/20 group-hover:-translate-y-2 border border-[var(--border)]">
                {/* Overlay with details */}
                <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-[var(--primary)]/40 transition-all duration-500 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
                  <Maximize2 className="text-white w-12 h-12 mb-4 stroke-1" />
                  <span className="text-white font-luxury text-xs uppercase tracking-widest">View Page {index + 1}</span>
                </div>
                
                {/* The Image */}
                <img 
                  src={page.url} 
                  alt={page.title}
                  className="w-full h-auto block transition-all duration-700"
                />
              </div>

              <div className="mt-8 text-center">
                <h3 className="font-display text-2xl mb-1 text-[var(--primary)]">{page.title}</h3>
                <p className="text-[var(--accent)] font-luxury text-xs uppercase tracking-widest">{page.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Immersive Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[var(--background)] flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Top Bar */}
            <div className="absolute top-0 inset-x-0 h-20 px-8 flex items-center justify-between text-[var(--foreground)] bg-gradient-to-b from-[var(--background)] to-transparent z-10">
              <div className="flex flex-col">
                <span className="font-display text-xl italic text-[var(--primary)]">{selectedImage.title}</span>
                <span className="text-[10px] uppercase tracking-widest text-[var(--muted-foreground)]">Page {menuPages.findIndex(p => p.id === selectedImage.id) + 1} of {menuPages.length}</span>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 bg-[var(--card)] rounded-full px-4 py-2 border border-[var(--border)]">
                  <button onClick={() => setZoomLevel(prev => Math.max(1, prev - 0.5))} className="hover:text-[var(--accent)] transition-colors text-[var(--muted-foreground)]"><ZoomOut size={18}/></button>
                  <span 
                    className="text-xs font-mono w-10 text-center text-[var(--foreground)] cursor-pointer hover:text-[var(--accent)]"
                    onClick={() => setZoomLevel(1)}
                    title="Reset Zoom"
                  >
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button onClick={() => setZoomLevel(prev => Math.min(4, prev + 0.5))} className="hover:text-[var(--accent)] transition-colors text-[var(--muted-foreground)]"><ZoomIn size={18}/></button>
                </div>
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="p-2 hover:bg-[var(--card)] rounded-full transition-all text-[var(--foreground)]"
                >
                  <X size={28} />
                </button>
              </div>
            </div>

            <div className="relative w-full h-[calc(100%-80px)] flex items-center justify-center p-4 md:p-8 overflow-hidden touch-none" onClick={() => setSelectedImage(null)}>
              <div className="w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <motion.div
                  drag={zoomLevel > 1}
                  dragConstraints={{ 
                    left: -800 * (zoomLevel - 1), 
                    right: 800 * (zoomLevel - 1), 
                    top: -800 * (zoomLevel - 1), 
                    bottom: 800 * (zoomLevel - 1) 
                  }}
                  dragElastic={0}
                  initial={false}
                  animate={{ scale: zoomLevel }}
                  className="relative w-fit h-fit flex items-center justify-center"
                >
                  <motion.img
                    key={selectedImage.id}
                    src={selectedImage.url}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="max-h-[80vh] max-w-[90vw] shadow-2xl object-contain pointer-events-none select-none"
                  />
                </motion.div>
              </div>

              {/* Navigation Arrows */}
              <button 
                onClick={handlePrev}
                className="absolute left-8 p-4 bg-[var(--card)]/80 hover:bg-[var(--card)] text-[var(--foreground)] rounded-full backdrop-blur-md border border-[var(--border)] transition-all hidden md:flex items-center justify-center z-50"
              >
                <ChevronLeft size={32} />
              </button>
              <button 
                onClick={handleNext}
                className="absolute right-8 p-4 bg-[var(--card)]/80 hover:bg-[var(--card)] text-[var(--foreground)] rounded-full backdrop-blur-md border border-[var(--border)] transition-all hidden md:flex items-center justify-center z-50"
              >
                <ChevronRight size={32} />
              </button>
            </div>

            {/* Bottom Info Bar */}
            <motion.div 
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-[var(--background)] to-transparent text-[var(--foreground)]"
            >
              <div className="max-w-xl mx-auto text-center">
                <p className="text-lg font-elegant italic text-[var(--muted-foreground)] mb-4 bg-[var(--background)]/60 backdrop-blur-sm inline-block px-4 py-2 rounded-lg">
                  "{selectedImage.description}"
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Branding */}
      <footer className="mt-20 py-12 px-10 border-t border-[var(--border)] text-center">
        <p className="font-display italic text-2xl text-[var(--primary)]">Crumbs O' Bliss</p>
        <div className="mt-4 flex flex-col md:flex-row justify-center gap-4 md:gap-6 text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
          <span> {details.contact.email} </span>
          <span className="hidden md:inline text-[var(--accent)]">•</span>
          <span>{details.contact.primaryPhone}</span>
          <span className="hidden md:inline text-[var(--accent)]">•</span>
          <span> {details.location.address} </span>
        </div>
      </footer>
    </div>
  );
}
