import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { formatDate, formatCurrency, downloadCSV } from '@/lib/utils'
import { Search, Download, Trash2, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Invoice {
  id: string
  order_id: string
  user_id: string
  amount: number
  status: string
  due_date: string
  paid_at: string | null
  created_at: string
  profiles?: { full_name: string; email: string }
}

export function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10

  useEffect(() => { fetchInvoices() }, [page, search])

  const fetchInvoices = async () => {
    setLoading(true)
    let query = supabase
      .from('invoices')
      .select('*, profiles(full_name, email)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1)

    if (search) query = query.or(`status.ilike.%${search}%`)

    const { data, count, error } = await query
    if (error) console.error(error)
    else { setInvoices((data as any) || []); setTotalCount(count || 0) }
    setLoading(false)
  }

  const markPaid = async (id: string) => {
    const { error } = await supabase.from('invoices').update({
      status: 'paid',
      paid_at: new Date().toISOString()
    }).eq('id', id)
    if (error) alert('Error: ' + error.message)
    else fetchInvoices()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this invoice?')) return
    const { error } = await supabase.from('invoices').delete().eq('id', id)
    if (error) alert('Error: ' + error.message)
    else fetchInvoices()
  }

  const exportCSV = () => {
    downloadCSV('invoices', ['ID', 'Order ID', 'Customer', 'Amount', 'Status', 'Due Date', 'Paid At', 'Created'],
      invoices.map(i => [i.id, i.order_id, i.profiles?.full_name || i.user_id, String(i.amount), i.status, i.due_date, i.paid_at || '', i.created_at]))
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" placeholder="Search invoices..." value={search} onChange={e => { setSearch(e.target.value); setPage(0) }}
            className="w-full pl-10 pr-4 py-2.5 bg-[#150f24] border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9a02d0]/50" />
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0514] hover:bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-[#150f24] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Invoice</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Due Date</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">Loading...</td></tr>
              ) : invoices.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">No invoices found</td></tr>
              ) : invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="text-sm font-mono text-gray-300">#{inv.id.slice(0, 8)}</div>
                    <div className="text-xs text-gray-500">Order #{inv.order_id.slice(0, 8)}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">{inv.profiles?.full_name || 'Unknown'}</td>
                  <td className="px-4 py-3 text-sm font-medium text-white">{formatCurrency(inv.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium',
                      inv.status === 'paid' ? 'bg-emerald-500/15 text-emerald-400' :
                      inv.status === 'overdue' ? 'bg-red-500/15 text-red-400' :
                      'bg-amber-500/15 text-amber-400')}>{inv.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-400">{inv.due_date}</div>
                    {inv.paid_at && <div className="text-xs text-emerald-500">Paid {formatDate(inv.paid_at)}</div>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {inv.status !== 'paid' && (
                        <button onClick={() => markPaid(inv.id)} className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-emerald-400" title="Mark as Paid">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => handleDelete(inv.id)} className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
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
