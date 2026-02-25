import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/utils/supabase/server'
import details from '@/config/details.json'
import { ItemsGrid } from '@/components/items-grid'

export const metadata: Metadata = {
  title: `Our Menu | ${details.store.name}`,
  description: `Browse our delicious collection of ${details.items.categories.join(' & ')}. Fresh, artisanal baked goods made with care.`,
}

async function ItemsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createClient()

  // Default to English if locale is missing or invalid
  const currentLocale = locale === 'bn' ? 'bn' : 'en'

  // Fetch all active products
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)

  // Map Supabase products to the format expected by ItemsGrid (BakeryItem)
  const mappedItems = (products || []).map(p => ({
    ...p,
    id: p.id,
    slug: p.slug || p.id,
    name: { en: p.name, bn: p.name },
    description: { en: p.description, bn: p.description },
    image: p.image_url || '/assets/placeholder.jpg',
    price: p.price,
    weight: p.weight || 100, // Hardcoded for now unless added to schema
    tags: p.category ? [p.category] : [],
    currency: "INR" as const,
    ingredients: p.ingredients || [],
    calories: p.calories,
    prep_time: p.prep_time,
    is_veg: p.is_veg,
    stock: p.stock
  }))

  return (
    <div className="min-h-screen py-12 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <ItemsGrid items={mappedItems} locale={currentLocale} />
      </div>
    </div>
  )
}

export default ItemsPage
