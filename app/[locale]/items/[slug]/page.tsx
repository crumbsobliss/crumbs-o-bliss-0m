import type { Metadata } from "next"
import { items } from "@/lib/items"
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
  const item = items.find((i) => i.slug === slug)

  if (!item) {
    return {
      title: "Item Not Found",
    }
  }

  const name = locale === "en" ? item.name.en : item.name.bn
  const description = locale === "en" ? item.description.en : item.description.bn

  return {
    title: `${name} | Crumbs O' Bliss`,
    description: description,
    openGraph: {
      title: name,
      description: description,
      
      images: [
        {
          url: item.image,
          width: 400,
          height: 400,
          alt: name,
        },
      ],
    },
  }
}

export async function generateStaticParams() {
  return items.flatMap((item) => [
    { slug: item.slug, locale: "en" },
    { slug: item.slug, locale: "bn" },
  ])
}

async function ItemPage({ params }: ItemPageProps) {
  const { slug, locale } = await params
  const item = items.find((i) => i.slug === slug)

  if (!item) {
    notFound()
  }

  return <ItemPageClient item={item} locale={locale} />
}

export default ItemPage
