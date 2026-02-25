'use client'

import React, { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Trash2, Save, Store, Truck, ShoppingBag, Loader2 } from 'lucide-react'

// Basic UUID generator for order offline usage
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function CreateOrderForm({ products }: { products: any[] }) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: ''
  })

  const [items, setItems] = useState<any[]>([])

  // Custom item state
  const [customItem, setCustomItem] = useState({ name: '', price: '', quantity: 1 })
  const [dbItem, setDbItem] = useState({ productId: '', quantity: 1 })

  const totalAmount = items.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0)

  const addCustomItem = () => {
    if (!customItem.name || !customItem.price) return
    setItems([...items, { ...customItem, isCustom: true, id: Date.now().toString() }])
    setCustomItem({ name: '', price: '', quantity: 1 })
  }

  const addDbItem = () => {
    if (!dbItem.productId) return
    const p = products.find(prod => prod.id === dbItem.productId)
    if (!p) return
    setItems([...items, {
      id: p.id,
      name: p.name,
      price: p.price,
      quantity: dbItem.quantity,
      isCustom: false
    }])
    setDbItem({ productId: '', quantity: 1 })
  }

  const removeItem = (index: number) => {
    const newItems = [...items]
    newItems.splice(index, 1)
    setItems(newItems)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return alert('Add at least one item')

    setLoading(true)
    const orderId = generateUUID()
    const ticketId = Math.random().toString(36).substring(2, 10).toUpperCase()

    // Create Order
    const { error: orderError } = await supabase.from('orders').insert({
      id: orderId,
      ticket_id: ticketId,
      user_name: customer.name,
      user_phone: customer.phone,
      total_amount: totalAmount,
      status: 'confirmed', // offline orders default to confirmed
      delivery_address: customer.address || 'In-Store Pickup',
      user_email: `${customer.phone}@offline.local` // Mock email for offline
    })

    if (orderError) {
      alert('Failed to save order')
      console.error(orderError)
      setLoading(false)
      return
    }

    // Insert Items
    const orderItems = items.map(item => ({
      order_id: orderId,
      product_id: item.isCustom ? null : item.id,
      product_name: item.name,
      quantity: item.quantity,
      price_at_time: item.price
    }))

    await supabase.from('order_items').insert(orderItems)

    // Decrement stock
    for (const item of items) {
      if (!item.isCustom && item.id) {
        await supabase.rpc('decrement_stock', {
          product_id: item.id,
          quantity_to_subtract: item.quantity
        });
      }
    }

    router.push('/admin/orders')
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* Items Column */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold mb-4 font-serif text-lg flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" /> Basket
            </h3>

            {/* Add DB Product */}
            <div className="bg-muted/50 p-4 rounded-xl border border-border mb-6 flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-grow w-full">
                <Label className="text-xs mb-1 block">Select Product</Label>
                <select
                  value={dbItem.productId}
                  onChange={e => setDbItem({ ...dbItem, productId: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="">-- Choose Product --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:w-24">
                <Label className="text-xs mb-1 block">Qty</Label>
                <Input type="number" min="1" value={dbItem.quantity} onChange={e => setDbItem({ ...dbItem, quantity: parseInt(e.target.value) })} />
              </div>
              <Button type="button" onClick={addDbItem} variant="secondary" className="w-full sm:w-auto shrink-0"><Plus className="w-4 h-4 mr-2" /> Add</Button>
            </div>

            {/* Add Custom Product */}
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 mb-6 flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-grow w-full">
                <Label className="text-xs mb-1 block">Custom Item Name</Label>
                <Input placeholder="E.g. Special Extra Topping" value={customItem.name} onChange={e => setCustomItem({ ...customItem, name: e.target.value })} />
              </div>
              <div className="w-full sm:w-24">
                <Label className="text-xs mb-1 block">Price (₹)</Label>
                <Input type="number" min="0" placeholder="0" value={customItem.price} onChange={e => setCustomItem({ ...customItem, price: e.target.value })} />
              </div>
              <div className="w-full sm:w-20">
                <Label className="text-xs mb-1 block">Qty</Label>
                <Input type="number" min="1" value={customItem.quantity} onChange={e => setCustomItem({ ...customItem, quantity: parseInt(e.target.value) })} />
              </div>
              <Button type="button" onClick={addCustomItem} variant="default" className="w-full sm:w-auto shrink-0"><Plus className="w-4 h-4 mr-2" /> Add Custom</Button>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground bg-muted/20 border border-dashed rounded-lg">No items added to this order yet.</div>
              ) : (
                items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg bg-card shadow-sm group">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{item.isCustom ? 'Manual Entry' : 'Catalog Item'}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="text-sm font-bold block">{item.quantity} x ₹{item.price}</span>
                        <span className="text-xs text-primary font-black">₹{item.quantity * item.price}</span>
                      </div>
                      <button type="button" onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-md transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Details & Summary Column */}
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold mb-2 font-serif text-lg flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" /> Customer Info
            </h3>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input required placeholder="E.g. John Doe" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input required placeholder="10 Digits" value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="flex justify-between items-center">
                <span>Address</span>
                <span className="text-[10px] text-muted-foreground font-normal">(Leave empty for pickup)</span>
              </Label>
              <Textarea rows={2} placeholder="Optional delivery address" value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          <CardContent className="p-6 relative z-10 space-y-4">
            <div className="flex justify-between items-center border-b border-primary/20 pb-4">
              <span className="text-muted-foreground font-medium">Subtotal</span>
              <span className="font-bold text-lg">₹{totalAmount}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-xl font-bold">Total</span>
              <span className="text-3xl font-black text-primary drop-shadow-sm">₹{totalAmount}</span>
            </div>

            <Button type="submit" disabled={loading || items.length === 0} className="w-full py-6 text-lg tracking-widest uppercase font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
              Generate Order
            </Button>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
