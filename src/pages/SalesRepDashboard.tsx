import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  Store,
  TrendingUp,
  Search,
  DollarSign,
  ShoppingCart,
  MapPin,
} from 'lucide-react';
import { salesReps, wholesalers, distributors } from '@/data/sales-hierarchy';

// Mock current sales rep (in production from auth)
const currentRep = salesReps[0];
const assignedWholesalers = wholesalers.filter(w => currentRep.assignedWholesalerIds.includes(w.id));
const assignedDistributors = distributors.filter(d => currentRep.assignedDistributorIds.includes(d.id));

// Mock activity data
const recentActivity = [
  { id: 1, account: 'Psychedelic Wellness Center', type: 'order', amount: '$1,250', date: '2 days ago' },
  { id: 2, account: 'West Coast Distribution', type: 'order', amount: '$3,500', date: '3 days ago' },
  { id: 3, account: 'Mindful Journeys', type: 'new_account', date: '1 week ago' },
];

export function SalesRepDashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  const allAccounts = [...assignedWholesalers, ...assignedDistributors];
  const filteredAccounts = allAccounts.filter(
    a => 
      a.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0514]">
      {/* Mobile Header */}
      <header className="lg:hidden bg-[#150f24] border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1">
            <span className="text-[#44f80c] font-bold">micro</span>
            <span className="text-[#9a02d0] font-bold">DOS</span>
            <span className="text-[#ff66c4] font-bold">(2)</span>
          </Link>
          <span className="text-gray-400 text-sm">Sales Rep</span>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 bg-[#150f24] border-r border-white/10 min-h-screen">
          <div className="p-6 border-b border-white/10">
            <Link to="/" className="flex items-center gap-1">
              <span className="text-[#44f80c] font-bold text-xl">micro</span>
              <span className="text-[#9a02d0] font-bold text-xl">DOS</span>
              <span className="text-[#ff66c4] font-bold text-xl">(2)</span>
            </Link>
            <p className="text-gray-400 text-sm mt-1">Sales Rep Portal</p>
          </div>
          <nav className="p-4">
            <Link
              to="/sales-rep-dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-[#9a02d0]/20 to-[#44f80c]/20 text-white border border-white/10"
            >
              <TrendingUp className="w-5 h-5 text-[#44f80c]" />
              <span>Dashboard</span>
            </Link>
          </nav>
          <div className="p-4 border-t border-white/10 mt-auto">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"
            >
              <span>Logout</span>
            </Link>
          </div>
        </aside>

        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">Sales Rep Dashboard</h1>
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>West Coast Region</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-white font-medium">{currentRep.name}</p>
                  <p className="text-gray-400 text-sm">{currentRep.email}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-[#9a02d0] to-[#44f80c] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {currentRep.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="bg-[#150f24] border-white/10">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Wholesalers</p>
                      <p className="text-2xl font-bold text-white">{assignedWholesalers.length}</p>
                    </div>
                    <Store className="w-6 h-6 text-[#9a02d0]" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-[#150f24] border-white/10">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Distributors</p>
                      <p className="text-2xl font-bold text-white">{assignedDistributors.length}</p>
                    </div>
                    <Store className="w-6 h-6 text-[#44f80c]" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-[#150f24] border-white/10">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Accounts</p>
                      <p className="text-2xl font-bold text-white">{allAccounts.length}</p>
                    </div>
                    <Users className="w-6 h-6 text-[#ff66c4]" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-[#150f24] border-white/10">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Monthly Volume</p>
                      <p className="text-2xl font-bold text-white">$12.5k</p>
                    </div>
                    <DollarSign className="w-6 h-6 text-[#9a02d0]" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search your accounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#150f24] border-white/10 text-white"
              />
            </div>

            {/* Accounts Table */}
            <Card className="bg-[#150f24] border-white/10 mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Store className="w-5 h-5 text-[#9a02d0]" />
                  Your Assigned Accounts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead className="text-gray-400">Business</TableHead>
                        <TableHead className="text-gray-400">Type</TableHead>
                        <TableHead className="text-gray-400">Location</TableHead>
                        <TableHead className="text-gray-400">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAccounts.map((account) => (
                        <TableRow key={account.id} className="border-white/10 hover:bg-white/5">
                          <TableCell>
                            <div>
                              <p className="text-white font-medium">{account.businessName}</p>
                              <p className="text-gray-500 text-sm">{account.contactName}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              'distributor' in account
                                ? 'bg-[#9a02d0]/20 text-[#9a02d0] border-[#9a02d0]/30'
                                : 'bg-[#44f80c]/20 text-[#44f80c] border-[#44f80c]/30'
                            }>
                              {'distributor' in account ? 'Distributor' : 'Wholesaler'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {account.city}, {account.state}
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              account.status === 'approved'
                                ? 'bg-green-500/20 text-green-500'
                                : 'bg-yellow-500/20 text-yellow-500'
                            }>
                              {account.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {filteredAccounts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No accounts found matching your search
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-[#150f24] border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#9a02d0]" />
                  Recent Activity from Your Accounts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-[#0a0514] rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'order' ? 'bg-[#44f80c]/20' : 'bg-[#9a02d0]/20'
                      }`}>
                        {activity.type === 'order' ? (
                          <ShoppingCart className="w-4 h-4 text-[#44f80c]" />
                        ) : (
                          <Store className="w-4 h-4 text-[#9a02d0]" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm">{activity.account}</p>
                        {activity.amount && (
                          <p className="text-[#44f80c] text-sm">{activity.amount}</p>
                        )}
                        <p className="text-gray-500 text-xs">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
