import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Store, Users, UserCog, Loader2 } from 'lucide-react'
import type { DBUser } from '@/lib/supabase'

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  sales_manager: 'Sales Manager',
  sales_rep: 'Sales Rep',
  wholesaler: 'Wholesaler',
  distributor: 'Distributor',
  influencer: 'Influencer',
  retailer: 'Retailer',
}

const roleBadgeClasses: Record<string, string> = {
  admin: 'bg-red-500/20 text-red-500',
  sales_manager: 'bg-purple-500/20 text-purple-500',
  sales_rep: 'bg-blue-500/20 text-blue-500',
  wholesaler: 'bg-[#44f80c]/20 text-[#44f80c]',
  distributor: 'bg-[#ff66c4]/20 text-[#ff66c4]',
  influencer: 'bg-orange-500/20 text-orange-500',
  retailer: 'bg-gray-500/20 text-gray-400',
}

export function AssignmentsPage() {
  const [users, setUsers] = useState<DBUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Users fetch error:', error)
    } else {
      setUsers((data || []) as DBUser[])
    }
    setLoading(false)
  }

  const wholesalers = users.filter((u) => u.role === 'wholesaler')
  const distributors = users.filter((u) => u.role === 'distributor')
  const salesManagers = users.filter((u) => u.role === 'sales_manager')
  const salesReps = users.filter((u) => u.role === 'sales_rep')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#9a02d0]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Assignment Management</h2>
        <p className="text-gray-400">Manage business accounts and sales team assignments</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#150f24] rounded-lg p-4 text-center border border-white/10">
          <p className="text-gray-400 text-sm">Total Business Accounts</p>
          <p className="text-2xl font-bold text-white">{wholesalers.length + distributors.length}</p>
        </div>
        <div className="bg-[#150f24] rounded-lg p-4 text-center border border-white/10">
          <p className="text-gray-400 text-sm">Sales Managers</p>
          <p className="text-2xl font-bold text-[#44f80c]">{salesManagers.length}</p>
        </div>
        <div className="bg-[#150f24] rounded-lg p-4 text-center border border-white/10">
          <p className="text-gray-400 text-sm">Sales Reps</p>
          <p className="text-2xl font-bold text-[#ff66c4]">{salesReps.length}</p>
        </div>
      </div>

      {/* Business Accounts */}
      <Card className="bg-[#150f24] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Store className="w-5 h-5 text-[#44f80c]" />
            Business Accounts ({wholesalers.length + distributors.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...wholesalers, ...distributors].length === 0 && (
            <div className="text-center py-4 text-gray-500">No business accounts yet</div>
          )}
          {[...wholesalers, ...distributors].map((w) => (
            <div
              key={w.id}
              className="flex items-center justify-between p-3 bg-[#0a0514] rounded-lg border border-white/10"
            >
              <div>
                <p className="text-white font-medium">{w.business_name || '—'}</p>
                <p className="text-gray-400 text-sm">
                  {w.city && w.state ? `${w.city}, ${w.state}` : '—'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={roleBadgeClasses[w.role]}>
                    {roleLabels[w.role]}
                  </Badge>
                  <Badge
                    className={
                      w.status === 'approved'
                        ? 'bg-green-500/20 text-green-500'
                        : 'bg-yellow-500/20 text-yellow-500'
                    }
                  >
                    {w.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sales Team Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-[#150f24] border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" />
              Sales Managers ({salesManagers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {salesManagers.length === 0 && (
              <div className="text-center py-4 text-gray-500">No sales managers yet</div>
            )}
            {salesManagers.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-3 bg-[#0a0514] rounded-lg border border-white/10"
              >
                <div>
                  <p className="text-white font-medium">{m.business_name || '—'}</p>
                  <p className="text-gray-400 text-sm">{m.email}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-[#150f24] border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <UserCog className="w-5 h-5 text-blue-500" />
              Sales Reps ({salesReps.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {salesReps.length === 0 && (
              <div className="text-center py-4 text-gray-500">No sales reps yet</div>
            )}
            {salesReps.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-3 bg-[#0a0514] rounded-lg border border-white/10"
              >
                <div>
                  <p className="text-white font-medium">{r.business_name || '—'}</p>
                  <p className="text-gray-400 text-sm">{r.email}</p>
                  {r.manager_id && (
                    <p className="text-gray-500 text-xs mt-0.5">
                      Reports to: {users.find(u => u.id === r.manager_id)?.business_name || r.manager_id}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
