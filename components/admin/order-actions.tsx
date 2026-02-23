
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Send, Save, Download } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type OrderActionsProps = {
  order: any
}

export default function OrderActions({ order }: OrderActionsProps) {
  const [status, setStatus] = useState(order.status)
  const [notes, setNotes] = useState(order.admin_notes || '')
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function getRole() {
       const { data: { user } } = await supabase.auth.getUser()
       if (user) {
         const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
         setRole(data?.role)
       }
    }
    getRole()
  }, [])

  async function handleUpdate() {
    setLoading(true)
    const { error } = await supabase
      .from('orders')
      .update({ status, admin_notes: notes })
      .eq('id', order.id)

    if (error) {
       alert('Failed to update order')
       console.error(error)
    } else {
       router.refresh()
    }
    setLoading(false)
  }

  function handleWhatsApp() {
    const domain = window.location.origin
    const trackingLink = `${domain}/track/${order.ticket_id}`
    const message = `Hello ${order.user_name}, 
    
Your order #${order.ticket_id} is *${status.toUpperCase()}*.
Total Amount: $${order.total_amount}

You can track your order and download your e-bill here:
${trackingLink}

Thank you for choosing CrumsOBliss!`

    const encodedMessage = encodeURIComponent(message)
    const phone = order.user_phone.replace(/\D/g, '') // Basic cleanup
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank')
  }

  if (!role) return null // Or skeleton

  const isAdmin = role === 'admin'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdmin && (
          <>
            <div className="space-y-2">
               <label className="text-sm font-medium">Status</label>
               <Select value={status} onValueChange={setStatus}>
                 <SelectTrigger>
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="pending">Pending</SelectItem>
                   <SelectItem value="confirmed">Confirmed</SelectItem>
                   <SelectItem value="delivered">Delivered</SelectItem>
                   <SelectItem value="cancelled">Cancelled</SelectItem>
                 </SelectContent>
               </Select>
            </div>
            
            <div className="space-y-2">
               <label className="text-sm font-medium">Admin Notes</label>
               <Textarea 
                 placeholder="Add notes for the team or customer..." 
                 value={notes}
                 onChange={(e) => setNotes(e.target.value)}
               />
            </div>

            <Button onClick={handleUpdate} disabled={loading} className="w-full">
               {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
               Update Order
            </Button>
          </>
        )}

        <Button variant="outline" onClick={handleWhatsApp} className="w-full border-green-500 text-green-600 hover:bg-green-50">
           <Send className="h-4 w-4 mr-2" />
           Send Bill Link on WhatsApp
        </Button>

        <Button variant="outline" onClick={() => window.open(`/api/generate-bill?ticket_id=${order.ticket_id}`, '_blank')} className="w-full border-primary text-primary hover:bg-primary/5">
           <Download className="h-4 w-4 mr-2" />
           Download PDF Bill
        </Button>
      </CardContent>
    </Card>
  )
}
