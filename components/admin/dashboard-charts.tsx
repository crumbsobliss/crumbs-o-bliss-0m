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
      <Card className="col-span-1 lg:col-span-4 rounded-3xl shadow-sm border-none overflow-hidden h-full">
        <CardHeader className="bg-muted/30 border-b border-border/40 px-6 py-4">
          <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Sales Trend</CardTitle>
          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mt-1">Last 7 days</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] w-full p-6">
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
                  tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                  dy={10}
                />
                <YAxis
                  tickFormatter={(val) => `₹${val}`}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                  width={60}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), 'Sales']}
                  contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '16px', fontSize: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
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
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">Insufficient data.</div>
          )}
        </CardContent>
      </Card>

      <Card className="col-span-1 lg:col-span-3 rounded-3xl shadow-sm border-none overflow-hidden h-full">
        <CardHeader className="bg-muted/30 border-b border-border/40 px-6 py-4">
          <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Order Progress</CardTitle>
          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mt-1">Status distribution</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] w-full p-6">
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
                  tick={{ fontSize: 10, fill: 'var(--foreground)', fontWeight: 'bold' }}
                  tickFormatter={(val: string) => val.charAt(0).toUpperCase() + val.slice(1)}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '16px', fontSize: '12px', color: 'var(--foreground)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                />
                <Bar dataKey="count" fill="var(--primary)" radius={[0, 8, 8, 0]} barSize={24} label={{ position: 'right', fill: 'var(--foreground)', fontSize: 10, fontWeight: 'bold' }} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 italic">Waiting for more data...</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
