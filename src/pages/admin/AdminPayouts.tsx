import React from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../lib/convex-auth';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../lib/toast';
import { TrendingUp, Loader2, CheckCircle2, XCircle, Building2 } from 'lucide-react';

export function AdminPayouts() {
  const { user } = useAuth();
  const { toast } = useToast();

  const payouts = useQuery(
    api.admin.queries.getPendingPayouts,
    user?.id ? { firebaseUid: user.id } : 'skip'
  );

  const processPayout = useMutation(api.admin.mutations.processPayout);
  const rejectPayout = useMutation(api.admin.mutations.rejectPayout);

  if (!payouts) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 text-gold-500 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-white tracking-tight">Payouts</h1>
        <p className="text-dark-400 text-sm mt-1">Pending withdrawal requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2">Pending</p>
            <h3 className="text-2xl font-serif text-amber-400">{payouts.length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2">Total Pending Value</p>
            <h3 className="text-2xl font-serif text-white">₦{payouts.reduce((s: number, p: any) => s + p.amount, 0).toLocaleString()}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2">Organizations</p>
            <h3 className="text-2xl font-serif text-white">{new Set(payouts.map((p: any) => p.orgId)).size}</h3>
          </CardContent>
        </Card>
      </div>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-dark-500 uppercase tracking-[0.2em] border-b border-white/5">
                <th className="px-6 py-4">Organization</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Bank</th>
                <th className="px-6 py-4">Account</th>
                <th className="px-6 py-4">Requested</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payouts.map((payout: any) => (
                <tr key={payout._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-dark-800 rounded-lg flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-dark-400" />
                      </div>
                      <span className="text-sm text-white font-medium">{payout.orgName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-white font-medium">₦{payout.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-xs text-dark-300">{payout.bankName}</td>
                  <td className="px-6 py-4 text-xs text-dark-300 font-mono">{payout.accountNumber}</td>
                  <td className="px-6 py-4 text-xs text-dark-500">{new Date(payout.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost"
                        onClick={() => { if (confirm('Approve this payout?')) { processPayout({ firebaseUid: user?.id, transactionId: payout._id }); toast('Payout approved', 'success'); } }}
                        className="h-8 px-3 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-none text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="ghost"
                        onClick={() => { if (confirm('Reject this payout?')) { rejectPayout({ firebaseUid: user?.id, transactionId: payout._id }); toast('Payout rejected', 'success'); } }}
                        className="h-8 px-3 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border-none text-xs">
                        <XCircle className="h-3 w-3 mr-1" /> Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {payouts.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-dark-500 text-sm">No pending payouts</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
