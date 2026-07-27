import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../lib/convex-auth';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { FileText, Search, Loader2 } from 'lucide-react';

const TYPE_COLORS: Record<string, string> = {
  ticket_sale: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
  voting_revenue: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  award_entry: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
  withdrawal: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  refund: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
  platform_fee: 'bg-gold-500/10 text-gold-400 border border-gold-500/20',
  payout: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
};

const STATUS_COLORS: Record<string, string> = {
  completed: 'bg-emerald-500/10 text-emerald-400',
  pending: 'bg-amber-500/10 text-amber-400',
  failed: 'bg-rose-500/10 text-rose-400',
  cancelled: 'bg-dark-500 text-dark-400',
};

export function AdminTransactions() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const transactions = useQuery(
    api.admin.queries.getAllTransactions,
    user?.id ? { firebaseUid: user.id, status: statusFilter } : 'skip'
  );

  if (!transactions) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 text-gold-500 animate-spin" /></div>;
  }

  const filtered = transactions.filter((t: any) =>
    t.description.toLowerCase().includes(search.toLowerCase()) ||
    t.orgName.toLowerCase().includes(search.toLowerCase()) ||
    t.reference?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-white tracking-tight">Transactions</h1>
        <p className="text-dark-400 text-sm mt-1">Every payment across the platform</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-80">
          <Input placeholder="Search transactions..." icon={Search} value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 text-xs" />
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'completed', 'pending', 'failed', 'cancelled'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === s ? 'bg-gold-500 text-dark-950' : 'bg-white/5 text-dark-400 hover:text-white'}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-dark-500 uppercase tracking-[0.2em] border-b border-white/5">
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Organization</th>
                <th className="px-6 py-4">Event</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((tx: any) => (
                <tr key={tx._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${TYPE_COLORS[tx.type] || 'bg-dark-800 text-dark-400'}`}>
                      {tx.type.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-white">{tx.orgName}</td>
                  <td className="px-6 py-4 text-xs text-dark-400">{tx.eventTitle || '-'}</td>
                  <td className="px-6 py-4 text-sm text-white font-medium">₦{tx.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${STATUS_COLORS[tx.status] || ''}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-dark-500 font-mono">{tx.reference || '-'}</td>
                  <td className="px-6 py-4 text-xs text-dark-500">{new Date(tx.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-dark-500 text-sm">No transactions found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
