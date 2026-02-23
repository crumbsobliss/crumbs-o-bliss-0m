import { createClient } from '@/utils/supabase/server'
import CreateOrderForm from '@/components/admin/create-order-form'

export default async function NewOrderPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('id, name, price')
    .eq('is_active', true)
    // .order('name') // assuming we don't need sorting, or it's implicitly fast

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground">Create Manual Order</h1>
        <p className="text-muted-foreground mt-2 font-mono">
          Use this form to add offline or phone orders directly into the database.
        </p>
      </div>

      <CreateOrderForm products={products || []} />
    </div>
  )
}
