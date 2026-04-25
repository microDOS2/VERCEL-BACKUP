import { Link } from 'react-router-dom';
import { DistributorSidebar } from '@/components/distributor/DistributorSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileSignature, Download, PenTool } from 'lucide-react';
import { UserInfoBar } from '@/components/UserInfoBar';

const agreements = [
  { id: 'AGR-001', title: 'Distributor Agreement 2026', version: '2.1', sentDate: '2026-04-10', status: 'pending' },
  { id: 'AGR-002', title: 'Terms of Service', version: '1.0', sentDate: '2026-01-15', status: 'signed' },
];

const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-500',
    signed: 'bg-green-500/20 text-green-500',
  };
  return styles[status] || 'bg-gray-500/20 text-gray-500';
};

export function DistributorAgreements() {
  return (
    <div className="min-h-screen bg-[#0a0514] flex">
      <DistributorSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <UserInfoBar />
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/distributor-dashboard">
              <Button variant="outline" size="sm" className="border-white/10 text-gray-400">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-white">My Agreements</h1>
          </div>

          <Card className="bg-[#150f24] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-[#9a02d0]" />
                Agreements & Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agreements.map((agreement) => (
                  <div key={agreement.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#0a0514] rounded-lg border border-white/10">
                    <div>
                      <p className="text-white font-medium">{agreement.title}</p>
                      <p className="text-gray-400 text-sm">Version {agreement.version} • Sent {agreement.sentDate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusBadge(agreement.status)}>{agreement.status}</Badge>
                      <Button variant="ghost" size="sm" className="text-gray-400">
                        <Download className="w-4 h-4" />
                      </Button>
                      {agreement.status === 'pending' && (
                        <Button size="sm" className="bg-gradient-to-r from-[#9a02d0] to-[#44f80c] text-white">
                          <PenTool className="w-4 h-4 mr-1" />
                          Sign
                        </Button>
                      )}
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
