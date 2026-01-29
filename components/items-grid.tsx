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

// --- Types ---
// Updated to include 'id' ensuring compatibility with cart context
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

interface ItemsGridProps {
  items: BakeryItem[];
  locale: string;
}

type SortOption = "default" | "price-asc" | "price-desc" | "calories-asc";
type ViewMode = "grid" | "list";

export function ItemsGrid({ items, locale }: ItemsGridProps) {
  // State
  const { addItem } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [addedItems, setAddedItems] = useState<Set<string | number>>(new Set());
  const [selectedItem, setSelectedItem] = useState<BakeryItem | null>(null); // For Quick View Modal

  // --- Derived Data ---
  const allTags = useMemo(() => {
    const tagCounts = new Map<string, number>();
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
  };

  const hasActiveFilters =
    searchQuery || selectedTags.length > 0 || sortBy !== "default";

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div
      className={`
      ${playfair.variable} ${cinzel.variable} ${cormorant.variable} 
      ${prata.variable} ${oldStandard.variable} ${italiana.variable} 
      ${bodoni.variable} ${unna.variable}
      min-h-screen bg-[var(--background)] text-[var(--text)] pb-20 font-sans transition-colors duration-300
    `}
    >
      {/* --- Control Dashboard --- */}
      <div className="sticky top-0 z-40 bg-[var(--background)]/95 backdrop-blur-md border-b border-[var(--border)] shadow-sm">
        <div className="max-w-[1800px] mx-auto p-4 md:p-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-end lg:items-center justify-between">
            {/* Search */}
            <div className="w-full lg:w-1/3 relative group">
              <input
                type="text"
                placeholder={
                  locale === "en"
                    ? "Search our collection..."
                    : "অনুসন্ধান করুন..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-[var(--input)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius)] focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent outline-none transition-all font-cormorant text-xl placeholder:text-[var(--muted-foreground)]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted-foreground)]" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--primary)]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Controls Group */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* Sort */}
              <div className="relative flex-grow sm:flex-grow-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full sm:w-48 appearance-none bg-[var(--secondary)] text-[var(--secondary-foreground)] pl-4 pr-10 py-3 rounded-[var(--radius)] font-cinzel text-sm border-none cursor-pointer focus:ring-2 focus:ring-[var(--ring)] outline-none"
                >
                  <option value="default">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="calories-asc">Calories: Low to High</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)] pointer-events-none" />
              </div>

              {/* View Toggle */}
              <div className="flex bg-[var(--secondary)] p-1 rounded-[var(--radius)]">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-[calc(var(--radius)-4px)] transition-all ${viewMode === "grid" ? "bg-[var(--background)] text-[var(--primary)] shadow-sm" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`}
                  title="Grid View"
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-[calc(var(--radius)-4px)] transition-all ${viewMode === "list" ? "bg-[var(--background)] text-[var(--primary)] shadow-sm" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`}
                  title="List View"
                >
                  <ListIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-5 py-3 rounded-[var(--radius)] flex items-center gap-2 font-cinzel text-sm transition-all border ${
                  showFilters
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-transparent"
                    : "bg-transparent text-[var(--primary)] border-[var(--primary)] hover:bg-[var(--primary)]/10"
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
                {selectedTags.length > 0 && (
                  <span className="bg-[var(--highlight)] text-[var(--primary)] w-5 h-5 flex items-center justify-center text-[10px] rounded-full font-bold shadow-sm">
                    {selectedTags.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active Tags Display */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex flex-wrap items-center gap-2 pt-2 overflow-hidden"
              >
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--accent)] text-[var(--accent-foreground)] rounded-full text-sm font-medium shadow-sm"
                  >
                    {tag}
                    <button
                      onClick={() => toggleTag(tag)}
                      className="hover:bg-black/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={resetFilters}
                  className="text-[var(--destructive)] text-xs hover:underline px-2 font-bold"
                >
                  Clear All
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Categories Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="border-t border-[var(--border)] bg-[var(--card)] overflow-hidden"
            >
              <div className="max-w-[1800px] mx-auto p-4 md:p-6">
                <p className="text-[var(--muted-foreground)] font-cinzel text-xs tracking-widest mb-3 uppercase">
                  Filter by Category
                </p>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-4 py-1.5 rounded-full text-sm font-cormorant font-semibold transition-all border ${
                          isSelected
                            ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]"
                            : "bg-transparent text-[var(--muted-foreground)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- Main Grid/List Content --- */}
      <div className="max-w-[1800px] mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <span className="font-bodoni text-[var(--muted-foreground)] italic">
            Found {filteredItems.length} treasures
          </span>
        </div>

        <motion.div
          layout
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
              : "flex flex-col gap-4 max-w-4xl mx-auto"
          }
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <motion.div
                  layout
                  key={item.slug}
                  variants={itemVariants}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {viewMode === "grid" ? (
                    // --- Grid Card View ---
                    <div className="group relative bg-[var(--card)] rounded-[var(--radius)] border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-lg transition-all duration-300 h-full flex flex-col overflow-hidden">
                      {/* Image Area */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--secondary)]">
                        <Image
                          src={item.image}
                          alt={item.name.en}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                          <button
                            onClick={(e) => openQuickView(e, item)}
                            className="bg-[var(--background)] text-[var(--text)] p-3 rounded-full hover:scale-110 transition-transform shadow-xl"
                            title="Quick View"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </div>

                        {/* ADD TO CART BUTTON (Formerly Favorite) */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2">
                          <button
                            onClick={(e) => handleAddToCart(e, item)}
                            className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                              addedItems.has(item.slug)
                                ? "bg-green-600 text-white shadow-md"
                                : "bg-[var(--background)]/80 text-[var(--muted-foreground)] hover:text-[var(--primary)]"
                            }`}
                          >
                            {addedItems.has(item.slug) ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <ShoppingCart className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-playfair text-xl font-bold text-[var(--text)] leading-tight group-hover:text-[var(--primary)] transition-colors">
                            {locale === "en" ? item.name.en : item.name.bn}
                          </h3>
                          <span className="font-prata font-bold text-[var(--highlight)] text-lg whitespace-nowrap ml-2">
                            ₹{item.price}
                          </span>
                        </div>

                        <p className="font-cormorant text-[var(--muted-foreground)] text-lg line-clamp-2 mb-4 leading-snug">
                          {locale === "en"
                            ? item.description.en
                            : item.description.bn}
                        </p>

                        <div className="mt-auto pt-4 border-t border-[var(--border)] flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1 text-[var(--muted-foreground)] font-cinzel text-xs">
                            <Flame className="w-3 h-3 text-[var(--highlight)]" />
                            {item.calories} kcal
                          </span>
                          <Link
                            href={`/${locale}/items/${item.slug}`}
                            className="text-[var(--primary)] font-bold font-cinzel text-xs uppercase tracking-widest hover:underline decoration-[var(--accent)] underline-offset-4"
                          >
                            Details &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // --- List Row View ---
                    <div className="group flex flex-col sm:flex-row bg-[var(--card)] rounded-[var(--radius)] border border-[var(--border)] overflow-hidden hover:border-[var(--accent)] hover:shadow-md transition-all">
                      <div className="relative w-full sm:w-48 aspect-[4/3] sm:aspect-auto shrink-0 bg-[var(--secondary)]">
                        <Image
                          src={item.image}
                          alt={item.name.en}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-5 flex flex-col sm:flex-row flex-grow gap-4 justify-between">
                        <div className="space-y-2 flex-grow">
                          <div className="flex items-center gap-3">
                            <h3 className="font-playfair text-2xl font-bold text-[var(--text)]">
                              {locale === "en" ? item.name.en : item.name.bn}
                            </h3>
                            {/* Show small check if added */}
                            {addedItems.has(item.slug) && (
                              <Check className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                          <p className="font-cormorant text-[var(--muted-foreground)] text-lg line-clamp-2 max-w-xl">
                            {locale === "en"
                              ? item.description.en
                              : item.description.bn}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {item.tags.map((t) => (
                              <span
                                key={t}
                                className="text-xs bg-[var(--secondary)] text-[var(--secondary-foreground)] px-2 py-1 rounded-md uppercase font-cinzel"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex sm:flex-col justify-between items-end gap-4 shrink-0 border-t sm:border-t-0 sm:border-l border-[var(--border)] pt-4 sm:pt-0 sm:pl-6">
                          <span className="font-prata text-2xl text-[var(--highlight)] font-bold">
                            ₹{item.price}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => openQuickView(e, item)}
                              className="p-2 border border-[var(--border)] rounded-md hover:bg-[var(--secondary)] text-[var(--muted-foreground)]"
                              title="Quick View"
                            >
                              <Eye className="w-5 h-5" />
                            </button>

                            {/* List View Add to Cart Button */}
                            <button
                              onClick={(e) => handleAddToCart(e, item)}
                              className={`p-2 border border-[var(--border)] rounded-md hover:bg-[var(--secondary)] transition-colors ${addedItems.has(item.slug) ? "text-green-600 border-green-600 bg-green-50" : "text-[var(--muted-foreground)]"}`}
                              title="Add to Cart"
                            >
                              {addedItems.has(item.slug) ? (
                                <Check className="w-5 h-5" />
                              ) : (
                                <ShoppingCart className="w-5 h-5" />
                              )}
                            </button>

                            <Link
                              href={`/${locale}/items/${item.slug}`}
                              className="bg-[var(--primary)] text-[var(--primary-foreground)] px-6 py-2 rounded-md font-cinzel text-xs uppercase tracking-wider hover:bg-[var(--primary)]/90 flex items-center"
                            >
                              View
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <motion.div className="col-span-full py-20 text-center space-y-4">
                <div className="inline-block p-6 bg-[var(--secondary)] rounded-full mb-2">
                  <ShoppingBag className="w-12 h-12 text-[var(--muted-foreground)]" />
                </div>
                <h3 className="font-playfair text-3xl text-[var(--text)]">
                  No delicacies found
                </h3>
                <p className="font-cormorant text-xl text-[var(--muted-foreground)]">
                  Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={resetFilters}
                  className="text-[var(--highlight)] font-bold underline underline-offset-4 hover:text-[var(--accent)]"
                >
                  Clear all filters
                </button>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--card)] w-full max-w-4xl rounded-[var(--radius)] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Modal Image */}
              <div className="relative w-full md:w-1/2 aspect-video md:aspect-auto bg-[var(--secondary)]">
                <Image
                  src={selectedItem.image}
                  alt={selectedItem.name.en}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[var(--primary)] text-[var(--primary-foreground)] px-3 py-1 text-xs font-cinzel uppercase rounded-sm shadow-md">
                    Quick View
                  </span>
                </div>
              </div>

              {/* Modal Content */}
              <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <h2 className="font-playfair text-3xl font-bold text-[var(--text)]">
                      {locale === "en"
                        ? selectedItem.name.en
                        : selectedItem.name.bn}
                    </h2>
                    <div className="flex items-center gap-2">
                      {selectedItem.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-bold bg-[var(--secondary)] text-[var(--secondary-foreground)] px-2 py-0.5 rounded-sm uppercase tracking-wider"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-1 hover:bg-[var(--secondary)] rounded-full transition-colors text-[var(--muted-foreground)]"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <p className="font-cormorant text-xl text-[var(--muted-foreground)] leading-relaxed mb-8">
                  {locale === "en"
                    ? selectedItem.description.en
                    : selectedItem.description.bn}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-[var(--secondary)]/50 p-4 rounded-lg border border-[var(--border)]">
                    <span className="block text-xs font-cinzel text-[var(--muted-foreground)] uppercase mb-1">
                      Calories
                    </span>
                    <span className="block font-old-standard text-2xl text-[var(--text)]">
                      {selectedItem.calories}
                    </span>
                  </div>
                  <div className="bg-[var(--secondary)]/50 p-4 rounded-lg border border-[var(--border)]">
                    <span className="block text-xs font-cinzel text-[var(--muted-foreground)] uppercase mb-1">
                      Price
                    </span>
                    <span className="block font-prata text-2xl text-[var(--highlight)]">
                      ₹{selectedItem.price}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto flex gap-4">
                  <button
                    onClick={(e) => handleAddToCart(e, selectedItem)}
                    className={`flex-1 py-3 rounded-[var(--radius)] border border-[var(--border)] font-cinzel text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                      addedItems.has(selectedItem.slug)
                        ? "bg-green-600 border-green-600 text-white"
                        : "hover:bg-[var(--secondary)] text-[var(--text)]"
                    }`}
                  >
                    {addedItems.has(selectedItem.slug) ? (
                      <>
                        <Check className="w-4 h-4" />
                        Added
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </>
                    )}
                  </button>
                  <Link
                    href={`/${locale}/items/${selectedItem.slug}`}
                    className="flex-[2] py-3 rounded-[var(--radius)] bg-[var(--primary)] text-[var(--primary-foreground)] font-cinzel text-sm uppercase tracking-widest hover:brightness-110 transition-all text-center flex items-center justify-center shadow-lg"
                  >
                    View Full Details
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <CustomizationCTA
        title="Need something else"
        description="Design your own product"
        buttonText="Order Custom Product"
      />
    </div>
  );
}
