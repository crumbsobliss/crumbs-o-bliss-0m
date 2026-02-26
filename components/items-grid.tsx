"use client";

import React, { useState, useMemo } from "react";
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
  Share2,
  MessageCircle,
  Leaf,
  Filter,
  ArrowUpDown,
  Beef,
  IndianRupee,
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
import { BakeryItem } from "@/lib/items";
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
  weight: number;
  tags: string[];
  ingredients?: string[];
}
*/

export function ItemsGrid({ items, locale }: { items: BakeryItem[]; locale: string }) {
  // State
  const { addItem } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const [vegFilter, setVegFilter] = useState<"all" | "veg" | "non-veg">("all");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [viewMode, setViewMode] = useState("grid");
  const [addedItems, setAddedItems] = useState(new Set());
  const [selectedItem, setSelectedItem] = useState<BakeryItem | null>(null); // For Quick View Modal
  const [shareMessage, setShareMessage] = useState("");

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

        const matchesVeg = vegFilter === 'all' ? true : (vegFilter === 'veg' ? item.is_veg !== false : item.is_veg === false);

        const currentPrice = item.discounted_price && item.discounted_price > 0 && item.discounted_price < item.price ? item.discounted_price : item.price;
        const matchesMinPrice = minPrice === "" || currentPrice >= minPrice;
        const matchesMaxPrice = maxPrice === "" || currentPrice <= maxPrice;

        return matchesSearch && matchesTags && matchesVeg && matchesMinPrice && matchesMaxPrice;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-asc": {
            const priceA = a.discounted_price && a.discounted_price > 0 && a.discounted_price < a.price ? a.discounted_price : a.price;
            const priceB = b.discounted_price && b.discounted_price > 0 && b.discounted_price < b.price ? b.discounted_price : b.price;
            return priceA - priceB;
          }
          case "price-desc": {
            const priceA = a.discounted_price && a.discounted_price > 0 && a.discounted_price < a.price ? a.discounted_price : a.price;
            const priceB = b.discounted_price && b.discounted_price > 0 && b.discounted_price < b.price ? b.discounted_price : b.price;
            return priceB - priceA;
          }
          case "weight-asc":
            return (a.weight || 0) - (b.weight || 0);
          default:
            return 0;
        }
      });
  }, [items, searchQuery, selectedTags, sortBy]);

  // --- Handlers ---
  const isSpecialItem = (item: BakeryItem) => item.price === 0 || (item as any).discounted_price === 0;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleAddToCart = (e: React.MouseEvent, item: BakeryItem) => {
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

  const openQuickView = (e: React.MouseEvent, item: BakeryItem) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();
    setSelectedItem(item);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setSortBy("default");
    setVegFilter("all");
    setMinPrice("");
    setMaxPrice("");
  };

  const handleShare = async (e: React.MouseEvent, item: BakeryItem) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/${locale}/items/${item.slug}`;
    const shareData = {
      title: locale === "en" ? item.name.en : item.name.bn,
      text: locale === "en" ? item.description.en : item.description.bn,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setShareMessage(
          locale === "en"
            ? "Link copied to clipboard!"
            : "লিঙ্ক কপি করা হয়েছে!",
        );
        setTimeout(() => setShareMessage(""), 3000);
      } catch (err) {
        setShareMessage("Failed to copy link");
      }
      document.body.removeChild(textArea);
    }
  };

  const hasActiveFilters =
    searchQuery || selectedTags.length > 0 || sortBy !== "default" || vegFilter !== "all" || minPrice !== "" || maxPrice !== "";

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
      {/* Share Toast Notification */}
      <AnimatePresence>
        {shareMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-[var(--primary)] text-[var(--primary-foreground)] px-6 py-3 rounded-full shadow-2xl font-cinzel text-xs tracking-widest border border-white/20"
          >
            {shareMessage}
          </motion.div>
        )}
      </AnimatePresence>

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
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[var(--secondary)] blur-[100px]"
        />
      </div>

      {/* --- Control Dashboard --- */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-30 pt-6 px-4 md:px-8 max-w-[1920px] mx-auto"
      >
        <div className="flex flex-col lg:flex-row gap-6 items-end lg:items-center justify-between mb-6">
          {/* Search */}
          <div className="w-full lg:w-1/2 relative group">
            <motion.div whileFocus={{ scale: 1.01 }} className="relative bg-[var(--card)]/80 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[var(--border)] overflow-hidden flex items-center">
              <div className="pl-6 text-[var(--muted-foreground)] group-focus-within:text-[var(--primary)] transition-colors">
                <Search className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <input
                type="text"
                placeholder={
                  locale === "en"
                    ? "Search our collection..."
                    : "অনুসন্ধান করুন..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3.5 md:py-4 bg-transparent text-[var(--foreground)] focus:outline-none transition-all font-cormorant text-lg md:text-xl placeholder:text-[var(--muted-foreground)]"
              />
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 text-[var(--muted-foreground)] hover:text-[var(--destructive)] p-1.5 rounded-full hover:bg-[var(--destructive)]/10 transition-colors"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              )}
            </motion.div>
          </div>

          {/* Controls Group */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Sort */}
            <div className="relative group min-w-[200px] flex-grow sm:flex-grow-0">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <ArrowUpDown className="h-4 w-4 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-[var(--card)]/80 backdrop-blur-md text-[var(--foreground)] pl-10 pr-10 py-3 md:py-3.5 rounded-full font-cinzel text-[10px] md:text-xs tracking-wider border border-[var(--border)] cursor-pointer focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] outline-none transition-all hover:bg-[var(--secondary)]/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              >
                <option value="default">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="weight-asc">Weight</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)] pointer-events-none group-hover:text-[var(--primary)] transition-colors" />
            </div>

            {/* View Toggle */}
            <div className="flex bg-[var(--card)]/80 backdrop-blur-md border border-[var(--border)] p-1.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-full transition-all duration-300 relative ${viewMode === "grid"
                  ? "text-[var(--primary-foreground)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]"
                  }`}
                title="Grid View"
              >
                {viewMode === "grid" && (
                  <motion.div
                    layoutId="viewModeBg"
                    className="absolute inset-0 bg-[var(--primary)] rounded-full shadow-md"
                    transition={{
                      type: "spring",
                      bounce: 0.2,
                      duration: 0.6,
                    }}
                  />
                )}
                <LayoutGrid className="h-4 w-4 relative z-10" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 rounded-full transition-all duration-300 relative ${viewMode === "list"
                  ? "text-[var(--primary-foreground)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]"
                  }`}
                title="List View"
              >
                {viewMode === "list" && (
                  <motion.div
                    layoutId="viewModeBg"
                    className="absolute inset-0 bg-[var(--primary)] rounded-full shadow-md"
                    transition={{
                      type: "spring",
                      bounce: 0.2,
                      duration: 0.6,
                    }}
                  />
                )}
                <ListIcon className="h-4 w-4 relative z-10" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* --- Main Grid/List Content --- */}
      <div className="max-w-[1920px] mx-auto p-4 md:p-8 relative z-10">
        <div className="flex items-center justify-between mb-4 md:mb-8 px-2">
          <span className="font-bodoni text-[var(--muted-foreground)] italic text-sm md:text-lg flex items-center gap-2">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[var(--highlight)]"></span>
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
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-3 md:gap-8"
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
                      onClick={() => { window.location.href = `/${locale}/items/${item.slug}`; }}
                      className="group relative h-full flex flex-col pt-12 cursor-pointer" // leave space for cake to pop out
                    >
                      {/* Pill/Arch Background */}
                      <div
                        className={`absolute bottom-0 left-0 w-full h-[78%] rounded-[1.5rem] rounded-t-[30%] sm:rounded-[2rem] sm:rounded-t-[40%] md:rounded-[3rem] md:rounded-t-[100%] z-0 overflow-hidden transition-all duration-300 ${isSpecialItem(item) ? 'bg-gradient-to-t from-[var(--primary)] via-[var(--primary)] to-[var(--primary)]/90 shadow-[0_15px_40px_rgba(11,74,45,0.4)]' : 'bg-[var(--card)] border border-[var(--border)] group-hover:border-[var(--primary)]/30 group-hover:shadow-md'}`}
                        style={!isSpecialItem(item) && item.color ? { backgroundColor: item.color } : {}}
                      >
                      </div>

                      {/* Image Area (Popping out) */}
                      <div className="relative h-48 sm:h-56 w-full z-20 flex items-center justify-center mb-2 -mt-8 transition-transform duration-500 ease-out group-hover:scale-105 pointer-events-none">
                        <div className="relative w-40 h-40 sm:w-48 sm:h-48 drop-shadow-[0_15px_25px_rgba(0,0,0,0.25)]">
                          <Image
                            src={item.image}
                            alt={item.name.en}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>

                      <div className="absolute inset-0 z-30 pointer-events-none">
                        {/* Hover Quick Actions */}
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 pointer-events-auto">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => openQuickView(e, item)}
                            className="bg-[var(--card)] text-[var(--foreground)] p-2 md:p-3.5 rounded-full shadow-xl border border-[var(--border)] hover:border-[var(--highlight)] transition-colors"
                            title="Quick View"
                          >
                            <Eye className="w-4 h-4 md:w-5 md:h-5" />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => handleShare(e, item)}
                            className="bg-[var(--card)] text-[var(--foreground)] p-2 md:p-3.5 rounded-full shadow-xl border border-[var(--border)] hover:border-[var(--highlight)] transition-colors"
                            title="Share Delight"
                          >
                            <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                          </motion.button>
                        </div>

                        {/* Floating Top Right Action */}
                        <div className="absolute top-12 right-2 pointer-events-auto">
                          {isSpecialItem(item) ? (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `/${locale}/items/${item.slug}`; }}
                              className="p-2 md:p-3 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 bg-[var(--background)] text-green-600 border border-[var(--border)] hover:bg-[var(--secondary)]"
                              title="Order Special Item"
                            >
                              <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                            </motion.button>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => handleAddToCart(e, item)}
                              className={`p-2 md:p-3 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 ${addedItems.has(item.slug)
                                ? "bg-green-600 text-white border-transparent"
                                : "bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
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
                                    <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.button>
                          )}
                        </div>

                        {/* Tags floating on image */}
                        <div className="absolute top-12 left-2 flex flex-col gap-1.5 items-start pointer-events-auto">
                          {isSpecialItem(item) && (
                            <span className="bg-[var(--highlight)] text-[var(--primary)] px-2 py-0.5 md:px-3 md:py-1 text-[9px] md:text-[11px] font-modern font-black uppercase tracking-wider rounded-full shadow-[0_4px_10px_rgba(251,189,22,0.4)] mb-1 border-2 border-[var(--highlight)]/50">
                              Special
                            </span>
                          )}
                          {item.tags.slice(0, 2).map((tag: string) => (
                            <span
                              key={tag}
                              className="bg-white/95 backdrop-blur-sm text-[var(--primary)] font-bold px-2 py-0.5 md:px-3 md:py-1 text-[9px] md:text-[11px] font-modern uppercase tracking-wider rounded-full shadow-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 md:p-6 flex-1 flex flex-col relative z-10 text-center">
                        <Link
                          href={`/${locale}/items/${item.slug}`}
                          className="block group/title mb-2 mx-auto"
                        >
                          <h3 className={`font-modern text-base md:text-xl lg:text-2xl font-black leading-tight group-hover/title:-translate-y-1 transition-transform ${isSpecialItem(item) ? 'text-white' : 'text-[var(--text)] group-hover/title:text-[var(--primary)]'}`}>
                            {locale === "en" ? item.name.en : item.name.bn}
                          </h3>
                        </Link>

                        <p className={`font-clean text-xs md:text-sm line-clamp-2 mb-4 leading-relaxed mx-auto max-w-[90%] ${isSpecialItem(item) ? 'text-white/80' : 'text-[var(--muted-foreground)]'}`}>
                          {locale === "en"
                            ? item.description.en
                            : item.description.bn}
                        </p>

                        <div className="mt-auto flex flex-wrap items-center justify-center gap-2 mb-4">
                          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${isSpecialItem(item) ? 'bg-white/10 border-white/20 text-white' : 'bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]'}`}>
                            <Flame className={`w-3.5 h-3.5 ${isSpecialItem(item) ? 'text-orange-300' : 'text-orange-500'}`} />
                            <span className="text-xs font-bold font-modern">{item.calories || "180"} Cal</span>
                          </div>
                          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${isSpecialItem(item) ? 'bg-white/10 border-white/20 text-white' : 'bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]'}`}>
                            <svg className={`w-3.5 h-3.5 ${isSpecialItem(item) ? 'text-blue-300' : 'text-blue-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs font-bold font-modern">{item.prep_time || "40m"}</span>
                          </div>
                          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${isSpecialItem(item) ? 'bg-white/10 border-white/20 text-white' : 'bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]'}`}>
                            {item.is_veg !== false ? <Leaf className="w-3.5 h-3.5 text-green-500" /> : <Flame className="w-3.5 h-3.5 text-red-500" />}
                            <span className="text-xs font-bold font-modern">{item.is_veg !== false ? "Veg" : "Non-Veg"}</span>
                          </div>
                        </div>

                        {item.stock !== undefined && item.stock < 10 && (
                          <div className={`text-[10px] font-bold animate-pulse mb-2 ${isSpecialItem(item) ? 'text-red-200' : 'text-red-500'}`}>
                            Hurry! Only {item.stock} left
                          </div>
                        )}

                        <div className="mt-2 w-full mx-auto">
                          {isSpecialItem(item) ? (
                            <div className="w-full bg-[var(--highlight)] text-[#4b3000] font-black font-modern rounded-full py-3 flex items-center justify-center gap-2 text-sm md:text-base shadow-sm hover:scale-[1.02] transition-transform">
                              {locale === "en" ? "Contact Us" : "যোগাযোগ"} <MessageCircle className="w-4 h-4 flex-shrink-0" />
                            </div>
                          ) : (
                            <div className="w-full bg-[var(--highlight)] text-[#4b3000] font-black font-modern rounded-full py-2.5 flex justify-center gap-2 text-sm md:text-base pr-4 shadow-sm border-2 border-[var(--highlight)] hover:bg-[var(--background)] hover:text-[var(--foreground)] transition-colors relative overflow-hidden">
                              <div className="flex items-center justify-center gap-2 z-10 w-full pl-2">
                                {item.discounted_price && item.discounted_price > 0 && item.discounted_price < item.price ? (
                                  <>
                                    <div className="flex flex-col items-end leading-none translate-y-0.5">
                                      <span className="text-[11px] text-red-600/70 line-through decoration-red-500/50 font-bold tracking-wider mb-0.5">₹{item.price}</span>
                                      <div className="flex items-baseline gap-0.5 text-green-800 drop-shadow-sm">
                                        <span className="text-sm self-center font-extrabold">₹</span>
                                        <span className="text-xl leading-none">{item.discounted_price}</span>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex items-baseline gap-0.5">
                                    <span className="opacity-90 tracking-widest uppercase text-xs self-center">₹</span>
                                    <span className="leading-none text-lg">{item.price}</span>
                                  </div>
                                )}
                                <span className="text-[10px] tracking-widest font-bold self-center opacity-70 uppercase border-l border-[#4b3000]/20 pl-2">/ ITEM</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    // --- List Row View ---
                    <motion.div
                      variants={cardHoverVariants}
                      initial="rest"
                      whileHover="hover"
                      className={`group flex flex-col sm:flex-row rounded-[2rem] border overflow-hidden transition-all duration-300 relative ${isSpecialItem(item)
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] shadow-[0_15px_40px_rgba(11,74,45,0.3)]"
                        : "bg-[var(--card)] border-[var(--border)] hover:border-[var(--primary)]/30 hover:shadow-lg"
                        }`}
                      style={!isSpecialItem(item) && item.color ? { backgroundColor: item.color } : {}}
                    >
                      <div className="relative w-full sm:w-64 aspect-[4/3] sm:aspect-auto shrink-0 flex items-center justify-center overflow-hidden z-20 py-4 sm:py-0">
                        {/* Glowy Background for list view */}
                        {isSpecialItem(item) ? (
                          <div className="absolute inset-x-4 top-4 bottom-4 bg-gradient-to-r from-[var(--primary)] via-[var(--primary)] to-[var(--primary)]/90 rounded-[2rem] shadow-[0_10px_50px_rgba(11,74,45,0.4)] pointer-events-none"></div>
                        ) : (
                          <div className="absolute inset-x-4 top-4 bottom-4 bg-[var(--background)] rounded-full z-0 group-hover:bg-[var(--primary)]/5 transition-colors pointer-events-none"></div>
                        )}
                        <Image
                          src={item.image}
                          alt={item.name.en}
                          fill
                          className="object-contain p-6 md:p-8 transition-transform duration-700 ease-out group-hover:scale-110 drop-shadow-[0_15px_25px_rgba(0,0,0,0.3)] z-10"
                        />
                      </div>

                      <div className="p-4 md:p-8 flex flex-col justify-center flex-grow gap-4 relative z-20">
                        <div className="space-y-4 w-full">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-2">
                              {isSpecialItem(item) && (
                                <span className="bg-[var(--highlight)] text-[var(--primary)] px-2 py-0.5 md:px-3 md:py-1 text-[9px] md:text-[11px] font-modern font-black uppercase tracking-wider rounded-full shadow-[0_4px_10px_rgba(251,189,22,0.4)] mb-2 inline-block border border-[var(--highlight)]/50">
                                  Special Item
                                </span>
                              )}
                              <Link href={`/${locale}/items/${item.slug}`}>
                                <h3 className={`font-modern text-xl md:text-3xl font-black leading-tight group-hover:translate-x-1 transition-transform ${isSpecialItem(item) ? 'text-white' : 'text-[var(--text)] group-hover:text-[var(--primary)]'}`}>
                                  {locale === "en" ? item.name.en : item.name.bn}
                                </h3>
                              </Link>

                              <p className={`font-clean text-sm md:text-base max-w-2xl leading-relaxed line-clamp-2 ${isSpecialItem(item) ? 'text-white/80' : 'text-[var(--muted-foreground)]'}`}>
                                {locale === "en"
                                  ? item.description.en
                                  : item.description.bn}
                              </p>

                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-sm uppercase font-cinzel tracking-wider border ${isSpecialItem(item) ? 'bg-white/10 text-white/90 border-white/20' : 'bg-[var(--secondary)] text-[var(--secondary-foreground)] border-[var(--border)]'}`}>
                                  {item.calories || 180} Cal
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-sm uppercase font-cinzel tracking-wider border ${isSpecialItem(item) ? 'bg-white/10 text-white/90 border-white/20' : 'bg-[var(--secondary)] text-[var(--secondary-foreground)] border-[var(--border)]'}`}>
                                  {item.prep_time || "40-50m"}
                                </span>
                                <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-sm uppercase font-cinzel tracking-wider border ${isSpecialItem(item) ? 'bg-white/10 text-white/90 border-white/20' : 'bg-[var(--secondary)] text-[var(--secondary-foreground)] border-[var(--border)]'}`}>
                                  {item.is_veg !== false ? <Leaf className="w-3 h-3 text-green-500" /> : <Flame className="w-3 h-3 text-red-500" />}
                                  {item.is_veg !== false ? "Veg" : "Non-Veg"}
                                </span>
                              </div>

                              {item.stock !== undefined && item.stock < 10 && (
                                <div className={`text-xs font-bold animate-pulse mt-1 ${isSpecialItem(item) ? 'text-red-300' : 'text-red-500'}`}>
                                  Hurry! Only {item.stock} left in stock.
                                </div>
                              )}
                            </div>

                            <div className="flex md:flex-col items-center justify-between gap-4 border-t border-[var(--border)] md:border-none pt-4 md:pt-0 mt-4 md:mt-0 w-full md:w-auto">
                              <span className={`font-modern font-black text-xl md:text-3xl flex flex-col md:items-end ${isSpecialItem(item) ? 'text-[var(--highlight)]' : 'text-[var(--primary)]'}`}>
                                {isSpecialItem(item)
                                  ? locale === "en"
                                    ? "Details >>"
                                    : "বিবরণ"
                                  : (
                                    item.discounted_price && item.discounted_price > 0 && item.discounted_price < item.price ? (
                                      <>
                                        <span className="text-sm md:text-base text-red-500 font-bold line-through decoration-red-500/70 opacity-70 leading-none mb-1">₹{item.price}</span>
                                        <span className="text-[var(--primary)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">₹{item.discounted_price}</span>
                                      </>
                                    ) : (
                                      `₹${item.price}`
                                    )
                                  )}
                              </span>

                              {isSpecialItem(item) ? (
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  onClick={(e) => { e.preventDefault(); window.location.href = `/${locale}/items/${item.slug}`; }}
                                  className="w-full bg-[var(--highlight)] text-[#4b3000] font-modern font-bold px-6 py-3 rounded-full flex items-center justify-center gap-2 hover:bg-white transition-colors"
                                >
                                  Order via WhatsApp
                                </motion.button>
                              ) : (
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  onClick={(e) => handleAddToCart(e, item)}
                                  className={`w-full font-modern font-bold px-6 py-3 rounded-full flex items-center justify-center gap-2 transition-all shadow-md stroke-2 ${addedItems.has(item.slug)
                                    ? "bg-green-600 text-white"
                                    : "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90"
                                    }`}
                                >
                                  {addedItems.has(item.slug) ? "Added" : "Add to Cart"}
                                </motion.button>
                              )}
                            </div>
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
                    Our bakers couldn't find a match. Try adjusting your
                    filters.
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
      </div >

      {/* Floating Action Button for Filters */}
      <AnimatePresence>
        {!showFilters && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(true)}
            className="fixed bottom-24 right-6 md:bottom-32 md:right-10 z-[60] bg-[var(--primary)] text-[var(--primary-foreground)] p-4 rounded-full shadow-[0_10px_40px_rgba(11,74,45,0.4)] flex items-center justify-center border-4 border-[var(--background)]/20"
            title="Open Filters"
          >
            <Filter className="w-6 h-6 md:w-8 md:h-8" />
            {hasActiveFilters && (
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-[var(--primary)]" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Filter Drawer / Modal */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-md"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md h-full bg-[var(--background)] shadow-2xl flex flex-col border-l border-[var(--border)] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-[var(--border)] bg-[var(--card)]/50">
                <h3 className="font-playfair text-2xl font-bold flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-[var(--primary)]" /> Refine Menu
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-[var(--destructive)]/10 hover:text-[var(--destructive)] rounded-full transition-colors text-[var(--muted-foreground)]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
                {/* Active Filters Summary */}
                <AnimatePresence>
                  {hasActiveFilters && (
                    <motion.div
                      layout
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="flex flex-wrap items-center gap-2 bg-[var(--secondary)]/30 p-3 rounded-2xl border border-[var(--border)]"
                    >
                      {selectedTags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                          {tag}
                          <button onClick={() => toggleTag(tag)} className="hover:bg-black/20 rounded-full p-0.5"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                      {vegFilter !== "all" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--highlight)] text-[#4b3000] rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#4b3000]/20 font-cinzel">
                          {vegFilter === "veg" ? "Veg Only" : "Non-Veg Only"}
                        </span>
                      )}
                      {(minPrice !== "" || maxPrice !== "") && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-200 font-cinzel">
                          Price Filtered
                        </span>
                      )}
                      <button onClick={resetFilters} className="text-[var(--destructive)] text-[10px] font-bold hover:underline px-2 py-1 uppercase tracking-wider font-cinzel ml-auto">
                        Clear All
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Dietary Preference */}
                <div className="space-y-4">
                  <h4 className="font-cinzel text-xs font-bold tracking-widest text-[var(--muted-foreground)] uppercase border-b border-[var(--border)] pb-2 flex items-center gap-2">
                    <Leaf className="w-4 h-4" /> Dietary Preference
                  </h4>
                  <div className="grid grid-cols-3 gap-3 font-modern uppercase tracking-wider text-sm font-bold">
                    <button
                      onClick={() => setVegFilter("all")}
                      className={`py-3 rounded-[1rem] border-2 flex flex-col items-center justify-center gap-1 transition-all ${vegFilter === "all" ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md" : "border-transparent bg-[var(--secondary)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)]/80 hover:text-[var(--foreground)]"}`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setVegFilter("veg")}
                      className={`py-3 rounded-[1rem] border-[2px] flex flex-col items-center justify-center gap-1 transition-all ${vegFilter === "veg" ? "border-green-500 bg-green-50 text-green-700 shadow-md" : "border-transparent bg-[var(--secondary)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)]/80 hover:text-[var(--foreground)]"}`}
                    >
                      <Leaf className={`w-5 h-5 ${vegFilter === "veg" ? "text-green-600" : "opacity-50"}`} /> Veg
                    </button>
                    <button
                      onClick={() => setVegFilter("non-veg")}
                      className={`py-3 rounded-[1rem] border-[2px] flex flex-col items-center justify-center gap-1 transition-all ${vegFilter === "non-veg" ? "border-red-500 bg-red-50 text-red-700 shadow-md" : "border-transparent bg-[var(--secondary)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)]/80 hover:text-[var(--foreground)]"}`}
                    >
                      <Flame className={`w-5 h-5 ${vegFilter === "non-veg" ? "text-red-500" : "opacity-50"}`} /> Non-Veg
                    </button>
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-4">
                  <h4 className="font-cinzel text-xs font-bold tracking-widest text-[var(--muted-foreground)] uppercase border-b border-[var(--border)] pb-2 flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" /> Price Range
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : "")}
                        className="w-full pl-10 pr-4 py-3 bg-[var(--secondary)] border border-[var(--border)] rounded-[1rem] focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] outline-none font-bold text-[var(--text)] transition-shadow shadow-inner"
                      />
                    </div>
                    <span className="text-[var(--muted-foreground)] font-bold">-</span>
                    <div className="relative flex-1">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
                        className="w-full pl-10 pr-4 py-3 bg-[var(--secondary)] border border-[var(--border)] rounded-[1rem] focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] outline-none font-bold text-[var(--text)] transition-shadow shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                {/* Categories Grid */}
                <div className="space-y-4">
                  <h4 className="font-cinzel text-xs font-bold tracking-widest text-[var(--muted-foreground)] uppercase border-b border-[var(--border)] pb-2 flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4" /> Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border-2 ${isSelected ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md" : "border-transparent bg-[var(--secondary)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)]/80 hover:text-[var(--foreground)]"}`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* View Results Button */}
              <div className="p-6 border-t border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md mt-auto shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowFilters(false)}
                  className="w-full py-4 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-[1rem] font-bold uppercase tracking-wider shadow-[0_10px_20px_rgba(11,74,45,0.2)] flex items-center justify-center gap-2 text-lg font-modern"
                >
                  Apply Filters ({filteredItems.length})
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Quick View Modal --- */}
      <AnimatePresence>
        {
          selectedItem && (
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
                  <div className="absolute top-6 left-6 z-10 flex gap-2">
                    <span className="bg-[var(--background)]/90 backdrop-blur text-[var(--foreground)] px-4 py-1.5 text-xs font-cinzel uppercase tracking-[0.2em] rounded-sm shadow-lg border border-[var(--border)]">
                      Quick View
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => handleShare(e, selectedItem)}
                      className="bg-[var(--background)]/90 backdrop-blur text-[var(--foreground)] p-1.5 rounded-sm shadow-lg border border-[var(--border)]"
                    >
                      <Share2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="w-full md:w-1/2 p-5 md:p-12 flex flex-col overflow-y-auto bg-[var(--card)] relative">
                  {/* Background watermark */}
                  <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                    <Heart className="w-64 h-64 text-[var(--foreground)]" />
                  </div>

                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="space-y-3">
                      <h2 className="font-playfair text-2xl md:text-4xl font-bold text-[var(--text)]">
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
                        <span className="block text-[10px] font-cinzel text-[var(--muted-foreground)] uppercase tracking-widest mb-1">
                          Price
                        </span>
                        <span className="font-prata text-xl md:text-3xl text-[var(--highlight)] flex flex-col justify-center items-center pt-1">
                          {selectedItem.price === 0
                            ? locale === "en"
                              ? "Contact for price"
                              : "মূল্যের জন্য যোগাযোগ"
                            : (
                              selectedItem.discounted_price && selectedItem.discounted_price > 0 && selectedItem.discounted_price < selectedItem.price ? (
                                <div className="flex flex-col items-center leading-none">
                                  <span className="text-sm text-red-500/80 line-through decoration-red-500/70 mb-1">₹{selectedItem.price}</span>
                                  <span>₹{selectedItem.discounted_price}</span>
                                </div>
                              ) : (
                                `₹${selectedItem.price}`
                              )
                            )}
                        </span>
                      </div>
                      <div className="flex-1 text-center">
                        <span className="block text-[10px] font-cinzel text-[var(--muted-foreground)] uppercase tracking-widest mb-1">
                          Weight
                        </span>
                        <span className="font-old-standard text-2xl text-[var(--text)]">
                          {selectedItem.weight} grams
                        </span>
                      </div>
                    </div>

                    <p className="font-cormorant text-base md:text-xl text-[var(--muted-foreground)] leading-relaxed">
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
                      className={` flex-1 py-4 rounded-[var(--radius)] border-2 font-cinzel text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 ${addedItems.has(selectedItem.slug)
                        ? "bg-[var(--primary)] border-[var(--primary)] text-[var(--primary-foreground)]"
                        : "border-[var(--border)] hover:border-[var(--primary)] text-[var(--text)] hover:text-[var(--primary)]"
                        }`}
                    >
                      <AnimatePresence mode="wait">
                        {addedItems.has(selectedItem.slug) ? (
                          <motion.div
                            key="added"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="flex items-center gap-2"
                          >
                            <Check className="w-4 h-4" /> Added
                          </motion.div>
                        ) : (
                          <motion.div
                            key="add"
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="flex items-center gap-2"
                          >
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
          )
        }
      </AnimatePresence >
      <CustomizationCTA
        title="Need something bespoke?"
        description="Craft your own masterpiece with our chefs."
        buttonText="Start Custom Order"
      />
    </div >
  );
}
