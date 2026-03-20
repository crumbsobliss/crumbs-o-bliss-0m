
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { OrderStatusBadge } from '@/components/admin/order-status-badge'
import { Separator } from '@/components/ui/separator'
// We will create a client component for actions (Update Status, WhatsApp)
import OrderActions from '@/components/admin/order-actions'

type Props = {
    params: Promise<{ id: string; locale: string }>
}

export default async function OrderDetailsPage({ params }: Props) {
    const { id } = await params
    const supabase = await createClient()

    // Fetch Order
    const { data: order } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single()

    if (!order) {
        notFound()
    }

    // Fetch Items
    const { data: items } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', id)

    return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground italic">Order Details</h1>
          <p className="text-sm font-mono text-muted-foreground mt-1 tracking-tighter uppercase font-bold text-[10px]">ID: {order.ticket_id} • {new Date(order.created_at).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center">
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card className="rounded-3xl shadow-sm border-none overflow-hidden">
                        <CardHeader className="bg-muted/30 border-b border-border/40 px-6 py-4">
                            <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Items Ordered</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {items?.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center group transition-colors">
                                        <div className="space-y-1">
                                            <p className="font-bold text-sm group-hover:text-primary transition-colors">{item.product_name}</p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.quantity} × ₹{item.price_at_time}</p>
                                        </div>
                                        <div className="font-bold text-sm text-primary">
                                            ₹{(item.quantity * item.price_at_time).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                                <Separator className="my-6 opacity-30" />
                                <div className="flex justify-between items-center bg-primary/5 p-4 rounded-2xl border border-primary/10">
                                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary/70">Total Amount</span>
                                    <span className="font-bold text-xl text-primary">₹{order.total_amount}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Actions - Pass locale for link generation if needed */}
                    <OrderActions order={order} />
                </div>

                <div className="space-y-6">
                    <Card className="rounded-3xl shadow-sm border-none overflow-hidden">
                        <CardHeader className="bg-muted/30 border-b border-border/40 px-6 py-4">
                            <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Customer Info</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="flex flex-col gap-1">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Name</p>
                                <p className="text-sm font-bold">{order.user_name}</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Contact</p>
                                <p className="text-sm font-bold text-primary">{order.user_phone}</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Address</p>
                                <p className="text-sm font-bold leading-relaxed">{order.delivery_address}</p>
                            </div>
                            {order.user_email && (
                                <div className="flex flex-col gap-1">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Email</p>
                                    <p className="text-sm font-bold">{order.user_email}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="rounded-3xl shadow-sm border-none overflow-hidden bg-orange-50/20 dark:bg-orange-900/5 hover:bg-orange-50/40 transition-colors">
                        <CardHeader className="bg-orange-500/10 border-b border-orange-500/10 px-6 py-4 text-orange-600 dark:text-orange-400">
                            <CardTitle className="text-sm font-bold uppercase tracking-[0.2em]">Internal Notes</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <p className="text-xs font-bold text-orange-700/80 dark:text-orange-300/80 leading-relaxed italic">
                                {order.admin_notes || "No internal notes yet."}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
