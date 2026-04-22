import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Users, Loader2, Check, UserPlus, Building2, UserMinus } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Account {
  id: string
  business_name: string
  email: string
  phone: string | null
  role: string
  city: string | null
  state: string | null
  account_number: string
  assigned_rep_id: string | null
  assigned_rep_name: string | null
}

interface SalesRep {
  id: string
  business_name: string | null
  email: string
  city: string | null
  state: string | null
}

const roleBadge: Record<string, string> = {
  wholesaler: 'bg-[#44f80c]/20 text-[#44f80c]',
  distributor: 'bg-[#ff66c4]/20 text-[#ff66c4]',
}

export function AssignmentsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [reps, setReps] = useState<SalesRep[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRep, setSelectedRep] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)

    // 1. Fetch approved business accounts
    const { data: usersData } = await supabase
      .from('users')
      .select('id, business_name, email, phone, role, city, state, referral_code')
      .eq('status', 'approved')
      .in('role', ['wholesaler', 'distributor'])
      .order('referral_code', { ascending: true })

    // 2. Fetch account-level assignments
    const { data: assignData } = await supabase
      .from('rep_account_assignments')
      .select('account_id, rep_id')

    // 3. Fetch sales reps
    const { data: repsData } = await supabase
      .from('users')
      .select('id, business_name, email, city, state')
      .eq('role', 'sales_rep')
      .eq('status', 'approved')

    // Build rep lookup
    const repMap = new Map()
    ;(repsData || []).forEach((r: any) => repMap.set(r.id, r))

    // Build assignment lookup
    const assignmentMap = new Map()
    ;(assignData || []).forEach((a: any) => assignmentMap.set(a.account_id, a.rep_id))

    // Build account items
    const accountItems: Account[] = (usersData || []).map((u: any) => {
      const repId = assignmentMap.get(u.id)
      const rep = repId ? repMap.get(repId) : null
      return {
        id: u.id,
        business_name: u.business_name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        city: u.city,
        state: u.state,
        account_number: u.referral_code || '',
        assigned_rep_id: repId || null,
        assigned_rep_name: rep ? (rep.business_name || rep.email) : null,
      }
    })

    setAccounts(accountItems)
    setReps((repsData || []).map((r: any) => ({
      id: r.id,
      business_name: r.business_name,
      email: r.email,
      city: r.city,
      state: r.state,
    })))
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleAssign = async (accountId: string) => {
    const repId = selectedRep[accountId]
    if (!repId) { toast.error('Select a Sales Rep first'); return }
    setSaving(accountId)

    // Delete existing, then insert new (upsert workaround)
    await supabase.from('rep_account_assignments').delete().eq('account_id', accountId)
    const { error } = await supabase.from('rep_account_assignments').insert([{ account_id: accountId, rep_id: repId }])

    if (error) toast.error('Failed: ' + error.message)
    else { toast.success('Rep assigned!'); fetchAll() }
    setSaving(null)
  }

  const handleUnassign = async (accountId: string) => {
    if (!confirm('Remove rep assignment?')) return
    const { error } = await supabase.from('rep_account_assignments').delete().eq('account_id', accountId)
    if (error) toast.error('Error: ' + error.message)
    else { toast.success('Unassigned'); fetchAll() }
  }

  const assignedCount = accounts.filter(a => a.assigned_rep_id).length
  const unassignedCount = accounts.filter(a => !a.assigned_rep_id).length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Account Assignments</h2>
        <p className="text-gray-400">Assign Sales Reps to business accounts</p>
      </div>

      <Card className="bg-[#150f24] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#9a02d0]" />
            Accounts ({accounts.length}) — {assignedCount} assigned, {unassignedCount} unassigned
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#9a02d0]" /></div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-600" />
              <p className="text-lg font-medium text-gray-400">No business accounts</p>
              <p className="text-sm">Approve applications first</p>
            </div>
          ) : reps.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <UserPlus className="w-12 h-12 mx-auto mb-3 text-gray-600" />
              <p className="text-lg font-medium text-gray-400">No Sales Reps</p>
              <p className="text-sm">Create Sales Rep accounts in User Management</p>
            </div>
          ) : (
            <div className="space-y-4">
              {accounts.map((acct) => (
                <div key={acct.id} className="p-4 bg-[#0a0514] rounded-lg border border-white/10">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-mono bg-[#9a02d0]/20 text-[#9a02d0] px-2 py-0.5 rounded">Acct #{acct.account_number}</span>
                        <h4 className="text-white font-medium">{acct.business_name}</h4>
                        <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full uppercase', roleBadge[acct.role] || 'bg-gray-500/20 text-gray-400')}>{acct.role}</span>
                      </div>
                      <p className="text-gray-400 text-sm">{acct.email}{acct.city && acct.state && ` • ${acct.city}, ${acct.state}`}</p>
                      {acct.phone && <p className="text-gray-500 text-xs mt-0.5">{acct.phone}</p>}

                      {acct.assigned_rep_name ? (
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className="bg-[#44f80c]/20 text-[#44f80c]">
                            <Users className="w-3 h-3 mr-1" /> Assigned to: {acct.assigned_rep_name}
                          </Badge>
                          <button onClick={() => handleUnassign(acct.id)} className="text-xs text-red-400 hover:text-red-300 underline flex items-center gap-0.5">
                            <UserMinus className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      ) : (
                        <Badge className="bg-gray-700 text-gray-400 mt-2">Unassigned</Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 w-full lg:w-auto">
                      <Select
                        value={selectedRep[acct.id] || acct.assigned_rep_id || ''}
                        onValueChange={(val) => setSelectedRep(prev => ({ ...prev, [acct.id]: val }))}
                      >
                        <SelectTrigger className="w-56 bg-[#0a0514] border-white/10 text-white text-sm">
                          <SelectValue placeholder="Select Rep" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#150f24] border-white/10">
                          {reps.map(rep => (
                            <SelectItem key={rep.id} value={rep.id}>
                              {rep.business_name || rep.email}
                              {rep.city && rep.state && ` — ${rep.city}, ${rep.state}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        onClick={() => handleAssign(acct.id)}
                        disabled={saving === acct.id}
                        className="bg-gradient-to-r from-[#9a02d0] to-[#44f80c] text-white"
                      >
                        {saving === acct.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                      </Button>
                    </div>
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
