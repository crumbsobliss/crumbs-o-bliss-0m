
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, X, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { IKContext, IKUpload } from 'imagekitio-react'
import Image from 'next/image'
import { Label } from '@/components/ui/label'

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  category: z.enum(['landing', 'menu', 'other']),
  image_url: z.string().url('Image is required'),
  link_url: z.string().optional(),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
  display_order: z.preprocess((val) => Number(val), z.number().default(0)),
})

type SpecialImageFormProps = {
  specialImage?: any
  onSuccess?: () => void
}

export default function SpecialImageForm({ specialImage, onSuccess }: SpecialImageFormProps) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: specialImage?.name || '',
      category: specialImage?.category || 'landing',
      image_url: specialImage?.image_url || '',
      link_url: specialImage?.link_url || '',
      description: specialImage?.description || '',
      is_active: specialImage?.is_active ?? true,
      display_order: specialImage?.display_order || 0,
    },
  })

  const authenticator = async () => {
    try {
      const response = await fetch(`/api/imagekit/auth`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }
      const data = await response.json();
      return { signature: data.signature, expire: data.expire, token: data.token };
    } catch (error: any) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  const onError = (err: any) => {
    console.error('Upload Error', err)
    setUploading(false)
    alert('Image upload failed')
  }

  const onSuccessUpload = (res: any) => {
    setUploading(false)
    form.setValue('image_url', res.url)
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    let error

    if (specialImage?.id) {
      const { error: updateError } = await supabase
        .from('special_images')
        .update(values)
        .eq('id', specialImage.id)
      error = updateError
    } else {
      const { error: insertError } = await supabase
        .from('special_images')
        .insert([values])
      error = insertError
    }

    setLoading(false)

    if (error) {
      console.error(error)
      alert('Failed to save image')
    } else {
      router.refresh()
      if (onSuccess) onSuccess()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in duration-500">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Banner Title</FormLabel>
              <FormControl>
                <Input placeholder="E.g. Summer Special" className="h-12 rounded-xl bg-muted/20 border-border/40 focus:bg-background transition-all" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Where to Show</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 rounded-xl bg-muted/20 border-border/40">
                    <SelectValue placeholder="Pick a location" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-2xl border-none shadow-xl">
                  <SelectItem value="landing" className="rounded-xl">Home Screen</SelectItem>
                  <SelectItem value="menu" className="rounded-xl">Food Menu</SelectItem>
                  <SelectItem value="other" className="rounded-xl">Elsewhere</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <IKContext
          publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
          urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
          authenticator={authenticator}
        >
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Banner Photo</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    {field.value ? (
                      <div className="relative w-full aspect-video rounded-3xl overflow-hidden group border-2 border-primary/20 bg-muted shadow-lg">
                        <Image src={field.value} alt="Special Image" fill className="object-cover transition-transform group-hover:scale-105 duration-700" />
                        <button
                          type="button"
                          onClick={() => field.onChange('')}
                          className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-destructive p-2.5 rounded-2xl shadow-xl hover:bg-destructive hover:text-white transition-all transform hover:scale-110 active:scale-90"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-primary/20 rounded-3xl p-12 text-center bg-primary/5 hover:bg-primary/10 transition-colors group cursor-pointer relative">
                        {uploading ? (
                          <div className="flex flex-col items-center justify-center gap-3 text-primary animate-pulse">
                            <Loader2 className="h-8 w-8 animate-spin" />
                            <p className="text-xs font-bold uppercase tracking-widest">Uploading Photo...</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3">
                              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                  <Plus className="h-6 w-6" />
                              </div>
                              <div className="space-y-1">
                                  <p className="text-sm font-bold text-foreground">Click to Upload</p>
                                  <p className="text-xs text-muted-foreground">High quality photos work best</p>
                              </div>
                            <IKUpload
                              fileName="special_"
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </IKContext>

        <FormField
          control={form.control}
          name="link_url"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Action Link (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="E.g. /menu or external link" className="h-12 rounded-xl bg-muted/20 border-border/40 focus:bg-background transition-all" {...field} />
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
              <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Caption (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="A short description for users..." className="rounded-2xl min-h-[100px] bg-muted/20 border-border/40 focus:bg-background transition-all" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
          <FormField
            control={form.control}
            name="display_order"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Order</FormLabel>
                <FormControl>
                  <Input type="number" className="h-12 rounded-xl bg-muted/20 border-border/40" {...field} />
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
                  <FormLabel className="text-xs font-bold uppercase tracking-widest">Show Banner</FormLabel>
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
        </div>

        <Button type="submit" disabled={loading || uploading} className="w-full rounded-2xl h-14 text-sm font-bold uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] mt-4">
          {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
          {loading ? "Saving..." : "Save Banner"}
        </Button>
      </form>
    </Form>
  )
}
