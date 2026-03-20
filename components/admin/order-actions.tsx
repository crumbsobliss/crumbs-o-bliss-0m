
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Send, Save, Download } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

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
            alert('Could not update order.')
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
Total Amount: ₹${order.total_amount}

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
    <Card className="rounded-3xl shadow-sm border-none overflow-hidden">
      <CardHeader className="bg-muted/30 border-b border-border/40 px-6 py-4">
        <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {isAdmin && (
          <>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Change Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="rounded-xl h-10 text-xs font-bold uppercase tracking-widest border-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-xl">
                  <SelectItem value="pending" className="text-xs font-bold uppercase tracking-widest">PENDING</SelectItem>
                  <SelectItem value="confirmed" className="text-xs font-bold uppercase tracking-widest">ACCEPTED</SelectItem>
                  <SelectItem value="delivered" className="text-xs font-bold uppercase tracking-widest">DELIVERED</SelectItem>
                  <SelectItem value="cancelled" className="text-xs font-bold uppercase tracking-widest">CANCELLED</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Internal Notes</label>
              <Textarea
                placeholder="Add private notes for staff..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="rounded-2xl min-h-[100px] text-sm bg-muted/20 border-border/40 focus:bg-background transition-colors"
              />
            </div>

            <Button onClick={handleUpdate} disabled={loading} className="w-full rounded-xl h-11 text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              {loading ? "Saving..." : "Update Order"}
            </Button>
            <Separator className="opacity-30" />
          </>
        )}

        <div className="grid grid-cols-1 gap-3 pt-2">
            <Button variant="outline" onClick={handleWhatsApp} className="w-full rounded-xl h-11 text-xs font-bold uppercase tracking-widest border-green-500/20 text-green-600 dark:text-green-500 hover:bg-green-500/10 hover:text-green-600 transition-all">
                <Send className="h-4 w-4 mr-2" />
                Notify on WhatsApp
            </Button>

            <Button variant="outline" onClick={() => window.open(`/api/generate-bill?ticket_id=${order.ticket_id}`, '_blank')} className="w-full rounded-xl h-11 text-xs font-bold uppercase tracking-widest border-primary/10 hover:bg-primary/5 transition-all">
                <Download className="h-4 w-4 mr-2" />
                Download Bill
            </Button>
        </div>
      </CardContent>
    </Card>
  )
}
