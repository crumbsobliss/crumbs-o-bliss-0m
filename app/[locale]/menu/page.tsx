"use client"

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  ZoomIn, 
  ZoomOut
} from "lucide-react";
import details from "@/config/details.json"
/**
 * TYPE DEFINITIONS
 */
interface MenuItem {
  id: number;
  title: string;
  subtitle: string;
  url: string;
  description: string;
}

/**
 * MENU IMAGES DATA
 */
const MENU_PAGES: MenuItem[] = [
  {
    id: 1,
    title: "Signature Viennoiserie",
    subtitle: "Hand-rolled pastries & croissants",
    url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1200",
    description: "Our world-class selection of buttery, flaky treats."
  },
  {
    id: 2,
    title: "Artisan Breads",
    subtitle: "Stone-baked & naturally leavened",
    url: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=1200",
    description: "Hand-crafted loaves using heritage grains and long fermentation."
  },
  {
    id: 3,
    title: "Patisserie & Sweets",
    subtitle: "Exquisite cakes and desserts",
    url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=1200",
    description: "The perfect ending to any occasion, designed by our master chefs."
  }
];

export default function App() {
  // Explicitly type the state to allow null or a MenuItem object
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
    if (!selectedImage) return; // Guard clause for TypeScript
    
    const currentIndex = MENU_PAGES.findIndex(img => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % MENU_PAGES.length;
    setSelectedImage(MENU_PAGES[nextIndex]);
    setZoomLevel(1);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedImage) return; // Guard clause for TypeScript

    const currentIndex = MENU_PAGES.findIndex(img => img.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + MENU_PAGES.length) % MENU_PAGES.length;
    setSelectedImage(MENU_PAGES[prevIndex]);
    setZoomLevel(1);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1a1a1a] font-sans pb-20">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;600&display=swap');
        
        :root {
          --brand-gold: #c29958;
          --brand-dark: #1a1a1a;
        }

        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* Header Section */}
      <header className="pt-20 pb-16 px-6 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 border border-[#c29958] text-[#c29958] text-[10px] uppercase tracking-[0.3em] font-semibold rounded-full">
            The Digital Menu
          </span>
          <h1 className="font-serif text-5xl md:text-7xl mb-6 italic">
            Crumbs O' Bliss Menu
          </h1>
          <p className="font-sans text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">
            Explore our artisanal collection. Click on any page to view full details in high resolution.
          </p>
        </motion.div>
      </header>

      {/* Grid Showcase */}
      <main className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {MENU_PAGES.map((page, index) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group cursor-pointer"
              onClick={() => setSelectedImage(page)}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-white shadow-2xl transition-all duration-500 group-hover:shadow-orange-100/50 group-hover:-translate-y-2">
                {/* Overlay with details */}
                <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
                  <Maximize2 className="text-white w-12 h-12 mb-4 stroke-1" />
                  <span className="text-white font-sans text-xs uppercase tracking-widest">View Page {page.id}</span>
                </div>
                
                {/* The Image */}
                <img 
                  src={page.url} 
                  alt={page.title}
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                />
              </div>

              <div className="mt-8 text-center">
                <h3 className="font-serif text-2xl mb-1">{page.title}</h3>
                <p className="text-[#c29958] font-sans text-xs uppercase tracking-widest">{page.subtitle}</p>
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
            className="fixed inset-0 z-[100] bg-[#1a1a1a] flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Top Bar */}
            <div className="absolute top-0 inset-x-0 h-20 px-8 flex items-center justify-between text-white bg-gradient-to-b from-black/50 to-transparent z-10">
              <div className="flex flex-col">
                <span className="font-serif text-xl italic">{selectedImage.title}</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-400">Page {selectedImage.id} of {MENU_PAGES.length}</span>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 bg-white/10 rounded-full px-4 py-2 border border-white/10">
                  <button onClick={() => setZoomLevel(prev => Math.max(1, prev - 0.5))} className="hover:text-[#c29958] transition-colors"><ZoomOut size={18}/></button>
                  <span className="text-xs font-mono w-10 text-center">{Math.round(zoomLevel * 100)}%</span>
                  <button onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.5))} className="hover:text-[#c29958] transition-colors"><ZoomIn size={18}/></button>
                </div>
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-all"
                >
                  <X size={28} />
                </button>
              </div>
            </div>

            {/* Main Image Container */}
            <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12 overflow-auto scrollbar-hide">
              <motion.img
                key={selectedImage.id}
                src={selectedImage.url}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: zoomLevel, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="max-h-[85vh] max-w-full shadow-2xl object-contain cursor-grab active:cursor-grabbing"
                style={{ originX: 0.5, originY: 0.5 }}
              />

              {/* Navigation Arrows */}
              <button 
                onClick={handlePrev}
                className="absolute left-8 p-4 bg-black/20 hover:bg-black/50 text-white rounded-full backdrop-blur-md border border-white/10 transition-all hidden md:block"
              >
                <ChevronLeft size={32} />
              </button>
              <button 
                onClick={handleNext}
                className="absolute right-8 p-4 bg-black/20 hover:bg-black/50 text-white rounded-full backdrop-blur-md border border-white/10 transition-all hidden md:block"
              >
                <ChevronRight size={32} />
              </button>
            </div>

            {/* Bottom Info Bar */}
            <motion.div 
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white"
            >
              <div className="max-w-xl mx-auto text-center">
                <p className="text-sm font-light text-gray-300 italic mb-4">
                  "{selectedImage.description}"
                </p>
                
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Branding */}
      <footer className="mt-20 py-12 px-10 border-t border-gray-100 text-center">
        <p className="font-serif italic text-2xl text-gray-500">Crumbs O' Bliss</p>
        <div className="mt-4 flex justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <span> {details.contact.email} </span>
          <span className="text-[#c29958]">•</span>
          <span>{details.contact.primaryPhone}</span>
          <span className="text-[#c29958]">•</span>
          <span> {details.location.address} </span>
        </div>
      </footer>
    </div>
  );
}