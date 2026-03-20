
import { createClient } from '@/utils/supabase/server'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Plus, Image as ImageIcon, ExternalLink, Edit } from 'lucide-react'
import Image from 'next/image'
import SpecialImageForm from '@/components/admin/special-image-form'
import { Card, CardContent } from '@/components/ui/card'

export default async function SpecialImagesPage() {
  const supabase = await createClient()

  const { data: images } = await supabase
    .from('special_images')
    .select('*')
    .order('category', { ascending: true })
    .order('display_order', { ascending: true })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border/40">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground italic">Page Banners</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Display your best photos on the landing page and website galleries.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-xl font-bold text-xs tracking-widest uppercase h-10 px-6 shadow-lg shadow-primary/20">
              <Plus className="mr-2 h-4 w-4" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] sm:rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="px-6 pt-6 pb-4 bg-muted/30 border-b border-border/40">
              <DialogTitle className="text-xl font-bold italic">New Banner Image</DialogTitle>
              <DialogDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                This image will appear in your chosen section.
              </DialogDescription>
            </DialogHeader>
            <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <SpecialImageForm />
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
              <TableHead className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground text-center">Category</TableHead>
              <TableHead className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground text-center">Priority</TableHead>
              <TableHead className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground text-center">Visibility</TableHead>
              <TableHead className="text-right text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground pr-6">Manage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {images?.map((image) => (
              <TableRow key={image.id} className="group hover:bg-muted/50 transition-colors">
                <TableCell className="pl-6">
                  <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-muted border group-hover:scale-105 transition-transform shadow-sm">
                    <Image
                      src={image.image_url}
                      alt={image.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex flex-col max-w-[200px]">
                    <span className="font-bold text-sm block group-hover:text-primary transition-colors">{image.name}</span>
                    {image.link_url && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono truncate">
                        <ExternalLink className="h-2 w-2" /> {image.link_url}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {image.category === 'landing' ? 'Landing Page' : image.category === 'menu' ? 'Menu Gallery' : 'Other'}
                    </span>
                </TableCell>
                <TableCell className="text-center font-bold text-muted-foreground">{image.display_order}</TableCell>
                <TableCell className="text-center">
                  {image.is_active ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-600 uppercase tracking-widest">Visible</span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-muted text-muted-foreground uppercase tracking-widest">Hidden</span>
                  )}
                </TableCell>
                <TableCell className="text-right pr-6">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary hover:text-primary-foreground border-primary/20 transition-all">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] sm:rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                      <DialogHeader className="px-6 pt-6 pb-4 bg-muted/30 border-b border-border/40">
                        <DialogTitle className="text-xl font-bold italic">Edit Banner Image</DialogTitle>
                        <DialogDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Update your banner settings</DialogDescription>
                      </DialogHeader>
                      <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                        <SpecialImageForm specialImage={image} />
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card Layout */}
      <div className="grid gap-4 md:hidden pb-10">
        {images?.map((image) => (
            <Card key={image.id} className="rounded-2xl border-none shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <div className="flex gap-4 p-4">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden border bg-muted shrink-0 shadow-sm">
                            <Image src={image.image_url} alt={image.name} fill className="object-cover" />
                        </div>
                        <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                                <h3 className="font-bold text-foreground truncate leading-tight">{image.name}</h3>
                                {image.is_active && <div className="w-2 h-2 rounded-full bg-green-500 shrink-0 mt-1" />}
                            </div>
                            <div className="flex flex-col gap-1 mt-auto">
                                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{image.category} Section</p>
                                <p className="text-[10px] font-bold text-muted-foreground">Priority {image.display_order}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex border-t border-border/40 p-2 bg-muted/20">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" className="flex-1 rounded-xl h-10 font-bold text-xs gap-2">
                                    <Edit className="h-3.5 w-3.5" />
                                    Edit Settings
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] w-[95vw] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                                <DialogHeader className="px-6 pt-6 pb-4 bg-muted/30 border-b border-border/40">
                                    <DialogTitle className="text-xl font-bold italic">Edit Banner</DialogTitle>
                                    <DialogDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Update your banner settings</DialogDescription>
                                </DialogHeader>
                                <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                                    <SpecialImageForm specialImage={image} />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>

      {(!images || images.length === 0) && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4 bg-muted/20 rounded-3xl border border-dashed">
            <div className="text-4xl text-muted-foreground/30">🖼️</div>
            <div className="space-y-1">
                <p className="font-bold text-muted-foreground">No banners active.</p>
                <p className="text-xs text-muted-foreground/60 max-w-[200px]">Add images to showcase them on your website!</p>
            </div>
          </div>
      )}
    </div>
  )
}
