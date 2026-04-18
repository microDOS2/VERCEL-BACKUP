import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { formatDate, downloadCSV } from '@/lib/utils'
import { Search, Download, ChevronLeft, ChevronRight, Activity, User, Settings, ShoppingCart, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AuditEntry {
  id: string
  action: string
  entity_type: string
  entity_id: string
  user_id: string | null
  details: string | null
  created_at: string
}

const actionIcons: Record<string, any> = {
  user: User,
  order: ShoppingCart,
  product: Settings,
  invoice: FileText,
  agreement: FileText,
  default: Activity
}

const actionColors: Record<string, string> = {
  order_created: 'text-emerald-400 bg-emerald-400/10',
  user_created: 'text-[#44f80c] bg-[#9a02d0]/10',
  user_updated: 'text-amber-400 bg-amber-400/10',
  user_deleted: 'text-red-400 bg-red-400/10',
  default: 'text-gray-400 bg-gray-400/10'
}

export function AuditLogPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [filter, setFilter] = useState('all')
  const pageSize = 15

  useEffect(() => { fetchEntries() }, [page, search, filter])

  const fetchEntries = async () => {
    setLoading(true)
    let query = supabase
      .from('audit_log')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1)

    if (search) query = query.or(`action.ilike.%${search}%,details.ilike.%${search}%,entity_type.ilike.%${search}%`)
    if (filter !== 'all') query = query.eq('entity_type', filter)

    const { data, count, error } = await query
    if (error) console.error(error)
    else { setEntries(data || []); setTotalCount(count || 0) }
    setLoading(false)
  }

  const exportCSV = () => {
    downloadCSV('audit-log', ['ID', 'Action', 'Entity Type', 'Entity ID', 'Details', 'Created'],
      entries.map(e => [e.id, e.action, e.entity_type, e.entity_id, e.details || '', e.created_at]))
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" placeholder="Search audit log..." value={search} onChange={e => { setSearch(e.target.value); setPage(0) }}
            className="w-full pl-10 pr-4 py-2.5 bg-[#150f24] border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9a02d0]/50" />
        </div>
        <div className="flex gap-2">
          <select value={filter} onChange={e => { setFilter(e.target.value); setPage(0) }} className="px-3 py-2.5 bg-[#150f24] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#9a02d0]/50">
            <option value="all">All Entities</option>
            <option value="user">Users</option>
            <option value="order">Orders</option>
            <option value="product">Products</option>
            <option value="invoice">Invoices</option>
            <option value="agreement">Agreements</option>
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Action</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Entity</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Details</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr><td colSpan={4} className="px-4 py-12 text-center text-gray-500">Loading...</td></tr>
              ) : entries.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-12 text-center text-gray-500">No audit entries found</td></tr>
              ) : entries.map(entry => {
                const Icon = actionIcons[entry.entity_type] || actionIcons.default
                const colorClass = actionColors[entry.action] || actionColors.default
                return (
                  <tr key={entry.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={cn('p-2 rounded-lg', colorClass)}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white capitalize">{entry.action.replace(/_/g, ' ')}</div>
                          <div className="text-xs text-gray-500 font-mono">{entry.entity_id.slice(0, 12)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#0a0514] text-gray-400 capitalize">
                        {entry.entity_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400 max-w-[300px] truncate">{entry.details || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{formatDate(entry.created_at)}</td>
                  </tr>
                )
              })}
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
