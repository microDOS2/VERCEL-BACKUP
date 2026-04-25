import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { SalesManagerSidebar } from '@/components/sales-manager/SalesManagerSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { DBUser } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserInfoBar } from '@/components/UserInfoBar';

export function SalesManagerSettings() {
  const navigate = useNavigate();
  const [manager, setManager] = useState<DBUser | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please log in first');
        navigate('/sales-manager-portal');
        return;
      }

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
      setBusinessName(userData.business_name || '');
      setEmail(userData.email || '');
      setPhone(userData.phone || '');
      setCity(userData.city || '');
      setState(userData.state || '');
    };

    init();
  }, [navigate]);

  const handleSave = async () => {
    if (!manager) return;
    setSaving(true);

    const { error } = await supabase
      .from('users')
      .update({
        business_name: businessName,
        phone,
        city,
        state,
        updated_at: new Date().toISOString(),
      })
      .eq('id', manager.id);

    if (error) {
      toast.error('Failed to save: ' + error.message);
    } else {
      toast.success('Settings saved successfully');
    }

    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0514] flex">
      <SalesManagerSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <UserInfoBar />
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/sales-manager-dashboard">
              <Button variant="outline" size="sm" className="border-white/10 text-gray-400">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
          </div>

          <Card className="bg-[#150f24] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5 text-[#9a02d0]" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Business Name / Full Name</Label>
                <Input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="bg-[#0a0514] border-white/10 text-white"
                  placeholder="Your name"
                />
              </div>
              <div>
                <Label className="text-gray-300">Email</Label>
                <Input
                  value={email}
                  disabled
                  className="bg-[#0a0514] border-white/10 text-gray-500"
                />
                <p className="text-gray-500 text-xs mt-1">Email cannot be changed</p>
              </div>
              <div>
                <Label className="text-gray-300">Phone</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-[#0a0514] border-white/10 text-white"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">City</Label>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="bg-[#0a0514] border-white/10 text-white"
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">State</Label>
                  <Input
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="bg-[#0a0514] border-white/10 text-white"
                    placeholder="State"
                  />
                </div>
              </div>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-gradient-to-r from-[#9a02d0] to-[#44f80c] text-white"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
