import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Store, Check, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
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

export function ApplicationsPage() {
  const [pendingUsers, setPendingUsers] = useState<DBUser[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchPending = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Failed to fetch applications: ' + error.message)
    } else {
      setPendingUsers((data || []) as DBUser[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPending()
  }, [])

  const handleApprove = async (userId: string) => {
    setActionLoading(userId + '-approve')
    const { error } = await supabase.from('users').update({ status: 'approved' }).eq('id', userId)
    if (error) {
      toast.error('Failed to approve: ' + error.message)
    } else {
      toast.success('User approved successfully')
      await fetchPending()
    }
    setActionLoading(null)
  }

  const handleReject = async (userId: string) => {
    setActionLoading(userId + '-reject')
    const { error } = await supabase.from('users').update({ status: 'rejected' }).eq('id', userId)
    if (error) {
      toast.error('Failed to reject: ' + error.message)
    } else {
      toast.success('User rejected')
      await fetchPending()
    }
    setActionLoading(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Pending Applications</h2>
        <p className="text-gray-400">Review and approve pending account applications</p>
      </div>

      <Card className="bg-[#150f24] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Store className="w-5 h-5 text-[#9a02d0]" />
            Applications ({pendingUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-[#9a02d0]" />
            </div>
          ) : pendingUsers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Store className="w-12 h-12 mx-auto mb-3 text-gray-600" />
              <p className="text-lg font-medium text-gray-400">No pending applications</p>
              <p className="text-sm">All applications have been reviewed</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingUsers.map((app) => (
                <div
                  key={app.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#0a0514] rounded-lg border border-white/10"
                >
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{app.business_name || '—'}</h4>
                    <p className="text-gray-400 text-sm">{app.email} • {app.phone || 'No phone'}</p>
                    <p className="text-gray-500 text-sm">
                      {app.address || ''}
                      {app.city && app.state ? `${app.city}, ${app.state} ${app.zip || ''}` : ''}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge className={roleBadgeClasses[app.role] || 'bg-gray-500/20 text-gray-400'}>
                        {roleLabels[app.role] || app.role}
                      </Badge>
                      {app.license_number && (
                        <Badge className="bg-[#9a02d0]/20 text-[#9a02d0]">
                          License: {app.license_number}
                        </Badge>
                      )}
                      {app.ein && (
                        <Badge className="bg-gray-700 text-gray-400">
                          EIN: {app.ein}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(app.id)}
                      disabled={actionLoading === app.id + '-approve'}
                      className="bg-[#44f80c]/20 text-[#44f80c] hover:bg-[#44f80c]/30"
                    >
                      {actionLoading === app.id + '-approve' ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <Check className="w-3 h-3 mr-1" />
                      )}
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(app.id)}
                      disabled={actionLoading === app.id + '-reject'}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      {actionLoading === app.id + '-reject' ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <X className="w-3 h-3 mr-1" />
                      )}
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
