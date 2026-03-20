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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { IKContext, IKUpload } from 'imagekitio-react'
import { Loader2, X, Plus } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be positive'),
  discounted_price: z.coerce.number().min(0, 'Discounted Price must be positive').optional(),
  stock: z.coerce.number().int().min(0, 'Stock must be positive'),
  category: z.string().min(1, 'Category is required'),
  calories: z.string().optional(),
  is_veg: z.boolean().default(false),
  color: z.string().optional(),
})

type ProductFormProps = {
  product?: any // Replace with proper type
  onSuccess?: () => void
}

export default function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState<{ url: string; filePath: string } | null>(
    product ? { url: product.image_url, filePath: product.image_file_path } : null
  )
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      discounted_price: product?.discounted_price || 0,
      stock: product?.stock || 0,
      category: product?.category || '',
      calories: product?.calories || '',
      is_veg: product?.is_veg || false,
      color: product?.color || '',
    },
  })

  const onError = (err: any) => {
    console.error('Upload Error', err)
    setUploading(false)
    alert('Image upload failed')
  }

  const onSuccessUpload = (res: any) => {
    console.log('Success', res)
    setUploading(false)
    setImage({ url: res.url, filePath: res.filePath })
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!image) {
      alert('Please upload an image')
      return
    }

    setLoading(true)
    const productData = {
      ...values,
      image_url: image.url,
      image_file_path: image.filePath,
    }

    let error
    let data

    console.log('Submitting product data:', productData)

    if (product?.id) {
      console.log('Updating product ID:', product.id)
      const { data: updateData, error: updateError } = await supabase
        .from('products')
        .update(productData)
        .eq('id', product.id)
        .select()
      error = updateError
      data = updateData
    } else {
      console.log('Inserting new product')
      const { data: insertData, error: insertError } = await supabase
        .from('products')
        .insert([productData])
        .select()
      error = insertError
      data = insertData
    }

    console.log('Supabase Operation Result:', { data, error })

    setLoading(false)

    if (error) {
      console.error('Supabase Error:', error)
      alert(`Failed to save product: ${error.message}`)
    } else if (!data || data.length === 0) {
      console.error('Operation succeeded but no rows affected.')
      alert('Failed to save product: No rows affected. Check RLS policies.')
    } else {
      console.log('Product saved successfully', data)
      form.reset()
      if (!product) setImage(null)
      router.refresh()
      if (onSuccess) onSuccess()
    }
  }

  const authenticator = async () => {
    try {
      // Use absolute path to avoid locale prefix issues if api is at root app/api
      const response = await fetch(`/api/imagekit/auth`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }
      const data = await response.json();
      const { signature, expire, token } = data;
      return { signature, expire, token };
    } catch (error: any) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <IKContext
        publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
        urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
        authenticator={authenticator}
      >
        <div className="space-y-3">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Photo</Label>
          {image ? (
            <div className="relative w-full aspect-video sm:w-48 sm:h-48 rounded-3xl overflow-hidden group border-2 border-primary/20 bg-muted shadow-lg">
              <Image src={image.url} alt="Product" fill className="object-cover transition-transform group-hover:scale-110 duration-500" />
              <button
                type="button"
                onClick={() => setImage(null)}
                className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-destructive p-2 rounded-2xl shadow-xl hover:bg-destructive hover:text-white transition-all transform hover:scale-110 active:scale-90"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-primary/20 rounded-3xl p-8 text-center bg-primary/5 hover:bg-primary/10 transition-colors group cursor-pointer relative">
              {uploading ? (
                <div className="flex flex-col items-center justify-center gap-3 text-primary animate-pulse">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="text-xs font-bold uppercase tracking-widest">Adding photo...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Plus className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-foreground">Upload a Photo</p>
                        <p className="text-xs text-muted-foreground">Clear images look best</p>
                    </div>
                  <IKUpload
                    fileName="product_"
                    onError={onError}
                    onSuccess={onSuccessUpload}
                    onUploadStart={() => setUploading(true)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </IKContext>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Item Name</FormLabel>
                <FormControl>
                  <Input placeholder="Chocolate Cheesecake" className="h-12 rounded-xl bg-muted/20 border-border/40 focus:bg-background transition-all" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Price (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" className="h-12 rounded-xl bg-muted/20 border-border/40" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discounted_price"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Discount Price</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" className="h-12 rounded-xl bg-muted/20 border-border/40" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">In Stock</FormLabel>
                  <FormControl>
                    <Input type="number" className="h-12 rounded-xl bg-muted/20 border-border/40" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="calories"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Calories</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g. 250" className="h-12 rounded-xl bg-muted/20 border-border/40" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 rounded-xl bg-muted/20 border-border/40">
                        <SelectValue placeholder="Pick a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-2xl border-none shadow-xl">
                      <SelectItem value="cakes" className="rounded-xl">Cakes</SelectItem>
                      <SelectItem value="pizzas" className="rounded-xl">Pizzas</SelectItem>
                      <SelectItem value="beverages" className="rounded-xl">Beverages</SelectItem>
                      <SelectItem value="custom" className="rounded-xl">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_veg"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-2xl border border-border/40 p-4 transition-colors hover:bg-muted/5 sm:mt-6">
                  <div className="space-y-0.5">
                    <FormLabel className="text-xs font-bold uppercase tracking-widest leading-none">Veg Only</FormLabel>
                  </div>
                  <FormControl>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-6 w-6 rounded-lg border-primary/20 text-primary focus:ring-primary transition-all cursor-pointer"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Accent Color</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-xl border border-border/40 overflow-hidden bg-muted/20 shrink-0">
                        <Input
                        type="color"
                        {...field}
                        value={field.value || "#ffffff"}
                        className="absolute inset-0 h-full w-full p-0 border-none cursor-pointer scale-150"
                        />
                    </div>
                    <Input
                      type="text"
                      placeholder="#HexCode (Optional)"
                      className="h-12 rounded-xl bg-muted/20 border-border/40 flex-1"
                      {...field}
                      value={field.value || ""}
                    />
                  </div>
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
                  <Textarea placeholder="What's special about this item?" className="rounded-2xl min-h-[120px] bg-muted/20 border-border/40 focus:bg-background transition-all" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading || uploading} className="w-full rounded-2xl h-14 text-sm font-bold uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]">
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
            {loading ? "Saving..." : "Save Item"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
