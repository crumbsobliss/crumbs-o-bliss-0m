
import { createClient } from "@/utils/supabase/server";
import { Sparkles, ArrowRight, Package, Gift, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Special Collections | Crumbs O' Bliss",
  description: "Explore our curated special packages and gift boxes, crafted with love and bliss.",
};

export default async function CollectionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: catalogues } = await supabase
    .from('custom_catalogues')
    .select(`
      id,
      name,
      description,
      image_url,
      price,
      catalogue_items (
        product_id
      )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans pb-20 overflow-hidden">
      {/* Premium Header */}
      <header className="relative pt-24 pb-20 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[300px] bg-gradient-to-b from-primary/10 to-transparent blur-3xl opacity-50 -z-10" />
        
        <div className="max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1.5 mb-6 border border-[var(--accent)] text-[var(--accent)] text-[10px] uppercase tracking-[0.3em] font-bold rounded-full">
            Artisanal Bundles
          </span>
          <h1 className="font-display text-5xl md:text-7xl mb-8 italic text-[var(--primary)] leading-tight">
            Curated Collections <br className="hidden md:block" /> of Bliss
          </h1>
          <p className="font-elegant text-[var(--muted-foreground)] text-xl leading-relaxed max-w-2xl mx-auto">
            Discover our specialized packs, carefully combined to create the perfect celebratory experience.
          </p>
        </div>
      </header>

      {/* Collections Grid */}
      <main className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {catalogues?.map((cat, index) => (
            <Link 
                key={cat.id} 
                href={`/${locale}/collections/${cat.id}`}
                className="group block"
            >
              <div className="relative overflow-hidden rounded-sm bg-[var(--card)] shadow-2xl transition-all duration-500 group-hover:shadow-[var(--accent)]/30 group-hover:-translate-y-2 border border-[var(--border)]">
                {/* Image Section */}
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={cat.image_url || "/assets/placeholder.jpg"} 
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  
                  {/* Price Tag Overlay */}
                  {cat.price && (
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-[var(--accent)] shadow-lg z-20">
                      <span className="text-[var(--primary)] font-bold text-lg">₹{cat.price}</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <span className="px-6 py-2 border border-white text-white font-luxury text-xs uppercase tracking-[0.2em] backdrop-blur-sm">View details</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Gift className="w-4 h-4 text-[var(--accent)]" />
                    <span className="text-[10px] uppercase tracking-widest text-[var(--accent)] font-bold">{cat.catalogue_items?.length || 0} ITEMS BUNDLED</span>
                  </div>
                  
                  <h3 className="font-display text-3xl mb-3 text-[var(--primary)]">{cat.name}</h3>
                  <p className="font-elegant text-sm text-[var(--muted-foreground)] line-clamp-3 mb-6 leading-relaxed">
                    {cat.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-[var(--border)] group-hover:border-primary/30 transition-colors">
                    <span className="text-[var(--primary)] font-bold text-sm uppercase tracking-widest group-hover:underline flex items-center gap-2">
                        Explore Pack <ArrowRight className="w-4 h-4" />
                    </span>
                    <ShoppingBag className="w-5 h-5 text-[var(--muted-foreground)] opacity-50 group-hover:opacity-100 group-hover:text-[var(--primary)] transition-all" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {(!catalogues || catalogues.length === 0) && (
            <div className="text-center py-24 bg-[var(--card)] rounded-sm border border-dashed border-[var(--border)]">
                <Package className="w-16 h-16 mx-auto mb-6 text-[var(--muted-foreground)] opacity-20" />
                <h2 className="font-display text-3xl text-[var(--primary)] mb-4 italic">Our Artisanal Bundles are currently being curated</h2>
                <p className="text-[var(--muted-foreground)] font-elegant">Please check back soon for our specialized packs.</p>
            </div>
        )}
      </main>

      {/* Luxury Footer Accents */}
      <section className="mt-32 py-24 bg-primary/5 border-y border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
            <Sparkles className="w-10 h-10 mx-auto mb-8 text-[var(--accent)] opacity-60" />
            <h2 className="font-display text-4xl md:text-5xl mb-8 italic text-[var(--primary)]">Looking for something truly bespoke?</h2>
            <p className="font-elegant text-xl text-[var(--muted-foreground)] mb-12">
                While our curated collections are popular, we also specialize in 100% custom-designed experiences through our Custom Studio.
            </p>
            <Link 
                href={`/${locale}/customization`}
                className="inline-flex items-center gap-3 px-10 py-4 bg-[var(--primary)] text-white font-bold uppercase tracking-widest text-xs hover:bg-black transition-all hover:scale-105"
            >
                Enter Custom Studio <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
      </section>
    </div>
  );
}
