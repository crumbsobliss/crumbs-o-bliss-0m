
import { createClient } from '@/utils/supabase/server'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import Link from 'next/link'
import { OrderStatusBadge } from '@/components/admin/order-status-badge'
import { Card, CardContent } from '@/components/ui/card'

export default async function AdminOrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createClient()

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error)
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="flex flex-col gap-2 pb-6 border-b border-border/40">
        <h1 className="text-3xl font-bold tracking-tight text-foreground italic">Customer Orders</h1>
        <p className="text-muted-foreground text-sm">Reviewing {orders?.length || 0} total requests from your shop.</p>
      </div>

      <div className="border rounded-2xl bg-card shadow-sm overflow-hidden hidden md:block">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="w-[120px] text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground pl-6">ID</TableHead>
              <TableHead className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Customer</TableHead>
              <TableHead className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground text-center">Amount</TableHead>
              <TableHead className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground text-center">Status</TableHead>
              <TableHead className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Date</TableHead>
              <TableHead className="text-right text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground pr-6">Manage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id} className="group hover:bg-muted/50 transition-colors">
                <TableCell className="font-mono text-[10px] font-bold pl-6 text-muted-foreground">#{order.ticket_id}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold group-hover:text-primary transition-colors">{order.user_name}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{order.user_phone}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                    <span className="text-sm font-bold text-primary">₹{order.total_amount}</span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <OrderStatusBadge status={order.status} />
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right pr-6">
                  <Button variant="outline" size="sm" asChild className="rounded-xl h-9 px-4 text-xs font-bold hover:bg-primary hover:text-primary-foreground border-primary/20 transition-all">
                    <Link href={`/${locale}/admin/orders/${order.id}`}>
                      View Details
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Experience: Card Layout */}
      <div className="grid gap-4 md:hidden">
        {orders?.map((order) => (
            <Link key={order.id} href={`/${locale}/admin/orders/${order.id}`} className="block group">
                <Card className="rounded-2xl border-none shadow-sm group-active:scale-[0.98] transition-all">
                    <CardContent className="p-5 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Order #{order.ticket_id}</p>
                                <h3 className="font-bold text-lg">{order.user_name}</h3>
                                <p className="text-[10px] font-bold text-muted-foreground font-mono">{order.user_phone}</p>
                            </div>
                            <OrderStatusBadge status={order.status} />
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-border/40">
                            <div className="flex flex-col">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Amount</p>
                                <p className="font-bold text-primary">₹{order.total_amount}</p>
                            </div>
                            <div className="flex flex-col text-right">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Placed On</p>
                                <p className="text-xs font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        ))}
      </div>

      {(!orders || orders.length === 0) && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4 bg-muted/20 rounded-3xl border border-dashed">
            <div className="text-4xl text-muted-foreground/30">📦</div>
            <div className="space-y-1">
                <p className="font-bold text-muted-foreground">No orders here yet.</p>
                <p className="text-xs text-muted-foreground/60 max-w-[200px]">When customers buy something, they'll show up here!</p>
            </div>
          </div>
      )}
    </div>
  )
}
