import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Breadcrumbs } from '../../../components/ui/Breadcrumbs';
import { useAuth } from '../../../lib/convex-auth';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Search, ShoppingCart, CheckCircle, Clock, XCircle, RotateCcw } from 'lucide-react';
import { cn } from '../../../lib/utils';

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'successful', label: 'Successful' },
  { key: 'pending', label: 'Pending' },
  { key: 'refunded', label: 'Refunded' },
  { key: 'failed', label: 'Failed' },
] as const;

type FilterKey = typeof FILTER_TABS[number]['key'];

const statusStyles: Record<string, string> = {
  successful: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  failed: 'bg-red-500/10 text-red-400 border-red-500/20',
  refunded: 'bg-dark-800 text-dark-400 border-white/10',
};

const checkinStyles: Record<string, string> = {
  checked_in: 'bg-emerald-500/10 text-emerald-400',
  not_checked_in: 'bg-dark-800 text-dark-500',
};

const checkinLabels: Record<string, string> = {
  checked_in: 'Checked In',
  not_checked_in: 'Pending',
};

export function TicketOrders() {
  const { currentOrg } = useAuth();
  const [filter, setFilter] = useState<FilterKey>('all');
  const [search, setSearch] = useState('');

  const orders = useQuery(
    api.ticketing.mutations.getOrdersByOrg,
    currentOrg ? { orgId: currentOrg.id as any } : 'skip'
  ) ?? [];

  const filtered = useMemo(() => {
    let result = orders;
    if (filter !== 'all') {
      result = result.filter(o => o.paymentStatus === (filter as 'successful' | 'pending' | 'failed' | 'refunded'));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        o => o.orderId.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q)
      );
    }
    return result;
  }, [orders, filter, search]);

  return (
    <div className="space-y-8">
      <div>
        <Breadcrumbs />
        <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Orders</h1>
        <p className="text-dark-400">Track and manage all ticket orders.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-gold-500" /> All Orders ({filtered.length})
          </CardTitle>
          <div className="w-full md:w-72">
            <Input
              icon={Search}
              placeholder="Search by ID, name, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-1 p-1 bg-dark-900/50 border border-white/5 rounded-lg mb-6 overflow-x-auto">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={cn(
                  'px-4 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-all',
                  filter === tab.key
                    ? 'bg-gold-500 text-dark-950'
                    : 'text-dark-400 hover:text-white'
                )}
              >
                {tab.label}
                {tab.key !== 'all' && (
                  <span className="ml-1.5 opacity-60">
                    {orders.filter(o => o.paymentStatus === tab.key).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="h-12 w-12 text-dark-600 mx-auto mb-4" />
              <h3 className="text-lg font-serif text-white mb-2">No orders found</h3>
              <p className="text-sm text-dark-400">
                {search ? 'Try a different search term.' : 'Orders will appear here once tickets are purchased.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="pb-3 text-[10px] font-bold text-dark-500 uppercase tracking-widest">Order ID</th>
                    <th className="pb-3 text-[10px] font-bold text-dark-500 uppercase tracking-widest">Customer</th>
                    <th className="pb-3 text-[10px] font-bold text-dark-500 uppercase tracking-widest">Event</th>
                    <th className="pb-3 text-[10px] font-bold text-dark-500 uppercase tracking-widest">Ticket Type</th>
                    <th className="pb-3 text-[10px] font-bold text-dark-500 uppercase tracking-widest text-center">Qty</th>
                    <th className="pb-3 text-[10px] font-bold text-dark-500 uppercase tracking-widest text-right">Amount</th>
                    <th className="pb-3 text-[10px] font-bold text-dark-500 uppercase tracking-widest text-center">Payment</th>
                    <th className="pb-3 text-[10px] font-bold text-dark-500 uppercase tracking-widest text-center">Check-in</th>
                    <th className="pb-3 text-[10px] font-bold text-dark-500 uppercase tracking-widest">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => (
                    <tr key={order._id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="py-3">
                        <span className="text-xs font-mono text-gold-500">{order.orderId}</span>
                      </td>
                      <td className="py-3">
                        <div>
                          <p className="text-sm text-white">{order.customerName}</p>
                          <p className="text-[11px] text-dark-500">{order.customerEmail}</p>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-dark-300">{order.eventId}</td>
                      <td className="py-3 text-sm text-dark-300">{order.ticketTypeId}</td>
                      <td className="py-3 text-center text-sm text-white">{order.quantity}</td>
                      <td className="py-3 text-right text-sm text-white font-medium">₦{order.totalAmount.toLocaleString()}</td>
                      <td className="py-3 text-center">
                        <span className={cn('inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full border', statusStyles[order.paymentStatus] ?? '')}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className={cn('inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full', checkinStyles[order.checkinStatus] ?? '')}>
                          {checkinLabels[order.checkinStatus] ?? order.checkinStatus}
                        </span>
                      </td>
                      <td className="py-3 text-xs text-dark-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
