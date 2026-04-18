import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { downloadCSV } from '@/lib/utils'
import { Search, Download, Plus, Pencil, Trash2, X, ChevronLeft, ChevronRight, QrCode } from 'lucide-react'
import { cn } from '@/lib/utils'
import { QRCodeSVG } from 'qrcode.react'

interface Influencer {
  id: string
  full_name: string
  email: string
  phone: string | null
  social_handle: string | null
  platform: string | null
  followers: number | null
  status: string
  qr_code_url: string | null
  created_at: string
}

export function InfluencersPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null)
  const [editingInf, setEditingInf] = useState<Influencer | null>(null)
  const [formData, setFormData] = useState({
    full_name: '', email: '', phone: '', social_handle: '', platform: 'instagram', followers: 0, status: 'active'
  })
  const pageSize = 10

  useEffect(() => {
    fetchInfluencers()
  }, [page, search])

  const fetchInfluencers = async () => {
    setLoading(true)
    let query = supabase
      .from('influencers')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1)

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,social_handle.ilike.%${search}%`)
    }

    const { data, count, error } = await query
    if (error) console.error('Influencers fetch error:', error)
    else {
      setInfluencers(data || [])
      setTotalCount(count || 0)
    }
    setLoading(false)
  }

  const handleSave = async () => {
    const payload = {
      ...formData,
      followers: Number(formData.followers)
    }
    if (editingInf) {
      const { error } = await supabase.from('influencers').update(payload).eq('id', editingInf.id)
      if (error) alert('Error updating: ' + error.message)
    } else {
      const { error } = await supabase.from('influencers').insert([payload])
      if (error) alert('Error creating: ' + error.message)
    }
    setShowModal(false)
    setEditingInf(null)
    resetForm()
    fetchInfluencers()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this influencer?')) return
    const { error } = await supabase.from('influencers').delete().eq('id', id)
    if (error) alert('Error: ' + error.message)
    else fetchInfluencers()
  }

  const openEdit = (inf: Influencer) => {
    setEditingInf(inf)
    setFormData({
      full_name: inf.full_name,
      email: inf.email,
      phone: inf.phone || '',
      social_handle: inf.social_handle || '',
      platform: inf.platform || 'instagram',
      followers: inf.followers || 0,
      status: inf.status
    })
    setShowModal(true)
  }

  const openCreate = () => {
    setEditingInf(null)
    resetForm()
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({ full_name: '', email: '', phone: '', social_handle: '', platform: 'instagram', followers: 0, status: 'active' })
  }

  const showQR = (inf: Influencer) => {
    setSelectedInfluencer(inf)
    setShowQRModal(true)
  }

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Handle', 'Platform', 'Followers', 'Status', 'Created']
    const rows = influencers.map(i => [i.id, i.full_name, i.email, i.phone || '', i.social_handle || '', i.platform || '', String(i.followers || 0), i.status, i.created_at])
    downloadCSV('influencers', headers, rows)
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search influencers..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            className="w-full pl-10 pr-4 py-2.5 bg-[#150f24] border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9a02d0]/50"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0514] hover:bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[#9a02d0] hover:bg-[#9a02d0] rounded-lg text-sm text-white transition-colors">
            <Plus className="w-4 h-4" /> Add Influencer
          </button>
        </div>
      </div>

      <div className="bg-[#150f24] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Platform</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Followers</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">Loading...</td></tr>
              ) : influencers.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">No influencers found</td></tr>
              ) : (
                influencers.map((inf) => (
                  <tr key={inf.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                          {inf.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{inf.full_name}</div>
                          <div className="text-xs text-gray-500">@{inf.social_handle || 'no-handle'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{inf.email}<br/><span className="text-xs text-gray-600">{inf.phone || ''}</span></td>
                    <td className="px-4 py-3 text-sm text-gray-400 capitalize">{inf.platform || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{(inf.followers || 0).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'px-2.5 py-1 rounded-full text-xs font-medium',
                        inf.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' :
                        inf.status === 'pending' ? 'bg-amber-500/15 text-amber-400' :
                        'bg-red-500/15 text-red-400'
                      )}>
                        {inf.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => showQR(inf)} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-purple-400" title="Show QR Code">
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button onClick={() => openEdit(inf)} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-[#44f80c]">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(inf.id)} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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

      {/* Edit/Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#150f24] border border-white/10 rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">{editingInf ? 'Edit Influencer' : 'Add Influencer'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-white/5 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Full Name</label>
                  <input type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full px-3 py-2.5 bg-[#0a0514] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#9a02d0]/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2.5 bg-[#0a0514] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#9a02d0]/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Phone</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2.5 bg-[#0a0514] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#9a02d0]/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Social Handle</label>
                  <input type="text" value={formData.social_handle} onChange={e => setFormData({...formData, social_handle: e.target.value})} className="w-full px-3 py-2.5 bg-[#0a0514] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#9a02d0]/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Platform</label>
                  <select value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})} className="w-full px-3 py-2.5 bg-[#0a0514] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#9a02d0]/50">
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube</option>
                    <option value="twitter">Twitter</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Followers</label>
                  <input type="number" value={formData.followers} onChange={e => setFormData({...formData, followers: Number(e.target.value)})} className="w-full px-3 py-2.5 bg-[#0a0514] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#9a02d0]/50" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2.5 bg-[#0a0514] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#9a02d0]/50">
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-white/10">
              <button onClick={() => setShowModal(false)} className="px-4 py-2.5 bg-[#0a0514] hover:bg-white/5 rounded-lg text-sm text-gray-300">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2.5 bg-[#9a02d0] hover:bg-[#9a02d0] rounded-lg text-sm text-white">{editingInf ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && selectedInfluencer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#150f24] border border-white/10 rounded-xl w-full max-w-sm shadow-2xl p-6 text-center">
            <button onClick={() => setShowQRModal(false)} className="absolute top-4 right-4 p-1.5 hover:bg-white/5 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
            <h3 className="text-lg font-semibold text-white mb-1">{selectedInfluencer.full_name}</h3>
            <p className="text-sm text-gray-500 mb-6">@{selectedInfluencer.social_handle}</p>
            <div className="bg-white p-4 rounded-xl inline-block mb-4">
              <QRCodeSVG
                value={`https://for-microdos-2-u-site-vercel.vercel.app/ref/${selectedInfluencer.id}`}
                size={180}
                level="M"
                includeMargin={false}
              />
            </div>
            <p className="text-xs text-gray-500 mb-4">Scan to visit referral page</p>
            <button
              onClick={() => {
                const svg = document.querySelector('svg')
                if (svg) {
                  const canvas = document.createElement('canvas')
                  const ctx = canvas.getContext('2d')!
                  const img = new Image()
                  img.onload = () => {
                    canvas.width = 400
                    canvas.height = 400
                    ctx.fillStyle = 'white'
                    ctx.fillRect(0, 0, 400, 400)
                    ctx.drawImage(img, 20, 20, 360, 360)
                    const a = document.createElement('a')
                    a.download = `qr-${selectedInfluencer.full_name.replace(/\s+/g, '-').toLowerCase()}.png`
                    a.href = canvas.toDataURL('image/png')
                    a.click()
                  }
                  img.src = 'data:image/svg+xml;base64,' + btoa(new XMLSerializer().serializeToString(svg))
                }
              }}
              className="w-full px-4 py-2.5 bg-[#9a02d0] hover:bg-[#9a02d0] rounded-lg text-sm text-white transition-colors"
            >
              Download QR Code
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
