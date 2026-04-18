import { Link } from 'react-router-dom';
import { DistributorSidebar } from '@/components/distributor/DistributorSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, Eye } from 'lucide-react';

const orders = [
  { id: 'ORD-2026-001', date: '2026-04-15', items: 3, total: 1250.0, status: 'processing' },
  { id: 'ORD-2026-002', date: '2026-04-10', items: 5, total: 2100.5, status: 'shipped' },
  { id: 'ORD-2026-003', date: '2026-04-05', items: 2, total: 850.0, status: 'delivered' },
  { id: 'ORD-2026-004', date: '2026-03-28', items: 4, total: 1800.0, status: 'delivered' },
];

const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    processing: 'bg-blue-500/20 text-blue-500',
    shipped: 'bg-purple-500/20 text-purple-500',
    delivered: 'bg-green-500/20 text-green-500',
  };
  return styles[status] || 'bg-gray-500/20 text-gray-500';
};

export function DistributorOrders() {
  return (
    <div className="min-h-screen bg-[#0a0514] flex">
      <DistributorSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/distributor-dashboard">
              <Button variant="outline" size="sm" className="border-white/10 text-gray-400">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-white">My Orders</h1>
          </div>

          <Card className="bg-[#150f24] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#9a02d0]" />
                Order History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#0a0514] rounded-lg border border-white/10">
                    <div>
                      <p className="text-white font-medium">{order.id}</p>
                      <p className="text-gray-400 text-sm">{order.date} • {order.items} items</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-white font-bold">${order.total.toFixed(2)}</p>
                      <Badge className={getStatusBadge(order.status)}>{order.status}</Badge>
                      <Button variant="ghost" size="sm" className="text-[#44f80c]">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
