import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import {
  Search, Download, CheckCircle, Truck, FileText, ShoppingCart,
  Loader2, Building2,
  Phone, Mail, MapPin, User
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface FulfillmentOrder {
  id: string
  po_number: string
  user_id: string
  items: number
  total: number
  status: string
  notes: string | null
  created_at: string
  shipping_address: string | null
  contact_person: string | null
  contact_phone: string | null
  payment_method: string | null
  payment_reference: string | null
  forwarded_to_fulfillment_at: string | null
  fulfilled_at: string | null
  // joined fields
  profiles?: { business_name: string; email: string; phone: string }
  invoices?: { id: string; invoice_number: string; amount: number; status: string; due_date: string }[]
}

interface FulfillmentInvoice {
  id: string
  invoice_number: string
  order_id: string
  user_id: string
  amount: number
  status: string
  date: string
  due_date: string
  paid_date: string | null
  paid_method: string | null
  paid_reference: string | null
  // joined
  profiles?: { business_name: string; email: string; phone: string }
  orders?: { po_number: string; shipping_address: string; contact_person: string; contact_phone: string }
}

export function FulfillmentPage() {
  const [view, setView] = useState<'orders' | 'invoices'>('orders')
  const [orders, setOrders] = useState<FulfillmentOrder[]>([])
  const [invoices, setInvoices] = useState<FulfillmentInvoice[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    const [{ data: o, error: oErr }, { data: i, error: iErr }] = await Promise.all([
      supabase.from('orders')
        .select(`
          *,
          profiles:user_id (business_name, email, phone),
          invoices(id, invoice_number, amount, status, due_date)
        `)
        .order('created_at', { ascending: false })
        .limit(100),
      supabase.from('invoices')
        .select(`
          *,
          profiles:user_id (business_name, email, phone),
          orders:order_id (po_number, shipping_address, contact_person, contact_phone)
        `)
        .order('created_at', { ascending: false })
        .limit(100),
    ])
    if (oErr) console.error('[Fulfillment] orders error:', oErr)
    if (iErr) console.error('[Fulfillment] invoices error:', iErr)
    setOrders((o as any) || [])
    setInvoices((i as any) || [])
    setLoading(false)
  }

  const markPaid = async (invoiceId: string, orderId: string, method: 'check' | 'cash' | 'wire') => {
    setProcessingId(invoiceId)
    const now = new Date().toISOString()
    const [{ error: invErr }, { error: ordErr }] = await Promise.all([
      supabase.from('invoices').update({
        status: 'paid',
        paid_date: now.split('T')[0],
        paid_method: method,
        paid_reference: `Manual: ${method}`,
      }).eq('id', invoiceId),
      supabase.from('orders').update({ status: 'paid' }).eq('id', orderId),
    ])
    setProcessingId(null)
    if (invErr || ordErr) {
      toast.error('Failed to mark paid: ' + ((invErr || ordErr)?.message || ''))
    } else {
      toast.success('Marked as paid! Ready for fulfillment.')
      fetchData()
    }
  }

  const forwardToFulfillment = async (orderId: string) => {
    setProcessingId(orderId)
    const { error } = await supabase.from('orders').update({
      status: 'processing',
      forwarded_to_fulfillment_at: new Date().toISOString(),
    }).eq('id', orderId)
    setProcessingId(null)
    if (error) toast.error('Failed to forward: ' + error.message)
    else {
      toast.success('Forwarded to fulfillment/shipping department!')
      fetchData()
    }
  }

  const filteredOrders = orders.filter(o => {
    const s = search.toLowerCase()
    return (
      o.po_number?.toLowerCase().includes(s) ||
      o.profiles?.business_name?.toLowerCase().includes(s) ||
      o.profiles?.email?.toLowerCase().includes(s)
    )
  })

  const filteredInvoices = invoices.filter(i => {
    const s = search.toLowerCase()
    return (
      i.invoice_number?.toLowerCase().includes(s) ||
      i.profiles?.business_name?.toLowerCase().includes(s) ||
      i.orders?.po_number?.toLowerCase().includes(s)
    )
  })

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      delivered: 'bg-green-500/10 text-green-400 border-green-500/20',
      overdue: 'bg-red-500/10 text-red-400 border-red-500/20',
      cancelled: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    }
    return map[status] || 'bg-gray-500/10 text-gray-400'
  }

  return (
    <div className="space-y-6">
      {/* Header + Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex bg-[#150f24] rounded-lg p-1 border border-white/10">
          <button
            onClick={() => setView('orders')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
              view === 'orders'
                ? 'bg-[#9a02d0]/20 text-white'
                : 'text-gray-400 hover:text-white'
            )}
          >
            <ShoppingCart className="w-4 h-4" />
            Purchase Orders
            <span className="ml-1 text-xs bg-[#9a02d0]/30 px-2 py-0.5 rounded-full">
              {orders.filter(o => o.status === 'pending' || o.status === 'paid').length}
            </span>
          </button>
          <button
            onClick={() => setView('invoices')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
              view === 'invoices'
                ? 'bg-[#9a02d0]/20 text-white'
                : 'text-gray-400 hover:text-white'
            )}
          >
            <FileText className="w-4 h-4" />
            Invoices
            <span className="ml-1 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
              {invoices.filter(i => i.status === 'pending').length}
            </span>
          </button>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder={view === 'orders' ? 'Search PO or business...' : 'Search invoice or business...'}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-[#150f24] border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9a02d0]/50"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0514] hover:bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#9a02d0] animate-spin" />
        </div>
      ) : view === 'orders' ? (
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-600" />
              <p>No orders found</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onMarkPaid={(invId, method) => {
                  const invoice = order.invoices?.[0]
                  if (invoice) markPaid(invId, order.id, method)
                }}
                onForward={() => forwardToFulfillment(order.id)}
                processingId={processingId}
                getStatusBadge={getStatusBadge}
              />
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-600" />
              <p>No invoices found</p>
            </div>
          ) : (
            filteredInvoices.map(invoice => (
              <InvoiceCard
                key={invoice.id}
                invoice={invoice}
                onMarkPaid={(method) => markPaid(invoice.id, invoice.order_id, method)}
                processingId={processingId}
                getStatusBadge={getStatusBadge}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ─── Order Card ─────────────────────────────────────────────────

function OrderCard({
  order,
  onMarkPaid,
  onForward,
  processingId,
  getStatusBadge,
}: {
  order: FulfillmentOrder
  onMarkPaid: (invId: string, method: 'check' | 'cash' | 'wire') => void
  onForward: () => void
  processingId: string | null
  getStatusBadge: (s: string) => string
}) {
  const invoice = order.invoices?.[0]
  const isProcessing = processingId === order.id || processingId === invoice?.id

  return (
    <div className="bg-[#150f24] border border-white/10 rounded-xl p-5 space-y-4">
      {/* Top Row */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#44f80c]/10 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-[#44f80c]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-gray-300">{order.po_number}</span>
              <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium border', getStatusBadge(order.status))}>
                {order.status}
              </span>
            </div>
            <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-white">{formatCurrency(order.total)}</p>
          <p className="text-xs text-gray-500">{order.items} items</p>
        </div>
      </div>

      {/* Business Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
        <div className="flex items-start gap-2">
          <Building2 className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-gray-400">Business</p>
            <p className="text-white font-medium">{order.profiles?.business_name || 'Unknown'}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Mail className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-gray-400">Email</p>
            <p className="text-white">{order.profiles?.email || 'N/A'}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <User className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-gray-400">Contact</p>
            <p className="text-white">{order.contact_person || 'N/A'}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Phone className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-gray-400">Phone</p>
            <p className="text-white">{order.contact_phone || order.profiles?.phone || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      {order.shipping_address && (
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-gray-400">Shipping Address</p>
            <p className="text-white">{order.shipping_address}</p>
          </div>
        </div>
      )}

      {/* Notes */}
      {order.notes && (
        <div className="text-sm text-gray-400 bg-[#0a0514] rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Order Details:</p>
          <p className="text-white">{order.notes}</p>
        </div>
      )}

      {/* Invoice Summary */}
      {invoice && (
        <div className="flex items-center gap-3 text-sm bg-[#0a0514] rounded-lg p-3">
          <FileText className="w-4 h-4 text-[#9a02d0]" />
          <div className="flex-1">
            <p className="text-gray-400">
              Invoice <span className="font-mono text-gray-300">{invoice.invoice_number}</span>
              {' — '}
              <span className={cn('text-xs px-2 py-0.5 rounded-full border', getStatusBadge(invoice.status))}>
                {invoice.status}
              </span>
            </p>
          </div>
          <p className="text-white font-medium">{formatCurrency(invoice.amount)}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
        {invoice?.status === 'pending' && (
          <>
            <button
              onClick={() => onMarkPaid(invoice.id, 'check')}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Mark as Paid (Check)
            </button>
            <button
              onClick={() => onMarkPaid(invoice.id, 'wire')}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Mark as Paid (Wire)
            </button>
          </>
        )}
        {order.status === 'paid' && !order.forwarded_to_fulfillment_at && (
          <button
            onClick={onForward}
            disabled={isProcessing}
            className="flex items-center gap-2 px-4 py-2 bg-[#9a02d0]/10 hover:bg-[#9a02d0]/20 text-[#9a02d0] rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
            Forward to Fulfillment
          </button>
        )}
        {order.forwarded_to_fulfillment_at && (
          <span className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg text-sm">
            <Truck className="w-4 h-4" />
            Forwarded {new Date(order.forwarded_to_fulfillment_at).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Invoice Card ─────────────────────────────────────────────────

function InvoiceCard({
  invoice,
  onMarkPaid,
  processingId,
  getStatusBadge,
}: {
  invoice: FulfillmentInvoice
  onMarkPaid: (method: 'check' | 'cash' | 'wire') => void
  processingId: string | null
  getStatusBadge: (s: string) => string
}) {
  const isProcessing = processingId === invoice.id

  return (
    <div className="bg-[#150f24] border border-white/10 rounded-xl p-5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#9a02d0]/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-[#9a02d0]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-gray-300">{invoice.invoice_number}</span>
              <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium border', getStatusBadge(invoice.status))}>
                {invoice.status}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              PO: {invoice.orders?.po_number || 'N/A'} · Due: {invoice.due_date}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-white">{formatCurrency(invoice.amount)}</p>
          <p className="text-xs text-gray-500">{invoice.date}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
        <div className="flex items-start gap-2">
          <Building2 className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-gray-400">Business</p>
            <p className="text-white font-medium">{invoice.profiles?.business_name || 'Unknown'}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Mail className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-gray-400">Email</p>
            <p className="text-white">{invoice.profiles?.email || 'N/A'}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <User className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-gray-400">Contact</p>
            <p className="text-white">{invoice.orders?.contact_person || 'N/A'}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Phone className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-gray-400">Phone</p>
            <p className="text-white">{invoice.orders?.contact_phone || invoice.profiles?.phone || 'N/A'}</p>
          </div>
        </div>
      </div>

      {invoice.orders?.shipping_address && (
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-gray-400">Shipping Address</p>
            <p className="text-white">{invoice.orders.shipping_address}</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
        {invoice.status === 'pending' && (
          <>
            <button
              onClick={() => onMarkPaid('check')}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Mark Paid (Check)
            </button>
            <button
              onClick={() => onMarkPaid('cash')}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Mark Paid (Cash)
            </button>
            <button
              onClick={() => onMarkPaid('wire')}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Mark Paid (Wire)
            </button>
          </>
        )}
        {invoice.status === 'paid' && (
          <span className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm">
            <CheckCircle className="w-4 h-4" />
            Paid {invoice.paid_date} ({invoice.paid_method})
          </span>
        )}
      </div>
    </div>
  )
}
