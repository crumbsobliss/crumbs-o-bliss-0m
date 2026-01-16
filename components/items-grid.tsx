"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, X, SlidersHorizontal, ChevronDown } from "lucide-react"

// Define interface locally to match the structure used in this component
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

        // Tag Filter (AND logic - item must have ALL selected tags)
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

  // Check if any filters are active
  const hasActiveFilters = searchQuery || selectedTags.length > 0 || sortBy !== "default"

  // Clear all filters
  const resetFilters = () => {
    setSearchQuery("")
    setSelectedTags([])
    setSortBy("default")
  }

  return (
    <div className="space-y-6">
      {/* Controls Section */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {/* Top Bar */}
        <div className="p-4 md:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder={
                  locale === "en" ? "Search by name or description..." : "নাম বা বর্ণনা দ্বারা খুঁজুন..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sort and Filter Toggle */}
            <div className="flex gap-2">
              <div className="relative flex-1 sm:flex-none sm:min-w-[200px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full appearance-none px-4 py-2.5 pr-10 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer"
                >
                  <option value="default">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="calories-asc">Calories: Low to High</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2.5 rounded-lg border transition-all flex items-center gap-2 ${
                  showFilters
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-input hover:bg-accent"
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {selectedTags.length > 0 && (
                  <span className="bg-background/20 px-2 py-0.5 rounded-full text-xs font-semibold">
                    {selectedTags.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/50">
              <span className="text-xs font-medium text-muted-foreground">Active:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery("")} className="hover:text-primary/70">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-accent text-accent-foreground text-xs rounded-md capitalize"
                >
                  {tag.replace("-", " ")}
                  <button onClick={() => toggleTag(tag)} className="hover:text-accent-foreground/70">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {sortBy !== "default" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                  {sortBy === "price-asc" && "Price ↑"}
                  {sortBy === "price-desc" && "Price ↓"}
                  {sortBy === "calories-asc" && "Calories ↑"}
                </span>
              )}
              <button
                onClick={resetFilters}
                className="ml-auto text-xs text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Filter Tags Section */}
        {showFilters && (
          <div className="px-4 md:px-6 pb-4 md:pb-6 border-t border-border/50 pt-4 bg-accent/5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  Categories ({allTags.length})
                </span>
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear tags
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag)
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-all capitalize font-medium ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-sm scale-105"
                          : "bg-background border border-input text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent"
                      }`}
                    >
                      {tag.replace("-", " ")}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
        <span>
          Showing <span className="font-semibold text-foreground">{filteredItems.length}</span> of{" "}
          <span className="font-semibold text-foreground">{items.length}</span> items
        </span>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <Link
              key={item.slug}
              href={`/${locale}/items/${item.slug}`}
              className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 hover:border-primary/50 transition-all duration-300 flex flex-col"
            >
              {/* IMAGE CONTAINER MODIFIED: Removed aspect-square, removed fill */}
              <div className="bg-muted relative overflow-hidden">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name.en}
                  // These props allow Next.js to optimize while respecting the CSS-defined aspect ratio
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              
              <div className="p-5 flex flex-col flex-1">
                <h2 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                  {locale === "en" ? item.name.en : item.name.bn}
                </h2>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1 leading-relaxed">
                  {locale === "en" ? item.description.en : item.description.bn}
                </p>
                <div className="flex justify-between items-center mb-3 pt-3 border-t border-border/50">
                  <span className="text-2xl font-bold text-primary">₹{item.price}</span>
                  <span className="text-xs font-semibold text-muted-foreground bg-accent px-2.5 py-1 rounded-md">
                    {item.calories} cal
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-accent/30 text-accent-foreground text-[10px] font-medium uppercase tracking-wider rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] font-medium rounded">
                      +{item.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-20 px-4">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">No items found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search terms to find what you're looking for.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}