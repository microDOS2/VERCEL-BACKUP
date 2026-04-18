import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { formatDate, downloadCSV } from '@/lib/utils'
import { Search, Download, Trash2, ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Approval {
  id: string
  type: string
  requester_id: string
  approver_id: string | null
  data: string | null
  status: string
  notes: string | null
  created_at: string
  requester?: { full_name: string; email: string }
  approver?: { full_name: string; email: string }
}

export function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10

  useEffect(() => { fetchApprovals() }, [page, search, filter])

  const fetchApprovals = async () => {
    setLoading(true)
    let query = supabase
      .from('approvals')
      .select('*, requester:profiles!approvals_requester_id_fkey(full_name, email), approver:profiles!approvals_approver_id_fkey(full_name, email)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1)

    if (search) query = query.or(`type.ilike.%${search}%,notes.ilike.%${search}%`)
    if (filter !== 'all') query = query.eq('status', filter)

    const { data, count, error } = await query
    if (error) console.error(error)
    else { setApprovals((data as any) || []); setTotalCount(count || 0) }
    setLoading(false)
  }

  const handleApprove = async (id: string) => {
    const { error } = await supabase.from('approvals').update({ status: 'approved', approver_id: 'current-user' }).eq('id', id)
    if (error) alert('Error: ' + error.message)
    else fetchApprovals()
  }

  const handleReject = async (id: string) => {
    const { error } = await supabase.from('approvals').update({ status: 'rejected' }).eq('id', id)
    if (error) alert('Error: ' + error.message)
    else fetchApprovals()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this approval request?')) return
    const { error } = await supabase.from('approvals').delete().eq('id', id)
    if (error) alert('Error: ' + error.message)
    else fetchApprovals()
  }

  const exportCSV = () => {
    downloadCSV('approvals', ['ID', 'Type', 'Requester', 'Status', 'Notes', 'Created'],
      approvals.map(a => [a.id, a.type, a.requester?.full_name || a.requester_id, a.status, a.notes || '', a.created_at]))
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" placeholder="Search approvals..." value={search} onChange={e => { setSearch(e.target.value); setPage(0) }}
            className="w-full pl-10 pr-4 py-2.5 bg-[#150f24] border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9a02d0]/50" />
        </div>
        <div className="flex gap-2">
          <select value={filter} onChange={e => { setFilter(e.target.value); setPage(0) }} className="px-3 py-2.5 bg-[#150f24] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#9a02d0]/50">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0514] hover:bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-[#150f24] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Requester</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Data</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Created</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">Loading...</td></tr>
              ) : approvals.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">No approvals found</td></tr>
              ) : approvals.map(a => (
                <tr key={a.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-white capitalize">{a.type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">{a.requester?.full_name || 'Unknown'}</td>
                  <td className="px-4 py-3 text-sm text-gray-400 max-w-[200px] truncate">{a.data || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5',
                      a.status === 'approved' ? 'bg-emerald-500/15 text-emerald-400' :
                      a.status === 'rejected' ? 'bg-red-500/15 text-red-400' :
                      'bg-amber-500/15 text-amber-400')}>
                      {a.status === 'approved' ? <CheckCircle className="w-3 h-3" /> : a.status === 'rejected' ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(a.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {a.status === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(a.id)} className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-emerald-400" title="Approve">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleReject(a.id)} className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-red-400" title="Reject">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button onClick={() => handleDelete(a.id)} className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
          <span className="text-sm text-gray-500">{totalCount} total</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="p-2 hover:bg-white/5 rounded-lg disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-sm text-gray-400">Page {page + 1} of {totalPages || 1}</span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="p-2 hover:bg-white/5 rounded-lg disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  )
}
