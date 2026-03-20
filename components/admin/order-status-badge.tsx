
import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle2, Package, XCircle } from 'lucide-react'

export function OrderStatusBadge({ status }: { status: string }) {
    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'Pending';
            case 'confirmed': return 'Accepted';
            case 'delivered': return 'Delivered';
            case 'cancelled': return 'Cancelled';
            default: return status;
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'border-orange-500/20 text-orange-600 dark:text-orange-400 bg-orange-500/10 shadow-sm shadow-orange-500/5';
            case 'confirmed': return 'border-blue-500/20 text-blue-600 dark:text-blue-400 bg-blue-500/10 shadow-sm shadow-blue-500/5';
            case 'delivered': return 'border-green-500/20 text-green-600 dark:text-green-400 bg-green-500/10 shadow-sm shadow-green-500/5';
            case 'cancelled': return 'border-red-500/20 text-red-600 dark:text-red-400 bg-red-500/10 shadow-sm shadow-red-500/5';
            default: return 'border-gray-500/20 text-gray-600 dark:text-gray-400 bg-gray-500/10 shadow-sm shadow-gray-500/5';
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="h-3 w-3" />;
            case 'confirmed': return <CheckCircle2 className="h-3 w-3" />;
            case 'delivered': return <Package className="h-3 w-3" />;
            case 'cancelled': return <XCircle className="h-3 w-3" />;
            default: return <Clock className="h-3 w-3" />;
        }
    }

    return (
        <Badge variant="outline" className={`gap-1.5 rounded-full font-bold text-[10px] uppercase tracking-widest px-3 py-1 border transition-all hover:scale-105 active:scale-95 ${getStatusColor(status)}`}>
            {getStatusIcon(status)}
            <span>{getStatusLabel(status)}</span>
        </Badge>
    )
}
