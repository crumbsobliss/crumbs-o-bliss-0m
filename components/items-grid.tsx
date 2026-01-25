"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, X, SlidersHorizontal, ChevronDown, Filter, Star } from "lucide-react"
import { 
  Playfair_Display, 
  Cinzel, 
  Cormorant_Garamond, 
  Prata, 
  Old_Standard_TT, 
  Italiana, 
  Bodoni_Moda,
  Unna
} from 'next/font/google'

// --- 8 Classical Stylish Fonts ---
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' })
const cormorant = Cormorant_Garamond({ weight: ['400', '500', '600', '700'], subsets: ['latin'], variable: '--font-cormorant' })
const prata = Prata({ weight: '400', subsets: ['latin'], variable: '--font-prata' })
const oldStandard = Old_Standard_TT({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-old-standard' })
const italiana = Italiana({ weight: '400', subsets: ['latin'], variable: '--font-italiana' })
const bodoni = Bodoni_Moda({ subsets: ['latin'], variable: '--font-bodoni' })
const unna = Unna({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-unna' })

// --- Types ---
interface BakeryItem {
  slug: string
  name: { en: string; bn: string }
  description: { en: string; bn: string }
  image: string
  price: number
  calories: number
  tags: string[]
}

interface ItemsGridProps {
  items: BakeryItem[]
  locale: string
}

type SortOption = "default" | "price-asc" | "price-desc" | "calories-asc"

export function ItemsGrid({ items, locale }: ItemsGridProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>("default")
  const [showFilters, setShowFilters] = useState(true)

  // Extract unique tags with counts
  const allTags = useMemo(() => {
    const tagCounts = new Map<string, number>()
    items.forEach((item) => {
      item.tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
      })
    })
    return Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag)
  }, [items])

  // Toggle tag selection (multi-select)
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  // Filter and Sort Logic
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Search Filter
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          !query ||
          item.name.en.toLowerCase().includes(query) ||
          item.name.bn.includes(query) ||
          item.description.en.toLowerCase().includes(query)

        // Tag Filter (AND logic)
        const matchesTags =
          selectedTags.length === 0 ||
          selectedTags.every((tag) => item.tags.includes(tag))

        return matchesSearch && matchesTags
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-asc":
            return a.price - b.price
          case "price-desc":
            return b.price - a.price
          case "calories-asc":
            return a.calories - b.calories
          default:
            return 0
        }
      })
  }, [items, searchQuery, selectedTags, sortBy])

  const hasActiveFilters = searchQuery || selectedTags.length > 0 || sortBy !== "default"

  const resetFilters = () => {
    setSearchQuery("")
    setSelectedTags([])
    setSortBy("default")
  }

  return (
    <div className={`
      ${playfair.variable} ${cinzel.variable} ${cormorant.variable} 
      ${prata.variable} ${oldStandard.variable} ${italiana.variable} 
      ${bodoni.variable} ${unna.variable}
      min-h-screen bg-background text-yellow-400 space-y-12 pb-20
    `}>
      
      {/* --- Classical Controls Dashboard --- */}
      <div className="relative">
        {/* Decorative Top Border */}
        <div className="h-1 w-full bg-[#2C241B] mb-1"></div>
        <div className="h-0.5 w-full bg-[#D4AF37] mb-6"></div>

        <div className="bg-background text-[#FDFBF7] p-6 md:p-8 shadow-2xl relative overflow-hidden">
           {/* Subtle Texture Overlay */}
           <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')]"></div>

           <div className="relative z-10 space-y-6">
              <div className="flex flex-col lg:flex-row gap-6 items-end lg:items-center justify-between">
                
                {/* Search Input - Classical Style */}
                <div className="w-full lg:w-1/3 group">
                   <label className="font-cinzel text-[#D4AF37] text-xs tracking-[0.2em] uppercase mb-2 block">Search Catalogue</label>
                   <div className="relative border-b-2 border-[#D4AF37]/30 group-focus-within:border-[#D4AF37] transition-colors pb-1">
                      <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-[#D4AF37]" />
                      <input
                        type="text"
                        placeholder={locale === "en" ? "Search delicacies..." : "অনুসন্ধান করুন..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-8 py-2 bg-transparent text-[#FDFBF7] font-cormorant text-xl placeholder:text-[#FDFBF7]/30 focus:outline-none"
                      />
                      {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className="absolute right-0 top-1/2 -translate-y-1/2 text-[#D4AF37] hover:text-white">
                          <X className="h-4 w-4" />
                        </button>
                      )}
                   </div>
                </div>

                {/* Filters & Sort Controls */}
                <div className="flex flex-wrap gap-4 items-center w-full lg:w-auto">
                    
                    {/* Sort Dropdown */}
                    <div className="relative min-w-[220px]">
                       <label className="font-cinzel text-[#D4AF37] text-xs tracking-[0.2em] uppercase mb-1 block">Arrangement</label>
                       <div className="relative">
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="w-full appearance-none bg-[#3E3429] border border-[#5D4E3C] text-[#FDFBF7] pl-4 pr-10 py-3 font-italiana text-lg cursor-pointer hover:border-[#D4AF37] transition-colors focus:outline-none"
                          >
                            <option value="default">Curator's Choice</option>
                            <option value="price-asc">Price: Ascending</option>
                            <option value="price-desc">Price: Descending</option>
                            <option value="calories-asc">Lightest First</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#D4AF37] pointer-events-none" />
                       </div>
                    </div>

                    {/* Filter Toggle Button */}
                    <div className="flex flex-col justify-end h-full mt-auto">
                      <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`h-[52px] px-6 border transition-all flex items-center gap-3 font-cinzel text-sm tracking-widest uppercase ${
                          showFilters
                            ? "bg-[#D4AF37] text-[#2C241B] border-[#D4AF37] font-bold"
                            : "bg-transparent text-[#D4AF37] border-[#D4AF37] hover:bg-[#D4AF37]/10"
                        }`}
                      >
                        <SlidersHorizontal className="h-4 w-4" />
                        <span>Filters</span>
                        {selectedTags.length > 0 && (
                          <span className="ml-1 bg-[#2C241B] text-[#D4AF37] w-5 h-5 flex items-center justify-center text-[10px] rounded-full">
                            {selectedTags.length}
                          </span>
                        )}
                      </button>
                    </div>
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#D4AF37]/20 font-unna">
                  <span className="text-[#D4AF37] italic text-lg pr-2">Active Selections:</span>
                  
                  {searchQuery && (
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#FDFBF7] text-[#2C241B] border border-[#D4AF37]">
                      <span className="font-cormorant text-lg">"{searchQuery}"</span>
                      <button onClick={() => setSearchQuery("")}><X className="h-3 w-3 hover:scale-110" /></button>
                    </span>
                  )}
                  
                  {selectedTags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-2 px-3 py-1 bg-[#3E3429] text-[#FDFBF7] border border-[#5D4E3C]">
                      <span className="font-cormorant text-lg capitalize">{tag.replace("-", " ")}</span>
                      <button onClick={() => toggleTag(tag)}><X className="h-3 w-3 hover:text-[#D4AF37]" /></button>
                    </span>
                  ))}

                  <button onClick={resetFilters} className="ml-auto text-[#D4AF37] hover:text-white font-cinzel text-xs tracking-widest border-b border-[#D4AF37] pb-0.5">
                    Clear All
                  </button>
                </div>
              )}
           </div>
        </div>

        {/* Categories Panel (Classical Menu Style) */}
        {showFilters && (
          <div className="bg-background border-b-2 border-[#D4AF37] p-6 shadow-inner">
             <div className="flex items-center justify-between mb-4">
                <h3 className="font-playfair text-2xl italic text-yellow-400">Categories & Collections</h3>
                <span className="font-cinzel text-xs text-[#8B7355] tracking-widest">{allTags.length} AVAILABLE</span>
             </div>
             <div className="flex flex-wrap gap-3">
                {allTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag)
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-6 py-2 border transition-all duration-300 font-old-standard text-lg capitalize ${
                        isSelected
                          ? "bg-[#2C241B] text-[#D4AF37] border-[#2C241B] shadow-md transform -translate-y-0.5"
                          : "bg-transparent text-[#5D4E3C] border-[#5D4E3C] hover:border-[#2C241B] hover:text-[#2C241B]"
                      }`}
                    >
                      {tag.replace("-", " ")}
                    </button>
                  )
                })}
             </div>
          </div>
        )}
      </div>

      {/* --- Results Section --- */}
      <div className="px-4 md:px-8 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-center mb-10">
           <div className="h-[1px] bg-[#D4AF37] w-24"></div>
           <span className="mx-4 font-bodoni text-xl tracking-widest">
              SHOWING {filteredItems.length} OF {items.length}
           </span>
           <div className="h-[1px] bg-[#D4AF37] w-24"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <Link
                key={item.slug}
                href={`/${locale}/items/${item.slug}`}
                className="group relative bg-background flex flex-col shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Classical Frame Border */}
                <div className="absolute inset-2 border border-accent pointer-events-none z-20 group-hover:border-[#D4AF37] transition-colors duration-500"></div>
                
                {/* Image Area */}
                <div className="relative h-[300px] overflow-hidden bg-background m-2 mb-0">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name.en}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 filter sepia-[0.15] group-hover:sepia-0"
                  />
                  {/* Price Tag Overlay - Wax Seal Style */}
                  <div className="absolute top-4 right-4 z-30">
                     <div className="bg-[#2C241B] text-[#D4AF37] w-16 h-16 rounded-full flex items-center justify-center border-2 border-[#D4AF37] shadow-lg">
                        <span className="font-prata text-lg font-bold">₹{item.price}</span>
                     </div>
                  </div>
                </div>
                
                {/* Content Area */}
                <div className="p-6 pt-8 text-center flex-1 flex flex-col bg-background relative z-10 m-2 mt-0 border-t-0">
                  <h2 className="font-playfair text-2xl font-bold mb-3 group-hover:text-[#8B4513] transition-colors leading-tight">
                    {locale === "en" ? item.name.en : item.name.bn}
                  </h2>
                  
                  {/* Decorative Divider */}
                  <div className="flex justify-center mb-4">
                     <span className="text-[#D4AF37] text-xs">♦ &nbsp; ♦ &nbsp; ♦</span>
                  </div>

                  <p className="font-cormorant text-xl mb-6 line-clamp-3 leading-relaxed flex-1">
                    {locale === "en" ? item.description.en : item.description.bn}
                  </p>
                  
                  <div className="mt-auto space-y-4">
                     {/* Tags */}
                     <div className="flex flex-wrap justify-center gap-2">
                        {item.tags.slice(0, 3).map((tag) => (
                           <span key={tag} className="text-[10px] font-cinzel tracking-widest uppercase text-[#8B7355] border-b border-[#E5E0D8] pb-1">
                              {tag}
                           </span>
                        ))}
                     </div>
                     
                     {/* Footer Info */}
                     <div className="flex justify-between items-center pt-4 border-t border-[#F4EFE6] font-old-standard text-[#8B7355]">
                        <span className="flex items-center gap-1">
                           <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
                           <span className="text-sm">Artisan</span>
                        </span>
                        <span className="italic text-sm">{item.calories} kcal</span>
                     </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-[#F4EFE6] m-4 border-double border-4 border-[#E5E0D8]">
               <div className="max-w-md mx-auto space-y-6">
                 <div className="text-6xl text-[#D4AF37] opacity-50 font-playfair italic">?</div>
                 <h3 className="font-cinzel text-3xl text-[#2C241B]">No Masterpieces Found</h3>
                 <p className="font-cormorant text-xl text-[#5D4E3C]">
                   Your specific tastes are rare. Perhaps clear your filters to explore our full collection.
                 </p>
                 <button
                    onClick={resetFilters}
                    className="px-8 py-3 bg-[#2C241B] text-[#D4AF37] font-cinzel tracking-widest uppercase text-sm border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#2C241B] transition-all"
                  >
                    View All Collections
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}