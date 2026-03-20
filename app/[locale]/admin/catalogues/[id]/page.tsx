
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import CatalogueForm from '@/components/admin/catalogue-form'
import CatalogueManager from '@/components/admin/catalogue-manager'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

type Props = {
  params: Promise<{ id: string; locale: string }>
}

export default async function CatalogueDetailsPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch Catalogue
  const { data: catalogue } = await supabase
    .from('custom_catalogues')
    .select('*')
    .eq('id', id)
    .single()

  if (!catalogue) {
    notFound()
  }

  // Fetch Items in Catalogue
  const { data: itemsRef } = await supabase
    .from('catalogue_items')
    .select('product_id')
    .eq('catalogue_id', id)

  const productIds = itemsRef?.map(i => i.product_id) || []

  let existingItems: any[] = []
  if (productIds.length > 0) {
    const { data: products } = await supabase
      .from('products')
      .select('id, name, image_url')
      .in('id', productIds)
    existingItems = products || []
  }

  // Fetch All Products (for adding)
  const { data: allProducts } = await supabase
    .from('products')
    .select('id, name, image_url')
    .eq('is_active', true)

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground italic">Pack Details</h1>
          <p className="text-sm font-mono text-muted-foreground mt-1 tracking-tighter uppercase font-bold text-[10px]">ID: {catalogue.id}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="rounded-3xl shadow-sm border-none overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/40 px-6 py-4">
              <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Included Items</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <CatalogueManager
                catalogueId={id}
                existingItems={existingItems}
                allProducts={allProducts || []}
              />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="rounded-3xl shadow-sm border-none overflow-hidden bg-muted/20">
            <CardHeader className="bg-muted/30 border-b border-border/40 px-6 py-4">
              <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Pack Info</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <CatalogueForm catalogue={catalogue} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
