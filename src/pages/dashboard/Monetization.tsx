import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  DollarSign, Wallet, TrendingUp, Calendar, CreditCard, Plus, Loader2,
  ArrowDownRight, ArrowUpRight, Clock, CheckCircle, XCircle, AlertTriangle,
  Building2, Trash2, Edit2, Info, Trophy, ExternalLink, ChevronRight,
} from 'lucide-react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { useToast } from '../../lib/toast';
import { useAuth } from '../../lib/convex-auth';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

const NIGERIAN_BANKS = [
  'Access Bank', 'Citibank Nigeria', 'Ecobank Nigeria', 'Fidelity Bank',
  'First Bank of Nigeria', 'First City Monument Bank', 'Globus Bank',
  'Guaranty Trust Bank', 'Heritage Bank', 'Keystone Bank', 'Kuda Bank',
  'Opay', 'Palmpay', 'Polaris Bank', 'Providus Bank', 'Stanbic IBTC Bank',
  'Standard Chartered Bank', 'Sterling Bank', 'SunTrust Bank', 'Titan Trust Bank',
  'Union Bank of Nigeria', 'United Bank for Africa', 'VFD Microfinance Bank',
  'Wema Bank', 'Zenith Bank',
];

const PLATFORM_FEES = [
  { label: 'Ticket Sales Fee', rate: '3.5%', description: 'Applied to each ticket sold' },
  { label: 'Voting Fee', rate: '5%', description: 'Applied to each paid vote' },
  { label: 'Award Entry Fee', rate: '2%', description: 'Applied to award submission fees' },
  { label: 'Withdrawal Fee', rate: '₦100', description: 'Flat fee per withdrawal' },
];

function formatAmount(amount: number, currency: string = 'NGN') {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency, minimumFractionDigits: 0 }).format(Math.abs(amount));
}

