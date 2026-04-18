import { Link } from 'react-router-dom';
import { DistributorSidebar } from '@/components/distributor/DistributorSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Building2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function DistributorSettings() {
  const [businessName, setBusinessName] = useState('West Coast Distribution');
  const [contactName, setContactName] = useState('James Wilson');
  const [email, setEmail] = useState('james@westcoastdist.com');

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="min-h-screen bg-[#0a0514] flex">
      <DistributorSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/distributor-dashboard">
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
                <Building2 className="w-5 h-5 text-[#9a02d0]" />
                Business Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Business Name</Label>
                <Input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="bg-[#0a0514] border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Contact Name</Label>
                <Input
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="bg-[#0a0514] border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Email</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#0a0514] border-white/10 text-white"
                />
              </div>
              <Button onClick={handleSave} className="bg-gradient-to-r from-[#9a02d0] to-[#44f80c] text-white">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
