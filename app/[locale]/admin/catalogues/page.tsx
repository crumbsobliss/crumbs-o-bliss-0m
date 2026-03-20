
import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Pencil, Eye, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import DeleteCatalogueButton from '@/components/admin/delete-catalogue-button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import CatalogueForm from '@/components/admin/catalogue-form'
import { Card, CardContent } from '@/components/ui/card'

export default async function CataloguesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createClient()
  const { data: catalogues } = await supabase.from('custom_catalogues').select('*').order('created_at', { ascending: false })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border/40">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground italic">Special Packs</h1>
            <p className="text-muted-foreground text-sm mt-1">Curated bundles and seasonal specialities.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-xl font-bold text-xs tracking-widest uppercase h-10 px-6 shadow-lg shadow-primary/20">
              <Plus className="mr-2 h-4 w-4" />
              New Pack
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="px-6 pt-6 pb-4 bg-muted/30 border-b border-border/40">
              <DialogTitle className="text-xl font-bold italic">New Pack</DialogTitle>
              <DialogDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Create a special bundle of items</DialogDescription>
            </DialogHeader>
            <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <CatalogueForm />
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
              <TableHead className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Price</TableHead>
              <TableHead className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground text-center">Status</TableHead>
              <TableHead className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Created</TableHead>
              <TableHead className="text-right text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground pr-6">Manage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {catalogues?.map((cat) => (
              <TableRow key={cat.id} className="group hover:bg-muted/50 transition-colors">
                <TableCell className="pl-6">
                  {cat.image_url ? (
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border bg-muted shadow-sm group-hover:scale-105 transition-transform">
                      <Image src={cat.image_url} alt={cat.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">?</div>
                  )}
                </TableCell>
                <TableCell>
                    <span className="text-sm font-bold group-hover:text-primary transition-colors">{cat.name}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-bold text-primary">
                    {cat.price ? `₹${cat.price}` : "Bundle"}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  {cat.is_active ?
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-600 uppercase tracking-widest">Active</span> :
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-muted text-muted-foreground uppercase tracking-widest">Hidden</span>
                  }
                </TableCell>
                <TableCell className="text-sm text-muted-foreground font-medium">{new Date(cat.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" asChild className="rounded-xl h-9 px-4 text-xs font-bold hover:bg-primary hover:text-primary-foreground border-primary/20 transition-all">
                      <Link href={`/${locale}/admin/catalogues/${cat.id}`}>
                        Edit Pack
                      </Link>
                    </Button>
                    <DeleteCatalogueButton id={cat.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card Layout */}
      <div className="grid gap-4 md:hidden pb-10">
        {catalogues?.map((cat) => (
            <Card key={cat.id} className="rounded-2xl border-none shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <div className="flex gap-4 p-4">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden border bg-muted shrink-0 shadow-sm">
                            {cat.image_url ? (
                                <Image src={cat.image_url} alt={cat.name} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground/30 text-xl">?</div>
                            )}
                        </div>
                        <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                                <h3 className="font-bold text-foreground truncate leading-tight">{cat.name}</h3>
                                {cat.is_active && <div className="w-2 h-2 rounded-full bg-green-500 shrink-0 mt-1" />}
                            </div>
                            <div className="flex justify-between items-center mt-auto">
                                <p className="font-bold text-primary">{cat.price ? `₹${cat.price}` : "Custom Bundle"}</p>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">{new Date(cat.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex border-t border-border/40 p-2 gap-2 bg-muted/20">
                        <Button variant="ghost" asChild className="flex-1 rounded-xl h-10 font-bold text-xs gap-2">
                            <Link href={`/${locale}/admin/catalogues/${cat.id}`}>
                                <Pencil className="h-3.5 w-3.5" />
                                Manage Items
                            </Link>
                        </Button>
                        <DeleteCatalogueButton id={cat.id} />
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>

      {(!catalogues || catalogues.length === 0) && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4 bg-muted/20 rounded-3xl border border-dashed">
            <div className="text-4xl text-muted-foreground/30">🎁</div>
            <div className="space-y-1">
                <p className="font-bold text-muted-foreground">No packs created yet.</p>
                <p className="text-xs text-muted-foreground/60 max-w-[200px]">Create your first bundle of treats here!</p>
            </div>
          </div>
      )}
    </div>
  )
}
