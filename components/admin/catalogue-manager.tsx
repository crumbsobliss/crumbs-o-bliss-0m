
'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Check, ChevronsUpDown, Plus, Trash2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type Product = {
    id: string
    name: string
    image_url: string
}

type CatalogueManagerProps = {
    catalogueId: string
    existingItems: Product[]
    allProducts: Product[]
}

export default function CatalogueManager({ catalogueId, existingItems, allProducts }: CatalogueManagerProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    // Filter out products already in catalogue
    const availableProducts = allProducts.filter(p => !existingItems.some(item => item.id === p.id))

    async function addProduct(productId: string) {
        setLoading(true)
        const { error } = await supabase
            .from('catalogue_items')
            .insert({ catalogue_id: catalogueId, product_id: productId })

        if (error) {
            console.error(error)
            alert('Could not add this item.')
        } else {
            router.refresh()
            setOpen(false)
        }
        setLoading(false)
    }

    async function removeProduct(productId: string) {
        if (!confirm('Remove this item from the pack?')) return
        setLoading(true)
        const { error } = await supabase
            .from('catalogue_items')
            .delete()
            .eq('catalogue_id', catalogueId)
            .eq('product_id', productId)

        if (error) {
            console.error(error)
            alert('Could not remove this item.')
        } else {
            router.refresh()
        }
        setLoading(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border/40">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Current Items ({existingItems.length})</h3>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[180px] justify-between rounded-xl h-9 text-[10px] font-bold uppercase tracking-widest border-primary/20 hover:bg-primary/5 transition-all">
                            <Plus className="mr-2 h-3.5 w-3.5" />
                            Add Item
                            <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[220px] p-0 rounded-2xl overflow-hidden shadow-xl border-none">
                        <Command className="bg-popover">
                            <CommandInput placeholder="Find an item..." className="text-sm h-12" />
                            <CommandList className="max-h-[300px]">
                                <CommandEmpty className="text-xs py-10 text-center text-muted-foreground">None found.</CommandEmpty>
                                <CommandGroup heading="Available Items" className="p-2">
                                    {availableProducts.map((product) => (
                                        <CommandItem
                                            key={product.id}
                                            value={product.name}
                                            onSelect={() => addProduct(product.id)}
                                            className="text-sm rounded-xl p-3 cursor-pointer hover:bg-muted font-medium transition-colors mb-1"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-muted border">
                                                    {product.image_url && <Image src={product.image_url} alt={product.name} fill className="object-cover" />}
                                                </div>
                                                {product.name}
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {existingItems.map(product => (
                    <div key={product.id} className="flex items-center gap-3 border border-border/40 p-3 rounded-2xl bg-muted/5 group hover:bg-muted/20 transition-all">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-muted border border-border/40 shadow-sm shrink-0">
                            {product.image_url && (
                                <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{product.name}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-destructive hover:text-white hover:bg-red-500 transition-all" onClick={() => removeProduct(product.id)} disabled={loading}>
                            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                    </div>
                ))}
            </div>
            {existingItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-3 bg-muted/10 rounded-3xl border border-dashed">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">No items added yet.</p>
                </div>
            )}
        </div>
    )
}
