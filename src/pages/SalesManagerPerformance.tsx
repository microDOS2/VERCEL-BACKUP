import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { SalesManagerSidebar } from '@/components/sales-manager/SalesManagerSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserInfoBar } from '@/components/UserInfoBar';

export function SalesManagerPerformance() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please log in first');
        navigate('/sales-manager-portal');
        return;
      }
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();
      if (userData?.role !== 'sales_manager') {
        toast.error('Access denied');
        navigate('/sales-manager-portal');
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0a0514] flex">
      <SalesManagerSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <UserInfoBar />
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/sales-manager-dashboard">
              <Button variant="outline" size="sm" className="border-white/10 text-gray-400">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-white">Performance</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-[#150f24] border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#44f80c]/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-[#44f80c]" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold text-white">$156,420</p>
                    <p className="text-[#44f80c] text-sm">+18% vs last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#150f24] border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#9a02d0]/20 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-[#9a02d0]" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Orders</p>
                    <p className="text-2xl font-bold text-white">342</p>
                    <p className="text-[#44f80c] text-sm">+12% vs last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#150f24] border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#ff66c4]/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-[#ff66c4]" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Avg Order Value</p>
                    <p className="text-2xl font-bold text-white">$457</p>
                    <p className="text-[#44f80c] text-sm">+5% vs last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#150f24] border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Team Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Performance charts coming soon...</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
