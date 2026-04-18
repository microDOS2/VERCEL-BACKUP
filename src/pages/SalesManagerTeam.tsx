import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { SalesManagerSidebar } from '@/components/sales-manager/SalesManagerSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Store, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { DBUser } from '@/lib/supabase';
import { toast } from 'sonner';

export function SalesManagerTeam() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [manager, setManager] = useState<DBUser | null>(null);
  const [salesReps, setSalesReps] = useState<DBUser[]>([]);

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
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (userError || userData?.role !== 'sales_manager') {
        toast.error('Access denied');
        navigate('/sales-manager-portal');
        return;
      }

      setManager(userData);

      // Fetch sales reps managed by this manager
      const { data: repsData, error: repsError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'sales_rep')
        .eq('manager_id', session.user.id)
        .order('business_name', { ascending: true });

      if (repsError) {
        toast.error('Failed to fetch sales reps: ' + repsError.message);
      } else {
        setSalesReps(repsData || []);
      }

      setLoading(false);
    };

    init();
  }, [navigate]);

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
            <h1 className="text-3xl font-bold text-white">My Team</h1>
          </div>

          {salesReps.length === 0 && (
            <div className="bg-[#150f24] rounded-xl border border-white/10 p-8 text-center">
              <Store className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No sales reps on your team yet.</p>
              <p className="text-gray-500 text-sm mt-2">
                Ask your admin to assign sales reps to you (manager: {manager?.email}).
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {salesReps.map((rep) => (
              <Card key={rep.id} className="bg-[#150f24] border-white/10">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#9a02d0] to-[#44f80c] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {(rep.business_name || rep.email).split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{rep.business_name || rep.email}</CardTitle>
                      <p className="text-gray-400 text-sm">{rep.email}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {rep.city && rep.state && (
                    <p className="text-gray-500 text-sm mb-3">{rep.city}, {rep.state}</p>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0a0514] rounded-lg p-3 text-center">
                      <Store className="w-5 h-5 text-[#44f80c] mx-auto mb-1" />
                      <p className="text-2xl font-bold text-white">—</p>
                      <p className="text-gray-400 text-sm">Wholesalers</p>
                    </div>
                    <div className="bg-[#0a0514] rounded-lg p-3 text-center">
                      <Store className="w-5 h-5 text-[#9a02d0] mx-auto mb-1" />
                      <p className="text-2xl font-bold text-white">—</p>
                      <p className="text-gray-400 text-sm">Distributors</p>
                    </div>
                  </div>
                  <Badge className="w-full justify-center mt-4 bg-[#44f80c]/20 text-[#44f80c]">
                    Active Sales Rep
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
