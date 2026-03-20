
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  price: z.preprocess((val) => val === '' ? undefined : Number(val), z.number().optional()),
  image_url: z.string().optional(), // Could add image upload here too if needed
  is_active: z.boolean().default(true),
})

type CatalogueFormProps = {
  catalogue?: any
  onSuccess?: () => void
}

export default function CatalogueForm({ catalogue, onSuccess }: CatalogueFormProps) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: catalogue?.name || '',
      description: catalogue?.description || '',
      price: catalogue?.price || '',
      image_url: catalogue?.image_url || '',
      is_active: catalogue?.is_active ?? true,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    let error

    if (catalogue?.id) {
      const { error: updateError } = await supabase
        .from('custom_catalogues')
        .update(values)
        .eq('id', catalogue.id)
      error = updateError
    } else {
      const { error: insertError } = await supabase
        .from('custom_catalogues')
        .insert([values])
      error = insertError
    }

    setLoading(false)

    if (error) {
      console.error(error)
      alert('Failed to save catalogue')
    } else {
      router.refresh()
      if (onSuccess) onSuccess()
      // If inside a dialog, we might want to close it. 
      // onSuccess callback handles that if provided.
      // But we can also refresh.
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Pack Name</FormLabel>
              <FormControl>
                <Input placeholder="E.g. Weekend Special" className="h-12 rounded-xl bg-muted/20 border-border/40 focus:bg-background transition-all" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Price (Optional)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0.00" className="h-12 rounded-xl bg-muted/20 border-border/40" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Details</FormLabel>
              <FormControl>
                <Textarea placeholder="What's in this pack?" className="rounded-2xl min-h-[100px] bg-muted/20 border-border/40 focus:bg-background transition-all" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Photo URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://..." className="h-12 rounded-xl bg-muted/20 border-border/40" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-2xl border border-border/40 p-4 transition-colors hover:bg-muted/5">
              <div className="space-y-0.5">
                <FormLabel className="text-xs font-bold uppercase tracking-widest">Show on Website</FormLabel>
              </div>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="h-6 w-6 rounded-lg border-primary/20"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading} className="w-full rounded-2xl h-14 text-sm font-bold uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] mt-4">
          {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {loading ? "Saving..." : "Save Pack"}
        </Button>
      </form>
    </Form>
  )
}
