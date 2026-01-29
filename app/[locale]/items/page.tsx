import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { items } from '@/lib/items'
import details from '@/config/details.json'
import { ItemsGrid } from '@/components/items-grid'

export const metadata: Metadata = {
  title: `Our Menu | ${details.store.name}`,
  description: `Browse our delicious collection of ${details.items.categories.join(' & ')}. Fresh, artisanal baked goods made with care.`,
}

async function ItemsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations()

  // Default to English if locale is missing or invalid
  const currentLocale = locale === 'bn' ? 'bn' : 'en'

  return (
    <div className="min-h-screen py-12 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            {t('items.title')}
          </h1>
          <p className="text-lg text-muted-foreground text-balance max-w-2xl">
            {t('items.description')}
          </p>
        </div>

        {/* We pass the raw items to the Client Component.
          The Client Component handles the search, sort, and filtering logic.
        */}
        <ItemsGrid items={items} locale={currentLocale} />
      </div>
    </div>
  )
}

export default ItemsPage
