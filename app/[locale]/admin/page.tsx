import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, CreditCard, Activity, ShoppingBag, Package, Eye, AlertTriangle } from "lucide-react"
import ExportCsvButton from "@/components/admin/export-csv-button"
import DashboardCharts from '@/components/admin/dashboard-charts'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Date calculation for filtering
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()

  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  const startOfWeekIso = startOfWeek.toISOString()

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString()

  // 1. Revenue & Orders Fetch
  const { data: allOrders } = await supabase
    .from('orders')
    .select('id, total_amount, created_at, status')

  let revenueToday = 0;
  let revenueWeek = 0;
  let revenueMonth = 0;
  let revenueYear = 0;
  let totalRevenue = 0;

  // Data grouping for charts
  const last7DaysRevenue: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    last7DaysRevenue[d.toISOString().split('T')[0]] = 0;
  }

  const statusCount: Record<string, number> = { pending: 0, confirmed: 0, delivered: 0, cancelled: 0 };

  allOrders?.forEach(order => {
    const amount = order.total_amount || 0;

    // Revenue aggregation (skip cancelled for revenue)
    if (order.status !== 'cancelled') {
      totalRevenue += amount;
      if (order.created_at >= startOfDay) revenueToday += amount;
      if (order.created_at >= startOfWeekIso) revenueWeek += amount;
      if (order.created_at >= startOfMonth) revenueMonth += amount;
      if (order.created_at >= startOfYear) revenueYear += amount;

      // Chart grouping
      const dateKey = order.created_at.split('T')[0];
      if (last7DaysRevenue[dateKey] !== undefined) {
        last7DaysRevenue[dateKey] += amount;
      }
    }

    // Status aggregation
    if (order.status) {
      statusCount[order.status] = (statusCount[order.status] || 0) + 1;
    }
  });

  const revenueChartData = Object.entries(last7DaysRevenue).map(([date, amount]) => ({ date, amount }));
  const statusChartData = Object.entries(statusCount).map(([status, count]) => ({ status, count }));

  // 2. Fetch Products
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  // 3. CounterAPI Views
  let totalPageViews = 0;
  try {
    const counterToken = process.env.COUNTERAPI_TOKEN || process.env.COUNTERAPI_KEY || '';
    if (counterToken) {
      const res = await fetch('https://api.counterapi.dev/v2/crumbsoblisss-team-2979/page-view-crumbsobliss', {
        headers: { 'Authorization': `Bearer ${counterToken}` },
        next: { revalidate: 60 } // Cache for 60 seconds
      });
      if (res.ok) {
        const resData = await res.json();
        totalPageViews = resData?.data?.up_count || 0;
      }
    }
  } catch (error) {
    console.error("Failed to fetch CounterAPI stats", error);
  }

  // 4. Recent Orders
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  // 5. Top Viewed Items (Supabase internal)
  const { data: topViewed } = await supabase
    .from('products')
    .select('id, name, view_count')
    .order('view_count', { ascending: false })
    .limit(5);

  // 6. Top Selling Items
  const { data: allOrderItems } = await supabase
    .from('order_items')
    .select('product_id, product_name, quantity, orders!inner(status)')
    .neq('orders.status', 'cancelled');

  let salesCount: Record<string, { name: string, count: number }> = {};
  allOrderItems?.forEach(item => {
    if (!item.product_id) return;
    if (!salesCount[item.product_id]) salesCount[item.product_id] = { name: item.product_name, count: 0 };
    salesCount[item.product_id].count += item.quantity;
  });

  const topSelling = Object.values(salesCount)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // 7. Low Stock Alerts
  const { data: lowStockItems } = await supabase
    .from('products')
    .select('id, name, stock')
    .lt('stock', 5)
    .order('stock', { ascending: true })
    .limit(5);

  return (
    <div className="flex flex-col gap-8 w-full pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Friendly Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Hello, Admin 👋
          </h1>
          <p className="text-muted-foreground mt-2 max-w-lg">
            Here's what's happening with Crumbs O' Bliss today. You're doing great!
          </p>
        </div>
        <div className="flex items-center gap-3">
            <ExportCsvButton />
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl shadow-sm border-none bg-gradient-to-br from-blue-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Today's Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold italic">₹{revenueToday.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                Updating live
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-none bg-gradient-to-br from-purple-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">Monthly Goal</CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold italic">₹{revenueMonth.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-2">Current month total</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-none bg-gradient-to-br from-orange-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold italic">{allOrders?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-2">Lifetime successful orders</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-none bg-gradient-to-br from-green-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Our Visitors</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold italic">{totalPageViews > 0 ? totalPageViews.toLocaleString() : '---'}</div>
            <p className="text-xs text-muted-foreground mt-2">Total page impressions</p>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Charts Component */}
      <div className="w-full">
        <DashboardCharts revenueByDay={revenueChartData} ordersByStatus={statusChartData} />
      </div>

      {/* Informative Lists */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl shadow-sm border-none bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold">Latest Orders</CardTitle>
            <CardDescription className="text-xs">Your most recent customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {recentOrders?.map((order: any) => (
                <div key={order.id} className="flex justify-between items-start text-sm group">
                  <div className="space-y-0.5">
                    <span className="font-bold text-foreground block group-hover:text-primary transition-colors">{order.user_name || 'Anonymous'}</span>
                    <p className="text-[10px] text-muted-foreground font-mono">#{order.ticket_id}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-primary">₹{order.total_amount}</span>
                    <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-tighter">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {!recentOrders?.length && <div className="text-sm text-muted-foreground py-10 text-center italic">No orders yet.</div>}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-none bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold">Top Sellers</CardTitle>
            <CardDescription className="text-xs">Items people love the most</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSelling.map((item: { name: string, count: number }, i: number) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="truncate pr-4 font-medium">{item.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary whitespace-nowrap">{item.count} Sold</span>
                </div>
              ))}
              {!topSelling.length && <div className="text-sm text-muted-foreground py-10 text-center italic">No sales data.</div>}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-none bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold">Popular Items</CardTitle>
            <CardDescription className="text-xs">Most viewed menu items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topViewed?.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="truncate pr-4 font-medium">{item.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 whitespace-nowrap">{item.view_count || 0} Views</span>
                </div>
              ))}
              {!topViewed?.length && <div className="text-sm text-muted-foreground py-10 text-center italic">No views yet.</div>}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-none bg-card border-l-4 border-l-red-500/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Stock Alerts
            </CardTitle>
            <CardDescription className="text-xs">Items running out soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems?.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center text-sm p-2 rounded-lg bg-red-50/50 dark:bg-red-950/10">
                  <span className="truncate pr-4 font-medium">{item.name}</span>
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">{item.stock} left</span>
                </div>
              ))}
              {(!lowStockItems || lowStockItems.length === 0) && (
                <div className="text-sm text-green-600 py-10 text-center italic flex flex-col items-center gap-2">
                    <span className="text-lg">✨</span>
                    All levels optimal.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
