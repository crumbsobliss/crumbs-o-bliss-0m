
import { createClient } from '@/utils/supabase/server'
import ProductForm from '@/components/admin/product-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Pencil, Trash2, Eye } from 'lucide-react'
import Image from 'next/image'
import DeleteProductButton from '@/components/admin/delete-product-button'
import { Card, CardContent } from '@/components/ui/card'

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border/40">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground italic">Menu Items</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage the treats and items shown in your shop.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-xl font-bold text-xs tracking-widest uppercase h-10 px-6 shadow-lg shadow-primary/20">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl sm:rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="px-6 pt-6 pb-4 bg-muted/30 border-b border-border/40">
              <DialogTitle className="text-xl font-bold italic">New Item</DialogTitle>
              <DialogDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Add a delicious new entry to your store.</DialogDescription>
            </DialogHeader>
            <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <ProductForm />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-2xl bg-card shadow-sm overflow-hidden hidden md:block">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="w-[100px] text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground pl-6">Preview</TableHead>
              <TableHead className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Name</TableHead>
              <TableHead className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Category</TableHead>
              <TableHead className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground text-center">Price</TableHead>
              <TableHead className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground text-center">Stock</TableHead>
              <TableHead className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground text-center">Views</TableHead>
              <TableHead className="text-right text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground pr-6">Manage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <TableRow key={product.id} className="group hover:bg-muted/50 transition-colors">
                <TableCell className="pl-6">
                  {product.image_url ? (
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border bg-muted shadow-sm group-hover:scale-105 transition-transform">
                      <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">?</div>
                  )}
                </TableCell>
                <TableCell>
                    <span className="text-sm font-bold group-hover:text-primary transition-colors">{product.name}</span>
                </TableCell>
                <TableCell>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary">{product.category}</span>
                </TableCell>
                <TableCell className="text-center">
                    <span className="text-sm font-bold">₹{product.price}</span>
                </TableCell>
                <TableCell className="text-center">
                    <span className={`text-sm font-bold ${product.stock < 10 ? 'text-red-500' : 'text-foreground'}`}>{product.stock}</span>
                </TableCell>
                <TableCell className="text-center">
                    <span className="text-sm font-mono text-muted-foreground">{product.view_count || 0}</span>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex items-center justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary hover:text-primary-foreground border-primary/20 transition-all">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-xl sm:rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                        <DialogHeader className="px-6 pt-6 pb-4 bg-muted/30 border-b border-border/40">
                          <DialogTitle className="text-xl font-bold italic">Edit Item</DialogTitle>
                          <DialogDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Update your product details</DialogDescription>
                        </DialogHeader>
                        <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                          <ProductForm product={product} />
                        </div>
                      </DialogContent>
                    </Dialog>
                    <DeleteProductButton id={product.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card Experience */}
      <div className="grid gap-4 md:hidden pb-10">
        {products?.map((product) => (
            <Card key={product.id} className="rounded-2xl border-none shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <div className="flex gap-4 p-4">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden border bg-muted shrink-0 shadow-sm">
                            {product.image_url ? (
                                <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground/30 text-xl">?</div>
                            )}
                        </div>
                        <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
                            <div>
                                <h3 className="font-bold text-foreground truncate leading-tight">{product.name}</h3>
                                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">{product.category}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="font-bold text-primary">₹{product.price}</p>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">{product.stock} in stock</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex border-t border-border/40 p-2 gap-2 bg-muted/20">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" className="flex-1 rounded-xl h-10 font-bold text-xs gap-2">
                                    <Pencil className="h-3.5 w-3.5" />
                                    Edit
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-xl w-[95vw] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                                <DialogHeader className="px-6 pt-6 pb-4 bg-muted/30 border-b border-border/40">
                                    <DialogTitle className="text-xl font-bold italic">Edit Item</DialogTitle>
                                    <DialogDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Update your product details</DialogDescription>
                                </DialogHeader>
                                <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                                    <ProductForm product={product} />
                                </div>
                            </DialogContent>
                        </Dialog>
                        <DeleteProductButton id={product.id} />
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>

      {(!products || products.length === 0) && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4 bg-muted/20 rounded-3xl border border-dashed">
            <div className="text-4xl text-muted-foreground/30">🍽️</div>
            <div className="space-y-1">
                <p className="font-bold text-muted-foreground">Your kitchen is empty.</p>
                <p className="text-xs text-muted-foreground/60 max-w-[200px]">Add some delicious items to start selling!</p>
            </div>
          </div>
      )}
    </div>
  )
}
