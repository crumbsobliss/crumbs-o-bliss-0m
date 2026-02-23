'use client'

import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useState } from 'react'

export default function ExportCsvButton() {
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    async function handleExport() {
        setLoading(true)
        // Fetch all orders with details
        const { data: orders } = await supabase
            .from('orders')
            .select(`
                id,
                ticket_id,
                user_name,
                user_phone,
                total_amount,
                status,
                delivery_address,
                created_at,
                order_items (
                    product_name,
                    quantity
                )
            `)
            .order('created_at', { ascending: false })
            
        if (!orders || orders.length === 0) {
            alert('No data to export')
            setLoading(false)
            return
        }

        // Convert to CSV
        const headers = ['Date', 'Ticket ID', 'Customer', 'Phone', 'Status', 'Total (INR)', 'Items Ordered', 'Delivery Address']
        const csvContent = [
            headers.join(','),
            ...orders.map(order => {
                // Format items beautifully: "2x Pizza, 1x Cake"
                const itemsStr = order.order_items 
                    ? order.order_items.map((i: any) => `${i.quantity}x ${i.product_name}`).join(' | ') 
                    : 'No items';

                // Escape commas and quotes for CSV
                const escapeCsv = (str: string | null) => {
                    if (!str) return '""';
                    const s = String(str).replace(/"/g, '""');
                    return `"${s}"`;
                };

                return [
                    new Date(order.created_at).toLocaleString(),
                    escapeCsv(order.ticket_id),
                    escapeCsv(order.user_name),
                    escapeCsv(order.user_phone),
                    escapeCsv(order.status),
                    order.total_amount,
                    escapeCsv(itemsStr),
                    escapeCsv(order.delivery_address)
                ].join(',')
            })
        ].join('\n')

        // Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('download', 'orders_export.csv')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        setLoading(false)
    }

    return (
        <Button variant="outline" size="sm" onClick={handleExport} disabled={loading}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
        </Button>
    )
}
