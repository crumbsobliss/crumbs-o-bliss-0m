import type { Metadata } from "next"
import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import ItemPageClient from "./ItemPageClient"

interface ItemPageProps {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export async function generateMetadata({ params }: ItemPageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const supabase = await createClient()

  // For SEO, try to fetch by matching slug (we will use id as slug for Supabase objects if they don't have slugs)
  // Let's assume the slug param here matches the product's ID for now, or you fall back
  const { data: item } = await supabase
    .from('products')
    .select('*')
    .eq('id', slug)
    .single()

  if (!item) {
    return {
      title: "Item Not Found",
    }
  }

  return {
    title: `${item.name} | Crumbs O' Bliss`,
    description: item.description,
    openGraph: {
      title: item.name,
      description: item.description,
      images: [
        {
          url: item.image_url || "",
          width: 400,
          height: 400,
          alt: item.name,
        },
      ],
    },
  }
}

async function ItemPage({ params }: ItemPageProps) {
  const { slug, locale } = await params
  const supabase = await createClient()

  // The slug is actually the Product ID when coming from the Supabase mapping logic
  const { data: item, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', slug)
    .single()

  if (error || !item) {
    notFound()
  }

  // Increment view_count asynchronously 
  // We can just increment it using a direct RPC if concurrency matters, or simple update:
  supabase.rpc('increment_product_view', { p_id: item.id }).then(({ error }) => {
    if (error) {
      // Fallback if RPC doesn't exist yet
      supabase.from('products').update({ view_count: (item.view_count || 0) + 1 }).eq('id', item.id).then();
    }
  });

  // Map to the shape expected by ItemPageClient
  const mappedItem = {
    ...item,
    id: item.id,
    slug: item.slug || item.id,
    name: { en: item.name, bn: item.name },
    description: { en: item.description, bn: item.description },
    image: item.image_url || "/assets/placeholder.jpg",
    price: item.price,
    currency: "INR" as const,
    weight: item.weight || 100, // Default or fetch from DB if added later
    tags: item.category ? [item.category] : [],
    ingredients: item.ingredients || [],
    calories: item.calories,
    prep_time: item.prep_time,
    is_veg: item.is_veg,
    stock: item.stock
  }

  return <ItemPageClient item={mappedItem} locale={locale} />
}

export default ItemPage
