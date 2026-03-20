
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { 
  ArrowLeft, ShoppingBag, Send, Package, Sparkles, 
  Gift, Heart, Info, CheckCircle2 
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import details from "@/config/details.json";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string; locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: cat } = await supabase.from('custom_catalogues').select('name, description').eq('id', id).single();
  
  return {
    title: `${cat?.name || 'Collection'} | Crumbs O' Bliss`,
    description: cat?.description || "Explore our specialized packs and gifted collections.",
  }
}

export default async function CollectionDetailPage({ params }: Props) {
  const { id, locale } = await params;
  const supabase = await createClient();

  const { data: cat } = await supabase
    .from('custom_catalogues')
    .select(`
      id,
      name,
      description,
      image_url,
      price,
      created_at,
      catalogue_items (
        product_id,
        products (
          id,
          name,
          description,
          image_url,
          price
        )
      )
    `)
    .eq('id', id)
    .single();

  if (!cat) notFound();

  const waMessage = `*Inquiry for Specialized Pack* ✨\n\n*Collection:* ${cat.name}\n*Price:* ₹${cat.price || 'Market Rate'}\n\n*Description:* ${cat.description}\n\nI'm interested in ordering this curated bundle. Please let me know the availability and next steps!`.trim();
  const waUrl = `https://wa.me/${details.contact.primaryPhone}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans pb-20">
      <main className="max-w-7xl mx-auto px-6 pt-12">
        {/* Back Link */}
        <Link 
            href={`/${locale}/collections`}
            className="inline-flex items-center gap-2 mb-12 text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--accent)] hover:text-[var(--primary)] transition-all"
        >
            <ArrowLeft className="w-4 h-4" /> Back to Collections
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Left Column - Gallery */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-[4/5] md:aspect-square overflow-hidden rounded-sm bg-muted shadow-2xl border border-[var(--border)] group">
                <img 
                    src={cat.image_url || "/assets/placeholder.jpg"} 
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                {cat.price && (
                    <div className="absolute top-8 right-8 bg-white/90 dark:bg-black/80 backdrop-blur-xl px-8 py-4 rounded-full border border-[var(--accent)] shadow-2xl z-20">
                        <span className="text-[var(--primary)] font-bold text-3xl">₹{cat.price}</span>
                    </div>
                )}
                
                <div className="absolute bottom-8 left-8 flex items-center gap-3 glass-effect px-6 py-3 rounded-full opacity-80 backdrop-blur-md">
                    <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary)]">Artisanal Choice</span>
                </div>
            </div>

            {/* Sub-gallery of included items */}
            <div className="pt-12 border-t border-[var(--border)]">
                <h3 className="font-display text-2xl italic text-[var(--primary)] mb-8 flex items-center gap-3">
                    <Package className="w-6 h-6 text-[var(--accent)]" /> 
                    Inside this collection
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {cat.catalogue_items?.map((item: any) => (
                        <div key={item.products.id} className="group">
                            <div className="relative aspect-square overflow-hidden rounded-sm border border-[var(--border)] bg-muted mb-4 shadow-sm group-hover:shadow-md transition-all">
                                <img src={item.products.image_url || '/assets/placeholder.jpg'} alt={item.products.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            </div>
                            <h4 className="font-display text-lg text-[var(--primary)] mb-1">{item.products.name}</h4>
                            <p className="text-[10px] uppercase font-bold text-[var(--muted-foreground)] tracking-widest">Included Piece</p>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* Right Column - Info & Action */}
          <div className="lg:col-span-5 h-fit lg:sticky lg:top-32 space-y-12">
            <div>
                <span className="text-[10px] font-bold text-[var(--accent)] tracking-[0.3em] uppercase block mb-6 px-4 py-2 bg-primary/5 inline-block rounded-full">Specilaized Pack No. {cat.id.substring(0, 4)}</span>
                <h1 className="font-display text-5xl md:text-6xl text-[var(--primary)] mb-8 italic leading-tight">{cat.name}</h1>
                
                <div className="font-elegant text-xl text-[var(--muted-foreground)] mb-10 leading-relaxed border-l-4 border-primary/20 pl-8 py-2">
                    {cat.description}
                </div>

                <div className="space-y-6 pt-8 border-t border-[var(--border)]">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-primary/5 text-[var(--accent)]"><Gift className="w-5 h-5"/></div>
                        <div>
                            <h4 className="font-bold text-sm tracking-wide uppercase mb-1">Bundle Advantage</h4>
                            <p className="font-elegant text-sm text-[var(--muted-foreground)]">Curated items at a specialized price compared to individual picks.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-primary/5 text-[var(--accent)]"><Heart className="w-5 h-5"/></div>
                        <div>
                            <h4 className="font-bold text-sm tracking-wide uppercase mb-1">Gift-ready Packaging</h4>
                            <p className="font-elegant text-sm text-[var(--muted-foreground)]">Thoughtfully packed in our blissful signature style.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6 pt-12">
                 <a 
                    href={waUrl} 
                    target="_blank"
                    className="flex items-center justify-center gap-4 w-full bg-[var(--primary)] text-white font-bold uppercase tracking-widest text-xs py-5 px-8 shadow-2xl hover:bg-black transition-all hover:scale-[1.02] backdrop-blur-sm group"
                >
                    <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    Place Order Inquiry
                </a>
                <p className="text-center text-[10px] uppercase tracking-widest font-bold text-[var(--muted-foreground)] opacity-60">
                    Response typically expected within 2-4 business hours
                </p>
            </div>

            {/* Quick Policy Section */}
            <div className="bg-card p-8 border border-[var(--border)] space-y-4">
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
                    <Info className="w-4 h-4 opacity-50" /> Blissful Note
                </div>
                <p className="font-elegant text-sm text-[var(--muted-foreground)] leading-relaxed">
                    Collection items are fixed to ensure the specialized bundle price. For bespoke substitutions, please use our Custom Studio tool.
                </p>
                <div className="pt-4 flex flex-wrap gap-2">
                    <span className="text-[9px] uppercase font-bold tracking-widest px-3 py-1 bg-primary/5 rounded-full border border-[var(--border)]">Pre-order Required</span>
                    <span className="text-[9px] uppercase font-bold tracking-widest px-3 py-1 bg-primary/5 rounded-full border border-[var(--border)]">Fresh Daily</span>
                    <span className="text-[9px] uppercase font-bold tracking-widest px-3 py-1 bg-primary/5 rounded-full border border-[var(--border)]">Blissful Packaging</span>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
