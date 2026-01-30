"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  SlidersHorizontal,
  ChevronDown,
  Heart,
  Eye,
  LayoutGrid,
  List as ListIcon,
  ShoppingBag,
  Flame,
  Tag,
  ShoppingCart,
  Check,
} from "lucide-react";
import {
  Playfair_Display,
  Cinzel,
  Cormorant_Garamond,
  Prata,
  Old_Standard_TT,
  Italiana,
  Bodoni_Moda,
  Unna,
} from "next/font/google";
import { useCart } from "@/lib/cart-context";
import CustomizationCTA from "./tryCustom";

// --- Fonts ---
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });
const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
});
const prata = Prata({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-prata",
});
const oldStandard = Old_Standard_TT({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-old-standard",
});
const italiana = Italiana({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-italiana",
});
const bodoni = Bodoni_Moda({ subsets: ["latin"], variable: "--font-bodoni" });
const unna = Unna({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-unna",
});

// --- Types (Kept for reference, though JS doesn't strictly enforce in this file) ---
/*
interface BakeryItem {
  id: string | number;
  slug: string;
  name: { en: string; bn: string };
  description: { en: string; bn: string };
  image: string;
  price: number;
  calories: number;
  tags: string[];
  ingredients?: string[];
}
*/

export function ItemsGrid({ items, locale }) {
  // State
  const { addItem } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [addedItems, setAddedItems] = useState(new Set());
  const [selectedItem, setSelectedItem] = useState(null); // For Quick View Modal

  // --- Derived Data ---
  const allTags = useMemo(() => {
    const tagCounts = new Map();
    items.forEach((item) => {
      item.tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });
    return Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);
  }, [items]);

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          !query ||
          item.name.en.toLowerCase().includes(query) ||
          item.name.bn.includes(query) ||
          item.description.en.toLowerCase().includes(query);

        const matchesTags =
          selectedTags.length === 0 ||
          selectedTags.every((tag) => item.tags.includes(tag));

        return matchesSearch && matchesTags;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          case "calories-asc":
            return a.calories - b.calories;
          default:
            return 0;
        }
      });
  }, [items, searchQuery, selectedTags, sortBy]);

  // --- Handlers ---
  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleAddToCart = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(item, 1);

    // Visual feedback
    setAddedItems((prev) => {
      const newSet = new Set(prev);
      newSet.add(item.slug);
      return newSet;
    });

    // Remove visual feedback after delay
    setTimeout(() => {
      setAddedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item.slug);
        return newSet;
      });
    }, 2000);
  };

  const openQuickView = (e, item) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();
    setSelectedItem(item);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setSortBy("default");
  };

  const hasActiveFilters =
    searchQuery || selectedTags.length > 0 || sortBy !== "default";

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  const cardHoverVariants = {
    rest: { y: 0, boxShadow: "0px 0px 0px rgba(0,0,0,0)" },
    hover: {
      y: -8,
      boxShadow: "0px 15px 30px -10px rgba(0,0,0,0.1)", // Subtle shadow
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  return (
    <div
      className={`
      ${playfair.variable} ${cinzel.variable} ${cormorant.variable} 
      ${prata.variable} ${oldStandard.variable} ${italiana.variable} 
      ${bodoni.variable} ${unna.variable}
      min-h-screen bg-[var(--background)] text-[var(--text)] pb-24 font-sans transition-colors duration-500 selection:bg-[var(--primary)] selection:text-[var(--primary-foreground)]
    `}
    >
      {/* --- Ambient Background Elements --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.03, 0.06, 0.03],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[var(--primary)] blur-[120px]"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            opacity: [0.03, 0.05, 0.03],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[var(--secondary)] blur-[100px]"
        />
      </div>

      {/* --- Control Dashboard --- */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-40 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)] shadow-sm"
      >
        <div className="max-w-[1920px] mx-auto px-6 py-4 md:py-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-6 items-end lg:items-center justify-between">
            {/* Search */}
            <div className="w-full lg:w-1/3 relative group">
              <motion.div
                whileFocus={{ scale: 1.01 }}
                className="relative"
              >
                <input
                  type="text"
                  placeholder={
                    locale === "en"
                      ? "Search our collection..."
                      : "অনুসন্ধান করুন..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-[var(--card)]/50 text-[var(--foreground)] border border-[var(--border)] rounded-full focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] outline-none transition-all font-cormorant text-xl placeholder:text-[var(--muted-foreground)] shadow-inner"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted-foreground)] group-focus-within:text-[var(--primary)] transition-colors" />
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--destructive)] p-1 rounded-full hover:bg-[var(--destructive)]/10 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </motion.button>
                )}
              </motion.div>
            </div>

            {/* Controls Group */}
            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
              {/* Sort */}
              <div className="relative flex-grow sm:flex-grow-0 min-w-[200px]">
                <div className="relative group">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none bg-[var(--card)] text-[var(--foreground)] pl-5 pr-12 py-3.5 rounded-full font-cinzel text-xs tracking-wider border border-[var(--border)] cursor-pointer focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] outline-none transition-all hover:bg-[var(--secondary)]/50"
                  >
                    <option value="default">Featured Collection</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="calories-asc">Calories: Low to High</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)] pointer-events-none group-hover:text-[var(--primary)] transition-colors" />
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex bg-[var(--card)] border border-[var(--border)] p-1.5 rounded-full shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-full transition-all duration-300 relative ${
                    viewMode === "grid"
                      ? "text-[var(--primary-foreground)]"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]"
                  }`}
                  title="Grid View"
                >
                  {viewMode === "grid" && (
                    <motion.div
                      layoutId="viewModeBg"
                      className="absolute inset-0 bg-[var(--primary)] rounded-full shadow-md"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <LayoutGrid className="h-4 w-4 relative z-10" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 rounded-full transition-all duration-300 relative ${
                    viewMode === "list"
                      ? "text-[var(--primary-foreground)]"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]"
                  }`}
                  title="List View"
                >
                  {viewMode === "list" && (
                    <motion.div
                      layoutId="viewModeBg"
                      className="absolute inset-0 bg-[var(--primary)] rounded-full shadow-md"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <ListIcon className="h-4 w-4 relative z-10" />
                </button>
              </div>

              {/* Filter Toggle */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`px-6 py-3.5 rounded-full flex items-center gap-2.5 font-cinzel text-xs tracking-widest transition-all border shadow-sm ${
                  showFilters
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-transparent shadow-[var(--primary)]/20"
                    : "bg-[var(--card)] text-[var(--primary)] border-[var(--border)] hover:border-[var(--primary)]"
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
                {selectedTags.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-[var(--background)] text-[var(--primary)] w-5 h-5 flex items-center justify-center text-[10px] rounded-full font-bold shadow-sm"
                  >
                    {selectedTags.length}
                  </motion.span>
                )}
              </motion.button>
            </div>
          </div>

          {/* Active Tags Display */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex flex-wrap items-center gap-2 overflow-hidden"
              >
                {selectedTags.map((tag) => (
                  <motion.span
                    key={tag}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-2 pl-3 pr-1.5 py-1.5 bg-[var(--accent)] text-[var(--accent-foreground)] rounded-full text-xs font-cinzel tracking-wide shadow-sm border border-[var(--accent)]/50"
                  >
                    {tag}
                    <button
                      onClick={() => toggleTag(tag)}
                      className="hover:bg-black/10 rounded-full p-1 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </motion.span>
                ))}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={resetFilters}
                  className="text-[var(--destructive)] text-xs font-bold hover:underline px-3 py-1 font-cinzel tracking-wider uppercase opacity-70 hover:opacity-100 transition-opacity"
                >
                  Clear All
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Categories Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="border-t border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-md overflow-hidden"
            >
              <div className="max-w-[1920px] mx-auto p-4 md:px-6 md:pb-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-px bg-[var(--border)] flex-1"></div>
                    <p className="text-[var(--muted-foreground)] font-cinzel text-[10px] tracking-[0.2em] uppercase">
                    Refine by Category
                    </p>
                    <div className="h-px bg-[var(--border)] flex-1"></div>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center">
                  {allTags.map((tag, idx) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <motion.button
                        key={tag}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        onClick={() => toggleTag(tag)}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-5 py-2 rounded-full text-sm font-cormorant font-semibold transition-all duration-300 border ${
                          isSelected
                            ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] shadow-md"
                            : "bg-[var(--background)] text-[var(--muted-foreground)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-sm"
                        }`}
                      >
                        {tag}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* --- Main Grid/List Content --- */}
      <div className="max-w-[1920px] mx-auto p-6 md:p-8 relative z-10">
        <div className="flex items-center justify-between mb-8 px-2">
          <span className="font-bodoni text-[var(--muted-foreground)] italic text-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--highlight)]"></span>
            Displaying {filteredItems.length} curated delights
          </span>
        </div>

        <motion.div
          layout
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8"
              : "flex flex-col gap-6 max-w-5xl mx-auto"
          }
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <motion.div
                  layout
                  key={item.slug}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="h-full"
                >
                  {viewMode === "grid" ? (
                    // --- Grid Card View ---
                    <motion.div
                      variants={cardHoverVariants}
                      initial="rest"
                      whileHover="hover"
                      className="group relative bg-[var(--card)] rounded-[var(--radius)] overflow-hidden h-full flex flex-col border border-[var(--border)] transition-colors duration-300 hover:border-[var(--primary)]/30"
                    >
                      {/* Image Area */}
                      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--secondary)]">
                        <Image
                          src={item.image}
                          alt={item.name.en}
                          fill
                          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                        {/* Hover Quick Actions */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => openQuickView(e, item)}
                            className="bg-[var(--background)] text-[var(--foreground)] p-3.5 rounded-full shadow-xl border border-[var(--border)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] hover:border-[var(--primary)] transition-colors"
                            title="Quick View"
                          >
                            <Eye className="w-5 h-5" />
                          </motion.button>
                        </div>

                        {/* Floating Top Right Action */}
                        <div className="absolute top-4 right-4 z-20">
                           <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => handleAddToCart(e, item)}
                            className={`p-3 rounded-full backdrop-blur-md shadow-lg border transition-all duration-300 ${
                              addedItems.has(item.slug)
                                ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]"
                                : "bg-[var(--background)]/90 text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--primary)] hover:border-[var(--primary)]"
                            }`}
                          >
                            <AnimatePresence mode="wait">
                              {addedItems.has(item.slug) ? (
                                <motion.div
                                  key="check"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                >
                                  <Check className="w-5 h-5" />
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="cart"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                >
                                  <ShoppingCart className="w-5 h-5" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.button>
                        </div>
                        
                        {/* Tags floating on image */}
                        <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
                             {item.tags.slice(0, 2).map(tag => (
                                 <span key={tag} className="bg-[var(--background)]/90 backdrop-blur-sm text-[var(--foreground)] px-2 py-0.5 text-[10px] font-cinzel uppercase tracking-wider rounded-sm border border-[var(--border)] shadow-sm">
                                     {tag}
                                 </span>
                             ))}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col relative bg-[var(--card)]">
                        {/* Decorative Line */}
                        <div className="w-12 h-0.5 bg-[var(--primary)] mb-4 opacity-50 group-hover:w-full transition-all duration-500 ease-out" />

                        <div className="flex justify-between items-start gap-4 mb-2">
                          <Link href={`/${locale}/items/${item.slug}`} className="block group/title">
                              <h3 className="font-playfair text-xl font-bold text-[var(--text)] leading-tight group-hover/title:text-[var(--primary)] transition-colors">
                                {locale === "en" ? item.name.en : item.name.bn}
                              </h3>
                          </Link>
                          <span className="font-prata font-bold text-[var(--highlight)] text-xl whitespace-nowrap">
                            ₹{item.price}
                          </span>
                        </div>

                        <p className="font-cormorant text-[var(--muted-foreground)] text-lg line-clamp-2 mb-5 leading-relaxed group-hover:text-[var(--foreground)] transition-colors duration-300">
                          {locale === "en"
                            ? item.description.en
                            : item.description.bn}
                        </p>

                        <div className="mt-auto flex items-center justify-between text-sm border-t border-[var(--border)] pt-4 border-dashed group-hover:border-solid transition-all">
                          <span className="flex items-center gap-1.5 text-[var(--muted-foreground)] font-cinzel text-xs tracking-wide">
                            <Flame className="w-3.5 h-3.5 text-[var(--highlight)]" />
                            {item.calories} kcal
                          </span>
                          <Link
                            href={`/${locale}/items/${item.slug}`}
                            className="text-[var(--primary)] font-bold font-cinzel text-[10px] uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform"
                          >
                            View Details &rarr;
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    // --- List Row View ---
                    <motion.div
                      variants={cardHoverVariants}
                      initial="rest"
                      whileHover="hover"
                      className="group flex flex-col sm:flex-row bg-[var(--card)] rounded-[var(--radius)] border border-[var(--border)] overflow-hidden transition-all duration-300 hover:border-[var(--primary)]/30 hover:shadow-lg"
                    >
                      <div className="relative w-full sm:w-64 aspect-[4/3] sm:aspect-auto shrink-0 bg-[var(--secondary)] overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name.en}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                      </div>
                      
                      <div className="p-6 flex flex-col sm:flex-row flex-grow gap-6 justify-between items-center">
                        <div className="space-y-3 flex-grow w-full">
                          <div className="flex items-center gap-3">
                            <Link href={`/${locale}/items/${item.slug}`}>
                                <h3 className="font-playfair text-2xl font-bold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">
                                {locale === "en" ? item.name.en : item.name.bn}
                                </h3>
                            </Link>
                          </div>
                          <p className="font-cormorant text-[var(--muted-foreground)] text-lg line-clamp-2 max-w-2xl leading-relaxed">
                            {locale === "en"
                              ? item.description.en
                              : item.description.bn}
                          </p>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {item.tags.map((t) => (
                              <span
                                key={t}
                                className="text-[10px] bg-[var(--secondary)] text-[var(--secondary-foreground)] px-2.5 py-1 rounded-sm uppercase font-cinzel tracking-wider"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex sm:flex-col justify-between items-center sm:items-end gap-5 shrink-0 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-[var(--border)] pt-4 sm:pt-0 sm:pl-8 border-dashed">
                          <div className="text-right">
                              <span className="block font-prata text-3xl text-[var(--highlight)] font-bold mb-1">
                                ₹{item.price}
                              </span>
                              <span className="block text-[var(--muted-foreground)] font-cinzel text-xs flex items-center justify-end gap-1">
                                  <Flame className="w-3 h-3"/> {item.calories} kcal
                              </span>
                          </div>
                          
                          <div className="flex gap-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => openQuickView(e, item)}
                              className="p-2.5 border border-[var(--border)] rounded-full hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                              title="Quick View"
                            >
                              <Eye className="w-5 h-5" />
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => handleAddToCart(e, item)}
                              className={`p-2.5 border rounded-full transition-all duration-300 ${
                                addedItems.has(item.slug) 
                                ? "text-[var(--primary-foreground)] bg-[var(--primary)] border-[var(--primary)] shadow-md" 
                                : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                                }`}
                              title="Add to Cart"
                            >
                                {addedItems.has(item.slug) ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="col-span-full py-24 text-center space-y-6 bg-[var(--card)]/30 rounded-3xl border border-dashed border-[var(--border)]"
              >
                <div className="inline-block p-8 bg-[var(--secondary)] rounded-full mb-2 animate-pulse">
                  <ShoppingBag className="w-16 h-16 text-[var(--muted-foreground)] opacity-50" />
                </div>
                <div className="space-y-2">
                    <h3 className="font-playfair text-4xl text-[var(--text)] italic">
                    No delicacies found
                    </h3>
                    <p className="font-cormorant text-2xl text-[var(--muted-foreground)] max-w-md mx-auto">
                    Our bakers couldn't find a match. Try adjusting your filters.
                    </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetFilters}
                  className="px-8 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-full font-cinzel text-sm tracking-widest uppercase shadow-lg hover:shadow-xl transition-all"
                >
                  Clear all filters
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* --- Quick View Modal --- */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--card)] w-full max-w-5xl rounded-[var(--radius)] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] border border-[var(--border)]"
            >
              {/* Modal Image */}
              <div className="relative w-full md:w-1/2 aspect-video md:aspect-auto bg-[var(--secondary)] group">
                <Image
                  src={selectedItem.image}
                  alt={selectedItem.name.en}
                  fill
                  className="object-cover"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                <div className="absolute top-6 left-6 z-10">
                  <span className="bg-[var(--background)]/90 backdrop-blur text-[var(--foreground)] px-4 py-1.5 text-xs font-cinzel uppercase tracking-[0.2em] rounded-sm shadow-lg border border-[var(--border)]">
                    Quick View
                  </span>
                </div>
              </div>

              {/* Modal Content */}
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto bg-[var(--card)] relative">
                 {/* Background watermark */}
                 <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                    <Heart className="w-64 h-64 text-[var(--foreground)]" />
                 </div>

                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="space-y-3">
                    <h2 className="font-playfair text-4xl font-bold text-[var(--text)]">
                      {locale === "en"
                        ? selectedItem.name.en
                        : selectedItem.name.bn}
                    </h2>
                    <div className="flex items-center gap-2">
                      {selectedItem.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-bold bg-[var(--secondary)] text-[var(--secondary-foreground)] px-2.5 py-1 rounded-full uppercase tracking-widest font-cinzel"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ rotate: 90 }}
                    onClick={() => setSelectedItem(null)}
                    className="p-2 hover:bg-[var(--destructive)]/10 hover:text-[var(--destructive)] rounded-full transition-colors text-[var(--muted-foreground)]"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>

                <div className="space-y-6 mb-10 relative z-10">
                    <div className="flex items-center gap-4 py-4 border-y border-[var(--border)] border-dashed">
                         <div className="flex-1 text-center border-r border-[var(--border)] border-dashed">
                             <span className="block text-[10px] font-cinzel text-[var(--muted-foreground)] uppercase tracking-widest mb-1">Price</span>
                             <span className="font-prata text-3xl text-[var(--highlight)]">₹{selectedItem.price}</span>
                         </div>
                         <div className="flex-1 text-center">
                             <span className="block text-[10px] font-cinzel text-[var(--muted-foreground)] uppercase tracking-widest mb-1">Energy</span>
                             <span className="font-old-standard text-2xl text-[var(--text)]">{selectedItem.calories} kcal</span>
                         </div>
                    </div>

                    <p className="font-cormorant text-xl text-[var(--muted-foreground)] leading-relaxed">
                    {locale === "en"
                        ? selectedItem.description.en
                        : selectedItem.description.bn}
                    </p>
                </div>

                {/* Actions */}
                <div className="mt-auto flex gap-4 relative z-10">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => handleAddToCart(e, selectedItem)}
                    className={`flex-1 py-4 rounded-[var(--radius)] border-2 font-cinzel text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 ${
                      addedItems.has(selectedItem.slug)
                        ? "bg-[var(--primary)] border-[var(--primary)] text-[var(--primary-foreground)]"
                        : "border-[var(--border)] hover:border-[var(--primary)] text-[var(--text)] hover:text-[var(--primary)]"
                    }`}
                  >
                    <AnimatePresence mode="wait">
                        {addedItems.has(selectedItem.slug) ? (
                            <motion.div key="added" initial={{y:10, opacity:0}} animate={{y:0, opacity:1}} className="flex items-center gap-2">
                                <Check className="w-4 h-4" /> Added
                            </motion.div>
                        ) : (
                            <motion.div key="add" initial={{y:-10, opacity:0}} animate={{y:0, opacity:1}} className="flex items-center gap-2">
                                <ShoppingCart className="w-4 h-4" /> Add to Cart
                            </motion.div>
                        )}
                    </AnimatePresence>
                  </motion.button>
                  
                  <Link
                    href={`/${locale}/items/${selectedItem.slug}`}
                    className="flex-[1.5]"
                  >
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full h-full rounded-[var(--radius)] bg-[var(--text)] text-[var(--background)] font-cinzel text-sm uppercase tracking-widest hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] transition-all shadow-xl"
                      >
                        View Full Details
                      </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <CustomizationCTA
        title="Need something bespoke?"
        description="Craft your own masterpiece with our chefs."
        buttonText="Start Custom Order"
      />
    </div>
  );
}