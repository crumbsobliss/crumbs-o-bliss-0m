
'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Search, CheckCircle2, Clock, XCircle, Package, Download } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

type OrderData = {
  order: {
    id: string
    ticket_id: string
    user_name: string
    status: 'pending' | 'confirmed' | 'cancelled' | 'delivered'
    total_amount: number
    created_at: string
    delivery_address: string
    admin_notes?: string
  }
  items: {
    id: string
    product_name: string
    quantity: number
    price_at_time: number
  }[]
}

export default function OrderTrackingClient({ ticket }: { ticket: string }) {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const supabase = createClient()

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setOrderData(null)

    try {
      const { data, error } = await supabase.rpc('get_order_details', {
        p_ticket_id: ticket,
        p_phone: phone,
      })

      if (error) {
        throw error
      }

      if (!data || !data.order) {
        setError('Order not found or phone number incorrect.')
      } else {
        setOrderData(data as OrderData)
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to verify details')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'pending': return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
          case 'confirmed': return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
          case 'delivered': return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
          case 'cancelled': return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
          default: return 'bg-gray-500/10 text-gray-500';
      }
  }

  const getStatusIcon = (status: string) => {
      switch(status) {
          case 'pending': return <Clock className="h-4 w-4" />;
          case 'confirmed': return <CheckCircle2 className="h-4 w-4" />;
          case 'delivered': return <Package className="h-4 w-4" />;
          case 'cancelled': return <XCircle className="h-4 w-4" />;
          default: return <Clock className="h-4 w-4" />;
      }
  }

  if (orderData) {
      return (
          <div className="max-w-3xl mx-auto space-y-6">
              <Card>
                  <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Order #{orderData.order.ticket_id}</CardTitle>
                            <CardDescription>Placed on {new Date(orderData.order.created_at).toLocaleDateString()}</CardDescription>
                        </div>
                        <Badge variant="outline" className={`px-3 py-1 flex items-center gap-2 ${getStatusColor(orderData.order.status)}`}>
                            {getStatusIcon(orderData.order.status)}
                            <span className="capitalize">{orderData.order.status}</span>
                        </Badge>
                      </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                          <div>
                              <h3 className="font-semibold mb-2">Customer Details</h3>
                              <p className="text-sm text-muted-foreground">Name: {orderData.order.user_name}</p>
                              <p className="text-sm text-muted-foreground">Address: {orderData.order.delivery_address}</p>
                          </div>
                          {orderData.order.admin_notes && (
                              <div className="bg-muted p-4 rounded-lg">
                                  <h3 className="font-semibold mb-2">Note from Store</h3>
                                  <p className="text-sm">{orderData.order.admin_notes}</p>
                              </div>
                          )}
                      </div>

                      <div>
                          <h3 className="font-semibold mb-4">Order Items</h3>
                          <div className="border rounded-lg overflow-hidden">
                              <table className="w-full text-sm">
                                  <thead className="bg-muted">
                                      <tr>
                                          <th className="px-4 py-3 text-left">Item</th>
                                          <th className="px-4 py-3 text-right">Qty</th>
                                          <th className="px-4 py-3 text-right">Price</th>
                                          <th className="px-4 py-3 text-right">Total</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y">
                                      {orderData.items.map((item) => (
                                          <tr key={item.id}>
                                              <td className="px-4 py-3">{item.product_name}</td>
                                              <td className="px-4 py-3 text-right">{item.quantity}</td>
                                              <td className="px-4 py-3 text-right">${item.price_at_time}</td>
                                              <td className="px-4 py-3 text-right font-medium">
                                                  ${(item.quantity * item.price_at_time).toFixed(2)}
                                              </td>
                                          </tr>
                                      ))}
                                      <tr className="bg-muted/50 font-bold">
                                          <td colSpan={3} className="px-4 py-3 text-right">Total</td>
                                          <td className="px-4 py-3 text-right">${orderData.order.total_amount}</td>
                                      </tr>
                                  </tbody>
                              </table>
                          </div>
                      </div>
                      
                       <div className="flex justify-end mt-6">
                           <Button variant="outline" className="shadow-sm" onClick={() => window.open(`/api/generate-bill?ticket_id=${orderData.order.ticket_id}`, '_blank')}>
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF Bill
                           </Button>
                       </div>
                  </CardContent>
              </Card>
          </div>
      )
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <Card>
        <CardHeader>
          <CardTitle>Track Your Order</CardTitle>
          <CardDescription>
            Enter your phone number to view details for Ticket <strong>{ticket}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter the phone number used for this order"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            {error && (
                <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                    {error}
                </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify & Track
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
