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
import { Loader2, X } from 'lucide-react'
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
    <div className="space-y-6">
      <IKContext
        publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
        urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
        authenticator={authenticator}
      >
        <div className="space-y-2">
          <Label>Product Image</Label>
          {image ? (
            <div className="relative w-40 h-40 border rounded-lg overflow-hidden group">
              <Image src={image.url} alt="Product" fill className="object-cover" />
              <button
                type="button"
                onClick={() => setImage(null)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="border border-dashed rounded-lg p-4 text-center">
              {uploading ? (
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </div>
              ) : (
                <IKUpload
                  fileName="product_"
                  onError={onError}
                  onSuccess={onSuccessUpload}
                  onUploadStart={() => setUploading(true)}
                  className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
              )}
            </div>
          )}
        </div>
      </IKContext>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Chocolate Cake" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discounted_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discounted Price</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="calories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calories (kcal)</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g. 250" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cakes">Cakes</SelectItem>
                      <SelectItem value="pizzas">Pizzas</SelectItem>
                      <SelectItem value="beverages">Beverages</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
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
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 md:mt-6">
                  <div className="space-y-0.5">
                    <FormLabel>Vegetarian</FormLabel>
                    <div className="text-sm text-muted-foreground">Is this product vegetarian?</div>
                  </div>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Product description..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading || uploading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Product
          </Button>
        </form>
      </Form>
    </div>
  )
}