export function Monetization() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentOrg } = useAuth();
  const [showBankForm, setShowBankForm] = useState(false);
  const [showPayoutForm, setShowPayoutForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Bank form state
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [payoutAmount, setPayoutAmount] = useState('');

  const canManage = true;

  const payoutAccounts = useQuery(
    api.payoutAccounts.queries.getByOrg,
    currentOrg ? { orgId: currentOrg.id as any } : 'skip'
  ) ?? [];

  const earnings = useQuery(
    api.transactions.queries.getEarnings,
    currentOrg ? { orgId: currentOrg.id as any } : 'skip'
  );

  const transactions = useQuery(
    api.transactions.queries.getByOrg,
    currentOrg ? { orgId: currentOrg.id as any } : 'skip'
  ) ?? [];

  const events = useQuery(
    api.events.queries.getByOrg,
    currentOrg ? { orgId: currentOrg.id as any } : 'skip'
  ) ?? [];

  const createPayoutAccount = useMutation(api.payoutAccounts.mutations.create);
  const deletePayoutAccount = useMutation(api.payoutAccounts.mutations.remove);
  const setDefaultAccount = useMutation(api.payoutAccounts.mutations.setDefault);
  const requestPayout = useMutation(api.transactions.mutations.requestPayout);

  if (!currentOrg) {
    return <div className="text-center py-20 text-dark-400">Select an organization first.</div>;
  }

  const handleAddBank = async () => {
    if (!bankName || !accountNumber || !accountName) {
      toast('Please fill all bank details', 'error');
      return;
    }
    try {
      setSaving(true);
      await createPayoutAccount({
        orgId: currentOrg.id as any,
        bankName,
        accountNumber,
        accountName,
        currency: 'NGN',
      });
      toast('Bank account added', 'success');
      setShowBankForm(false);
      setBankName('');
      setAccountNumber('');
      setAccountName('');
    } catch (error: any) {
      toast(error.message || 'Failed to add bank', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBank = async (accountId: string) => {
    try {
      await deletePayoutAccount({ accountId: accountId as any });
      toast('Bank account removed', 'success');
    } catch (error: any) {
      toast(error.message || 'Failed to remove', 'error');
    }
  };

  const handleSetDefault = async (accountId: string) => {
    try {
      await setDefaultAccount({ accountId: accountId as any });
      toast('Default account updated', 'success');
    } catch (error: any) {
      toast(error.message || 'Failed to update', 'error');
    }
  };

  const handleRequestPayout = async () => {
    const amount = parseFloat(payoutAmount);
    if (isNaN(amount) || amount <= 0) {
      toast('Please enter a valid amount', 'error');
      return;
    }
    const defaultAccount = payoutAccounts.find(a => a.isDefault);
    if (!defaultAccount) {
      toast('Please add a bank account first', 'error');
      return;
    }
    try {
      setSaving(true);
      await requestPayout({
        orgId: currentOrg.id as any,
        payoutAccountId: defaultAccount._id,
        amount,
      });
      toast('Payout request submitted', 'success');
      setShowPayoutForm(false);
      setPayoutAmount('');
    } catch (error: any) {
      toast(error.message || 'Failed to request payout', 'error');
    } finally {
      setSaving(false);
    }
  };

  const defaultAccount = payoutAccounts.find(a => a.isDefault);
  const availableBalance = earnings?.availableBalance ?? 0;

  const txTypeLabels: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
    ticket_sale: { label: 'Ticket Sale', icon: <ArrowUpRight className="h-4 w-4 text-emerald-500" />, color: 'text-emerald-500' },
    voting_revenue: { label: 'Voting Revenue', icon: <ArrowUpRight className="h-4 w-4 text-emerald-500" />, color: 'text-emerald-500' },
    award_entry: { label: 'Award Entry', icon: <ArrowUpRight className="h-4 w-4 text-emerald-500" />, color: 'text-emerald-500' },
    withdrawal: { label: 'Withdrawal', icon: <ArrowDownRight className="h-4 w-4 text-amber-500" />, color: 'text-amber-500' },
    payout: { label: 'Payout', icon: <ArrowDownRight className="h-4 w-4 text-amber-500" />, color: 'text-amber-500' },
    refund: { label: 'Refund', icon: <XCircle className="h-4 w-4 text-red-500" />, color: 'text-red-500' },
    platform_fee: { label: 'Platform Fee', icon: <ArrowDownRight className="h-4 w-4 text-dark-400" />, color: 'text-dark-400' },
  };

  return (
    <div className="space-y-8">
      <div>
        <Breadcrumbs />
        <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Monetization</h1>
        <p className="text-dark-400">Track your earnings, manage payouts, and view transaction history.</p>
      </div>

      {/* ── Earnings Overview ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
            <p className="text-[10px] text-dark-500 uppercase tracking-widest mb-1">Available Balance</p>
            <p className="text-2xl font-serif text-white">{earnings ? formatAmount(availableBalance) : '₦0'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
            </div>
            <p className="text-[10px] text-dark-500 uppercase tracking-widest mb-1">Pending Balance</p>
            <p className="text-2xl font-serif text-white">{earnings ? formatAmount(earnings.pendingBalance) : '₦0'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-gold-500" />
              </div>
            </div>
            <p className="text-[10px] text-dark-500 uppercase tracking-widest mb-1">Lifetime Earnings</p>
            <p className="text-2xl font-serif text-white">{earnings ? formatAmount(earnings.lifetimeEarnings) : '₦0'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-violet-500" />
              </div>
            </div>
            <p className="text-[10px] text-dark-500 uppercase tracking-widest mb-1">This Month</p>
            <p className="text-2xl font-serif text-white">{earnings ? formatAmount(earnings.thisMonthEarnings) : '₦0'}</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Your Events ───────────────────────────────────────────── */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Your Events</CardTitle>
            <CardDescription>Manage monetization for each event.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/events/create')}>
            <Plus className="h-4 w-4 mr-1" /> Create Event
          </Button>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="h-10 w-10 text-dark-600 mx-auto mb-3" />
              <p className="text-sm text-dark-400 mb-1">No events created yet</p>
              <p className="text-xs text-dark-500 mb-4">Create your first event to start earning from votes and tickets.</p>
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/events/create')}>
                <Plus className="h-3.5 w-3.5 mr-1.5" /> Create Event
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors cursor-pointer"
                  onClick={() => navigate(`/dashboard/events/${event._id}`)}
                >
                  <div className="flex items-center gap-4">
                    {event.bannerUrl ? (
                      <img src={event.bannerUrl} className="h-12 w-16 rounded-lg object-cover shrink-0" alt="" />
                    ) : (
                      <div className="h-12 w-16 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: (event.themeColor || '#c68a35') + '20' }}>
                        <Trophy className="h-5 w-5" style={{ color: event.themeColor || '#c68a35' }} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-white truncate">{event.title}</p>
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                          event.status === 'published' ? 'bg-emerald-500/10 text-emerald-500'
                          : event.status === 'live' ? 'bg-gold-500/10 text-gold-500'
                          : event.status === 'draft' ? 'bg-white/5 text-dark-400'
                          : event.status === 'closed' ? 'bg-red-500/10 text-red-500'
                          : 'bg-white/5 text-dark-400'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        {event.date && (
                          <span className="text-xs text-dark-400">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        )}
                        {event.votingType && (
                          <span className="text-[10px] text-dark-500 uppercase tracking-widest">
                            {event.votingType === 'both' ? 'Public + Judge' : event.votingType} voting
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-dark-600 shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {availableBalance === 0 && transactions.length === 0 ? (
        /* ── Empty State ──────────────────────────────────────────── */
        <Card>
          <CardContent className="py-16">
            <div className="text-center max-w-md mx-auto">
              <DollarSign className="h-12 w-12 text-dark-600 mx-auto mb-4" />
              <h3 className="text-lg font-serif text-white mb-2">No earnings yet</h3>
              <p className="text-sm text-dark-400 mb-6">Create your first event or award to begin receiving payments from fans and voters.</p>
              <Button variant="primary" onClick={() => navigate('/dashboard/events/create')}>
                <Plus className="h-4 w-4 mr-2" /> Create Event
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* ── Payout Account ─────────────────────────────────────── */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Payout Account</CardTitle>
                <CardDescription>Where your earnings are sent.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowBankForm(!showBankForm)}>
                <Plus className="h-4 w-4 mr-1" /> Add Bank
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {payoutAccounts.length === 0 && !showBankForm ? (
                <div className="text-center py-6">
                  <Building2 className="h-8 w-8 text-dark-600 mx-auto mb-3" />
                  <p className="text-sm text-dark-400 mb-1">No bank account added</p>
                  <p className="text-xs text-dark-500">Add a bank account to receive payouts</p>
                </div>
              ) : (
                <>
                  {payoutAccounts.map((account) => (
                    <div key={account._id} className={`p-4 rounded-xl border transition-colors ${account.isDefault ? 'bg-gold-500/5 border-gold-500/20' : 'bg-white/[0.02] border-white/5'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-white">{account.bankName}</p>
                            {account.isDefault && (
                              <span className="text-[9px] font-bold uppercase tracking-widest text-gold-500 bg-gold-500/10 px-1.5 py-0.5 rounded">Default</span>
                            )}
                          </div>
                          <p className="text-xs text-dark-400 mt-1">****{account.accountNumber.slice(-4)} &middot; {account.accountName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!account.isDefault && (
                            <Button variant="ghost" size="sm" className="text-xs" onClick={() => handleSetDefault(account._id)}>
                              Set Default
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:bg-red-500/10" onClick={() => handleDeleteBank(account._id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {showBankForm && (
                    <div className="p-4 rounded-xl border border-gold-500/20 bg-gold-500/5 space-y-4">
                      <p className="text-xs font-bold text-gold-500 uppercase tracking-widest">Add Bank Account</p>
                      <select
                        className="flex h-12 w-full rounded-lg border border-white/10 bg-dark-900/50 px-4 py-2 text-sm text-white focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/50"
                        value={bankName}
                        onChange={e => setBankName(e.target.value)}
                      >
                        <option value="">Select bank</option>
                        {NIGERIAN_BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                      <Input placeholder="Account Number" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} maxLength={10} />
                      <Input placeholder="Account Name" value={accountName} onChange={e => setAccountName(e.target.value)} />
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1" onClick={() => setShowBankForm(false)}>Cancel</Button>
                        <Button className="flex-1" onClick={handleAddBank} disabled={saving}>
                          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                          Add Account
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* ── Payout Schedule ────────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payout Schedule</CardTitle>
              <CardDescription>When and how you get paid.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="text-xs font-bold text-dark-500 uppercase tracking-widest mb-3">Schedule</p>
                <div className="flex gap-2">
                  {['Weekly', 'Monthly', 'Manual'].map((s) => (
                    <button
                      key={s}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${
                        s === 'Manual'
                          ? 'bg-gold-500 text-dark-950'
                          : 'bg-white/5 text-dark-400 hover:bg-white/10'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="text-[10px] text-dark-500 uppercase tracking-widest mb-1">Minimum Withdrawal</p>
                  <p className="text-lg font-serif text-white">₦5,000</p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="text-[10px] text-dark-500 uppercase tracking-widest mb-1">Next Payout</p>
                  <p className="text-lg font-serif text-white">Manual</p>
                </div>
              </div>

              {/* Withdraw Button */}
              <div className="pt-2">
                {showPayoutForm ? (
                  <div className="p-4 rounded-xl border border-gold-500/20 bg-gold-500/5 space-y-3">
                    <p className="text-xs font-bold text-gold-500 uppercase tracking-widest">Request Payout</p>
                    <div className="flex items-center gap-2">
                      <span className="text-dark-400 text-sm">₦</span>
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={payoutAmount}
                        onChange={e => setPayoutAmount(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-[10px] text-dark-500">Available: {formatAmount(availableBalance)}</p>
                    {defaultAccount && (
                      <p className="text-[10px] text-dark-400">To: {defaultAccount.bankName} ****{defaultAccount.accountNumber.slice(-4)}</p>
                    )}
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => setShowPayoutForm(false)}>Cancel</Button>
                      <Button className="flex-1" onClick={handleRequestPayout} disabled={saving || !defaultAccount}>
                        {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                        Withdraw
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => setShowPayoutForm(true)}
                    disabled={availableBalance <= 0 || !defaultAccount}
                  >
                    <Wallet className="h-4 w-4 mr-2" /> Request Payout
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Transaction History ───────────────────────────────────── */}
      {transactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(0, 20).map((tx) => {
                const meta = txTypeLabels[tx.type] ?? { label: tx.type, icon: <ArrowUpRight className="h-4 w-4 text-dark-400" />, color: 'text-dark-400' };
                return (
                  <div key={tx._id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-dark-800 border border-white/5 flex items-center justify-center">
                        {meta.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{tx.description}</p>
                        <p className="text-xs text-dark-500">{new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${tx.amount < 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {tx.amount < 0 ? '-' : '+'}{formatAmount(Math.abs(tx.amount), tx.currency)}
                      </p>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${
                        tx.status === 'completed' ? 'text-emerald-500' : tx.status === 'pending' ? 'text-amber-500' : 'text-red-500'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Platform Fees ─────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Platform Fees</CardTitle>
          <CardDescription>Awwardly charges the following fees for payment processing.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {PLATFORM_FEES.map((fee) => (
              <div key={fee.label} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{fee.label}</p>
                  <p className="text-xs text-dark-500">{fee.description}</p>
                </div>
                <span className="text-lg font-serif text-gold-500">{fee.rate}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-start gap-2">
            <Info className="h-4 w-4 text-dark-500 mt-0.5 shrink-0" />
            <p className="text-xs text-dark-500">Fees are deducted automatically from each transaction. Rates may vary by region. Contact support for enterprise pricing.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
