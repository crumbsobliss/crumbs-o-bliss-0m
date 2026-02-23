'use client'

import React, { useMemo } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ChartDataProps {
  revenueByDay: { date: string; amount: number }[]
  ordersByStatus: { status: string; count: number }[]
}

export default function DashboardCharts({ revenueByDay, ordersByStatus }: ChartDataProps) {
  // Memoize to prevent unnecessary recalculations
  const formattedRevenue = useMemo(() => {
    return revenueByDay.map((item) => {
      const dateObj = new Date(item.date)
      return {
        ...item,
        displayDate: dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      }
    })
  }, [revenueByDay])

  const formatCurrency = (val: number) => `₹${val.toLocaleString()}`

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-1 lg:col-span-4">
        <CardHeader>
          <CardTitle>Revenue Overview (Last 7 Days)</CardTitle>
          <CardDescription>Daily revenue performance.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] w-full pt-4">
          {formattedRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
                <XAxis 
                  dataKey="displayDate" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                  dy={10} 
                />
                <YAxis 
                  tickFormatter={(val) => `₹${val}`} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  width={60}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
             <div className="flex h-full items-center justify-center text-muted-foreground">No recent revenue data.</div>
          )}
        </CardContent>
      </Card>

      <Card className="col-span-1 lg:col-span-3">
        <CardHeader>
          <CardTitle>Orders by Status</CardTitle>
          <CardDescription>Current state of all active orders.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] w-full pt-4">
           {ordersByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersByStatus} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
                <XAxis type="number" hide />
                <YAxis 
                    dataKey="status" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--primary))' }}
                    tickFormatter={(val: string) => val.charAt(0).toUpperCase() + val.slice(1)}
                />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={30} label={{ position: 'right', fill: 'hsl(var(--foreground))' }} />
              </BarChart>
            </ResponsiveContainer>
           ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">No order status data.</div>
           )}
        </CardContent>
      </Card>
    </div>
  )
}
