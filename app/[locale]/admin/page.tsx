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
    <div className="flex flex-col gap-4 sm:gap-8 w-full pb-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/10 p-6 sm:p-10 mb-2">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground font-display">
              Dashboard Overview
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg italic font-elegant">
              Welcome back. Here is your bakery's performance at a glance.
            </p>
          </div>
          <div className="bg-background/50 p-1 rounded-xl backdrop-blur-sm shadow-sm self-start sm:self-auto">
            <ExportCsvButton />
          </div>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 animate-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
        {/* Card 1: Revenue Today */}
        <Card className="relative overflow-hidden border-0 shadow-lg group hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 opacity-90 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" />
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Revenue (Today)</CardTitle>
            <div className="p-2 bg-white/20 rounded-full backdrop-blur-md">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl sm:text-4xl font-black text-white drop-shadow-sm">₹{revenueToday.toLocaleString()}</div>
            <p className="text-xs text-white/80 mt-2 font-medium">Since midnight</p>
          </CardContent>
        </Card>

        {/* Card 2: Revenue This Month */}
        <Card className="relative overflow-hidden border-0 shadow-lg group hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-orange-500 opacity-90 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" />
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Revenue (Month)</CardTitle>
            <div className="p-2 bg-white/20 rounded-full backdrop-blur-md">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl sm:text-4xl font-black text-white drop-shadow-sm">₹{revenueMonth.toLocaleString()}</div>
            <p className="text-xs text-white/80 mt-2 font-medium">Current month total</p>
          </CardContent>
        </Card>

        {/* Card 3: Total Orders */}
        <Card className="relative overflow-hidden border bg-card shadow-sm hover:shadow-md transition-shadow group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors" />
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Orders</CardTitle>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl sm:text-4xl font-black text-foreground">{allOrders?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">Across entire history</p>
          </CardContent>
        </Card>

        {/* Card 4: Page Views */}
        <Card className="relative overflow-hidden border bg-card shadow-sm hover:shadow-md transition-shadow group">
          <div className="absolute left-0 bottom-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors" />
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Site Views</CardTitle>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl sm:text-4xl font-black text-foreground">{totalPageViews > 0 ? totalPageViews.toLocaleString() : '---'}</div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">Powered by CounterAPI</p>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Charts Component */}
      <div className="animate-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both w-full overflow-hidden">
        <DashboardCharts revenueByDay={revenueChartData} ordersByStatus={statusChartData} />
      </div>

      {/* Lists Row */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        <Card className="col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders?.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{order.user_name || 'Guest'}</p>
                    <p className="text-[10px] text-muted-foreground uppercase opacity-80">TKT: {order.ticket_id}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">₹{order.total_amount}</div>
                    <div className="text-[11px] text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}

              {!recentOrders?.length && (
                <div className="text-center text-muted-foreground text-sm py-8">No orders yet.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle>Top Selling Items</CardTitle>
            <CardDescription>Ranked by verified quantity sold</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 pt-2">
              {topSelling.map((item: { name: string, count: number }, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                      {i + 1}
                    </div>
                    <p className="text-sm font-medium leading-none line-clamp-1">{item.name}</p>
                  </div>
                  <div className="font-medium bg-muted/50 px-2 py-1 rounded text-xs whitespace-nowrap ml-2">{item.count} units</div>
                </div>
              ))}

              {!topSelling.length && (
                <div className="text-center text-muted-foreground text-sm py-8">No sales data.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle>Top Viewed Products</CardTitle>
            <CardDescription>Most popular items in the catalog</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 pt-2">
              {topViewed?.map((item: any, i: number) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                      {i + 1}
                    </div>
                    <p className="text-sm font-medium leading-none line-clamp-1">{item.name}</p>
                  </div>
                  <div className="font-medium bg-muted/50 px-2 py-1 rounded text-xs whitespace-nowrap ml-2">{item.view_count || 0} views</div>
                </div>
              ))}

              {!topViewed?.length && (
                <div className="text-center text-muted-foreground text-sm py-8">No view data available.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 shadow-sm border-orange-200 dark:border-orange-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
              <AlertTriangle className="w-5 h-5" />
              Low Stock Alerts
            </CardTitle>
            <CardDescription>Items with less than 5 units remaining</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 pt-2">
              {lowStockItems?.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 text-[10px] font-bold text-orange-600 dark:text-orange-400">
                      !
                    </div>
                    <p className="text-sm font-medium leading-none line-clamp-1">{item.name}</p>
                  </div>
                  <div className="font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded text-xs whitespace-nowrap ml-2">
                    {item.stock} left
                  </div>
                </div>
              ))}

              {(!lowStockItems || lowStockItems.length === 0) && (
                <div className="text-center text-muted-foreground text-sm py-8">All items are well stocked!</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
