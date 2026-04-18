import { Link } from 'react-router-dom';
import { DistributorSidebar } from '@/components/distributor/DistributorSidebar';
import { DistributorStats } from '@/components/distributor/DistributorStats';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ShoppingCart,
  FileText,
  FileSignature,
  Package,
  Eye,
  Download,
  PenTool,
  ArrowRight,
} from 'lucide-react';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CartButton } from '@/components/cart/CartButton';

// Mock data for recent orders
const recentOrders = [
  { id: 'ORD-2026-001', date: '2026-04-15', items: 3, total: 1250.0, status: 'processing' },
  { id: 'ORD-2026-002', date: '2026-04-10', items: 5, total: 2100.5, status: 'shipped' },
  { id: 'ORD-2026-003', date: '2026-04-05', items: 2, total: 850.0, status: 'delivered' },
  { id: 'ORD-2026-004', date: '2026-03-28', items: 4, total: 1800.0, status: 'delivered' },
];

// Mock data for pending agreements
const pendingAgreements = [
  { id: 'AGR-001', title: 'Distributor Agreement 2026', version: '2.1', sentDate: '2026-04-10', status: 'pending' },
];

// Mock data for open invoices
const openInvoices = [
  { id: 'INV-2026-001', invoiceNumber: 'INV-001', amount: 1250.0, dueDate: '2026-05-15', status: 'open' },
  { id: 'INV-2026-002', invoiceNumber: 'INV-002', amount: 2100.5, dueDate: '2026-05-10', status: 'open' },
];

const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
    processing: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
    shipped: 'bg-purple-500/20 text-purple-500 border-purple-500/30',
    delivered: 'bg-green-500/20 text-green-500 border-green-500/30',
    open: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
    paid: 'bg-green-500/20 text-green-500 border-green-500/30',
  };
  return styles[status] || 'bg-gray-500/20 text-gray-500';
};

export function DistributorDashboard() {
  return (
    <div className="min-h-screen bg-[#0a0514] flex">
      <DistributorSidebar />
      
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <CartDrawer />
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Distributor Dashboard
              </h1>
              <p className="text-gray-400">
                Welcome back! Here's what's happening with your account.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/products">
                <Button className="bg-gradient-to-r from-[#9a02d0] to-[#44f80c] text-white hover:opacity-90">
                  <Package className="w-4 h-4 mr-2" />
                  Browse Products
                </Button>
              </Link>
              <CartButton />
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8">
            <DistributorStats />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <Card className="bg-[#150f24] border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[#9a02d0]" />
                  Recent Orders
                </CardTitle>
                <Link to="/distributor-orders">
                  <Button variant="ghost" size="sm" className="text-[#9a02d0] hover:text-[#ff66c4]">
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-gray-400">Order #</TableHead>
                      <TableHead className="text-gray-400">Date</TableHead>
                      <TableHead className="text-gray-400">Total</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="text-white font-medium">{order.id}</TableCell>
                        <TableCell className="text-gray-400">{order.date}</TableCell>
                        <TableCell className="text-white">
                          ${order.total.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Open Invoices */}
            <Card className="bg-[#150f24] border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#9a02d0]" />
                  Open Invoices
                </CardTitle>
                <Link to="/distributor-invoices">
                  <Button variant="ghost" size="sm" className="text-[#9a02d0] hover:text-[#ff66c4]">
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-gray-400">Invoice #</TableHead>
                      <TableHead className="text-gray-400">Amount</TableHead>
                      <TableHead className="text-gray-400">Due Date</TableHead>
                      <TableHead className="text-gray-400">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {openInvoices.map((invoice) => (
                      <TableRow key={invoice.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="text-white font-medium">
                          {invoice.invoiceNumber}
                        </TableCell>
                        <TableCell className="text-white">
                          ${invoice.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-gray-400">{invoice.dueDate}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-[#44f80c] hover:text-[#44f80c]/80">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Pending Agreements */}
            <Card className="bg-[#150f24] border-white/10 lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <FileSignature className="w-5 h-5 text-[#9a02d0]" />
                  Pending Agreements
                </CardTitle>
                <Link to="/distributor-agreements">
                  <Button variant="ghost" size="sm" className="text-[#9a02d0] hover:text-[#ff66c4]">
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {pendingAgreements.length > 0 ? (
                  <div className="space-y-4">
                    {pendingAgreements.map((agreement) => (
                      <div
                        key={agreement.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#0a0514] rounded-lg border border-white/10"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-[#9a02d0]/20 rounded-lg flex items-center justify-center">
                            <FileSignature className="w-5 h-5 text-[#9a02d0]" />
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{agreement.title}</h4>
                            <p className="text-gray-400 text-sm">
                              Version {agreement.version} • Sent on {agreement.sentDate}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="border-white/10 text-gray-300 hover:bg-white/5">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                          <Button size="sm" className="bg-gradient-to-r from-[#9a02d0] to-[#44f80c] text-white hover:opacity-90">
                            <PenTool className="w-4 h-4 mr-1" />
                            Review & Sign
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileSignature className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No pending agreements</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
