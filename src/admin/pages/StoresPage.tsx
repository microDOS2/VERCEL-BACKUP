import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { downloadCSV } from '@/lib/utils'
import { Search, Download, Plus, Pencil, Trash2, X, ChevronLeft, ChevronRight, Store } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StoreItem {
  id: string
  name: string
  owner_id: string
  address: string | null
  phone: string | null
  email: string | null
  status: string
  created_at: string
  profiles?: { full_name: string; email: string }
}

export function StoresPage() {
  const [stores, setStores] = useState<StoreItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [editingStore, setEditingStore] = useState<StoreItem | null>(null)
  const [users, setUsers] = useState<any[]>([])
  const [formData, setFormData] = useState({ name: '', owner_id: '', address: '', phone: '', email: '', status: 'active' })
  const pageSize = 10

  useEffect(() => { fetchStores(); fetchUsers() }, [page, search])

  const fetchUsers = async () => {
    const { data } = await supabase.from('profiles').select('id, full_name, email')
    setUsers(data || [])
  }

  const fetchStores = async () => {
    setLoading(true)
    let query = supabase.from('stores').select('*, profiles(full_name, email)', { count: 'exact' }).order('created_at', { ascending: false }).range(page * pageSize, (page + 1) * pageSize - 1)
    if (search) query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%`)
    const { data, count, error } = await query
    if (error) console.error(error)
    else { setStores((data as any) || []); setTotalCount(count || 0) }
    setLoading(false)
  }

  const handleSave = async () => {
    if (editingStore) {
      const { error } = await supabase.from('stores').update(formData).eq('id', editingStore.id)
      if (error) alert('Error: ' + error.message)
    } else {
      const { error } = await supabase.from('stores').insert([formData])
      if (error) alert('Error: ' + error.message)
    }
    setShowModal(false); setEditingStore(null); resetForm(); fetchStores()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this store?')) return
    const { error } = await supabase.from('stores').delete().eq('id', id)
    if (error) alert('Error: ' + error.message)
    else fetchStores()
  }

  const openEdit = (s: StoreItem) => {
    setEditingStore(s)
    setFormData({ name: s.name, owner_id: s.owner_id, address: s.address || '', phone: s.phone || '', email: s.email || '', status: s.status })
    setShowModal(true)
  }

  const resetForm = () => setFormData({ name: '', owner_id: '', address: '', phone: '', email: '', status: 'active' })

  const exportCSV = () => {
    downloadCSV('stores', ['ID', 'Name', 'Owner', 'Address', 'Phone', 'Email', 'Status', 'Created'],
      stores.map(s => [s.id, s.name, s.profiles?.full_name || s.owner_id, s.address || '', s.phone || '', s.email || '', s.status, s.created_at]))
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" placeholder="Search stores..." value={search} onChange={e => { setSearch(e.target.value); setPage(0) }}
            className="w-full pl-10 pr-4 py-2.5 bg-[#150f24] border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9a02d0]/50" />
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0514] hover:bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => { setEditingStore(null); resetForm(); setShowModal(true) }} className="flex items-center gap-2 px-4 py-2.5 bg-[#9a02d0] hover:bg-[#9a02d0] rounded-lg text-sm text-white transition-colors">
            <Plus className="w-4 h-4" /> Add Store
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-12 text-gray-500">Loading...</div>
        ) : stores.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">No stores found</div>
        ) : stores.map(s => (
          <div key={s.id} className="bg-[#150f24] border border-white/10 rounded-xl p-5 hover:border-white/10 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-[#9a02d0]/10 rounded-lg">
                <Store className="w-5 h-5 text-[#44f80c]" />
              </div>
              <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', s.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400')}>{s.status}</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">{s.name}</h3>
            <p className="text-sm text-gray-400 mb-3">Owner: {s.profiles?.full_name || 'Unknown'}</p>
            <div className="space-y-1 text-sm text-gray-500 mb-4">
              {s.address && <p>{s.address}</p>}
              {s.phone && <p>{s.phone}</p>}
              {s.email && <p>{s.email}</p>}
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button onClick={() => openEdit(s)} className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-[#44f80c]"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(s.id)} className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {totalCount > pageSize && (
        <div className="flex items-center justify-between bg-[#150f24] border border-white/10 rounded-xl px-4 py-3">
          <span className="text-sm text-gray-500">{totalCount} total</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="p-2 hover:bg-white/5 rounded-lg disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-sm text-gray-400">Page {page + 1} of {totalPages || 1}</span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="p-2 hover:bg-white/5 rounded-lg disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#150f24] border border-white/10 rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">{editingStore ? 'Edit Store' : 'Add Store'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-white/5 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Store Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2.5 bg-[#0a0514] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#9a02d0]/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Owner</label>
                <select value={formData.owner_id} onChange={e => setFormData({...formData, owner_id: e.target.value})} className="w-full px-3 py-2.5 bg-[#0a0514] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#9a02d0]/50">
                  <option value="">Select owner...</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.full_name || u.email}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Address</label>
                <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} rows={2} className="w-full px-3 py-2.5 bg-[#0a0514] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#9a02d0]/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Phone</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2.5 bg-[#0a0514] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#9a02d0]/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2.5 bg-[#0a0514] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#9a02d0]/50" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2.5 bg-[#0a0514] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#9a02d0]/50">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-white/10">
              <button onClick={() => setShowModal(false)} className="px-4 py-2.5 bg-[#0a0514] hover:bg-white/5 rounded-lg text-sm text-gray-300">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2.5 bg-[#9a02d0] hover:bg-[#9a02d0] rounded-lg text-sm text-white">{editingStore ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
