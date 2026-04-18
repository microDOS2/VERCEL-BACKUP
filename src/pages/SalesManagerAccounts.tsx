import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { SalesManagerSidebar } from '@/components/sales-manager/SalesManagerSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { DBUser } from '@/lib/supabase';
import { toast } from 'sonner';

export function SalesManagerAccounts() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [accounts, setAccounts] = useState<DBUser[]>([]);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please log in first');
        navigate('/sales-manager-portal');
        return;
      }

      // Check role
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (userError || userData?.role !== 'sales_manager') {
        toast.error('Access denied');
        navigate('/sales-manager-portal');
        return;
      }

      // Fetch all wholesaler and distributor accounts
      const { data: accountsData, error: accountsError } = await supabase
        .from('users')
        .select('*')
        .in('role', ['wholesaler', 'distributor'])
        .order('business_name', { ascending: true });

      if (accountsError) {
        toast.error('Failed to fetch accounts: ' + accountsError.message);
      } else {
        setAccounts(accountsData || []);
      }

      setLoading(false);
    };

    init();
  }, [navigate]);

  const filteredAccounts = accounts.filter((a) =>
    (a.business_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.city?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0514] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#9a02d0]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0514] flex">
      <SalesManagerSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/sales-manager-dashboard">
              <Button variant="outline" size="sm" className="border-white/10 text-gray-400">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-white">All Accounts ({accounts.length})</h1>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#150f24] border-white/10 text-white"
            />
          </div>

          {filteredAccounts.length === 0 && (
            <div className="bg-[#150f24] rounded-xl border border-white/10 p-8 text-center">
              <p className="text-gray-400">No accounts found.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAccounts.map((account) => (
              <Card key={account.id} className="bg-[#150f24] border-white/10">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white text-lg">{account.business_name || '—'}</CardTitle>
                      <p className="text-gray-400 text-sm">{account.email}</p>
                    </div>
                    <Badge className={account.role === 'distributor' ? 'bg-[#ff66c4]/20 text-[#ff66c4]' : 'bg-[#44f80c]/20 text-[#44f80c]'}>
                      {account.role === 'distributor' ? 'Distributor' : 'Wholesaler'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm">
                    {account.city && account.state ? `${account.city}, ${account.state}` : 'No location'}
                  </p>
                  {account.phone && <p className="text-gray-500 text-sm">{account.phone}</p>}
                  <Badge className={`mt-3 ${account.status === 'approved' ? 'bg-green-500/20 text-green-500' : account.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'}`}>
                    {account.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
