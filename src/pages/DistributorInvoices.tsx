import { Link } from 'react-router-dom';
import { DistributorSidebar } from '@/components/distributor/DistributorSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, Download, Eye } from 'lucide-react';

const invoices = [
  { id: 'INV-2026-001', invoiceNumber: 'INV-001', amount: 1250.0, dueDate: '2026-05-15', status: 'open' },
  { id: 'INV-2026-002', invoiceNumber: 'INV-002', amount: 2100.5, dueDate: '2026-05-10', status: 'open' },
  { id: 'INV-2026-003', invoiceNumber: 'INV-003', amount: 850.0, dueDate: '2026-04-30', status: 'paid' },
];

const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    open: 'bg-orange-500/20 text-orange-500',
    paid: 'bg-green-500/20 text-green-500',
    overdue: 'bg-red-500/20 text-red-500',
  };
  return styles[status] || 'bg-gray-500/20 text-gray-500';
};

export function DistributorInvoices() {
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
            <h1 className="text-3xl font-bold text-white">My Invoices</h1>
          </div>

          <Card className="bg-[#150f24] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#9a02d0]" />
                Invoice History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#0a0514] rounded-lg border border-white/10">
                    <div>
                      <p className="text-white font-medium">{invoice.invoiceNumber}</p>
                      <p className="text-gray-400 text-sm">Due: {invoice.dueDate}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-white font-bold">${invoice.amount.toFixed(2)}</p>
                      <Badge className={getStatusBadge(invoice.status)}>{invoice.status}</Badge>
                      <Button variant="ghost" size="sm" className="text-[#44f80c]">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400">
                        <Download className="w-4 h-4" />
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
