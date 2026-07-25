import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  CreditCard, Check, ArrowLeft, Download, Calendar, HardDrive, Users,
  Trophy, Loader2, ArrowUpRight, ArrowDownRight, Clock,
} from 'lucide-react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { useToast } from '../../lib/toast';
import { useAuth } from '../../lib/convex-auth';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    period: 'Free forever',
    features: [
      'Up to 3 events',
      '1 GB storage',
      '3 team members',
      'Basic voting',
      'Public profile',
      'Email support',
    ],
    limits: { events: 3, storage: '1 GB', team: 3 },
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 25000,
    period: '/month',
    features: [
      'Up to 25 events',
      '10 GB storage',
      '15 team members',
      'Paid voting packages',
      'Custom branding',
      'Live broadcasts',
      'Analytics dashboard',
      'Priority support',
    ],
    limits: { events: 25, storage: '10 GB', team: 15 },
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99000,
    period: '/month',
    features: [
      'Unlimited events',
      '100 GB storage',
      'Unlimited team members',
      'Custom voting rules',
      'White-label branding',
      'API access',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
    ],
    limits: { events: 'Unlimited', storage: '100 GB', team: 'Unlimited' },
  },
];

function formatAmount(amount: number, currency: string = 'NGN') {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency, minimumFractionDigits: 0 }).format(amount);
}

export function Billing() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentOrg } = useAuth();
  const [changingPlan, setChangingPlan] = useState<string | null>(null);

  const subscription = useQuery(
    api.subscriptions.queries.getByOrg,
    currentOrg ? { orgId: currentOrg.id as any } : 'skip'
  );

  const upsertSubscription = useMutation(api.subscriptions.mutations.upsert);
  const cancelSubscription = useMutation(api.subscriptions.mutations.cancel);

  const transactions = useQuery(
    api.transactions.queries.getByOrg,
    currentOrg ? { orgId: currentOrg.id as any } : 'skip'
  ) ?? [];

  if (!currentOrg) {
    return <div className="text-center py-20 text-dark-400">Select an organization first.</div>;
  }

  const currentPlan = subscription?.plan ?? 'starter';
  const billingHistory = transactions.filter(t =>
    ['platform_fee', 'payout', 'withdrawal'].includes(t.type)
  );

  const handleUpgrade = async (planId: string) => {
    const plan = PLANS.find(p => p.id === planId);
    if (!plan) return;
    try {
      setChangingPlan(planId);
      await upsertSubscription({
        orgId: currentOrg.id as any,
        plan: planId as any,
        status: 'active',
        monthlyPrice: plan.price,
      });
      toast(`Upgraded to ${plan.name} plan`, 'success');
    } catch (error: any) {
      toast(error.message || 'Failed to upgrade', 'error');
    } finally {
      setChangingPlan(null);
    }
  };

  const handleCancel = async () => {
    try {
      setChangingPlan('cancel');
      await cancelSubscription({ orgId: currentOrg.id as any });
      toast('Subscription cancelled', 'success');
    } catch (error: any) {
      toast(error.message || 'Failed to cancel', 'error');
    } finally {
      setChangingPlan(null);
    }
  };

  const storageUsed = '0 GB';

  return (
    <div className="space-y-8">
      <div>
        <Breadcrumbs />
        <div className="flex items-center gap-4 mb-2">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <ArrowLeft className="h-5 w-5 text-dark-400" />
          </button>
          <h1 className="text-3xl font-serif text-white tracking-tight">Billing & Plans</h1>
        </div>
        <p className="text-dark-400">Manage your subscription, payment methods, and billing history.</p>
      </div>

      {/* ── Current Plan ──────────────────────────────────────────── */}
      <Card className="bg-gold-500/5 border-gold-500/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-[10px] font-bold text-gold-500 uppercase tracking-widest mb-1">Current Plan</p>
              <h3 className="text-2xl font-serif text-white">{PLANS.find(p => p.id === currentPlan)?.name ?? 'Starter'}</h3>
              <div className="flex items-center gap-4 mt-2 text-xs text-dark-400">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {subscription ? `Renews ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}` : 'Free plan'}</span>
                <span className="flex items-center gap-1"><HardDrive className="h-3 w-3" /> {storageUsed} / {PLANS.find(p => p.id === currentPlan)?.limits.storage ?? '1 GB'}</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Team</span>
              </div>
            </div>
            {currentPlan === 'starter' && (
              <Button variant="primary" size="lg" onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}>
                Upgrade Now
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Compare Plans ─────────────────────────────────────────── */}
      <div id="plans">
        <h2 className="text-xl font-serif text-white mb-6">Compare Plans</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            const isLoading = changingPlan === plan.id;
            return (
              <Card
                key={plan.id}
                className={`relative ${plan.popular ? 'border-gold-500/40 bg-gold-500/5' : 'border-white/5'} ${isCurrent ? 'ring-1 ring-gold-500/30' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gold-500 text-dark-950 text-[10px] font-bold uppercase tracking-widest">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-serif text-white">
                      {plan.price === 0 ? 'Free' : formatAmount(plan.price)}
                    </span>
                    {plan.price > 0 && <span className="text-dark-500 text-sm ml-1">{plan.period}</span>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-dark-300">
                        <Check className="h-4 w-4 text-gold-500 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4">
                    {isCurrent ? (
                      <Button variant="outline" className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : (
                      <Button
                        variant={plan.popular ? 'primary' : 'outline'}
                        className="w-full"
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                        {plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ── Payment Method ─────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Method</CardTitle>
          <CardDescription>Manage your billing card on file.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CreditCard className="h-10 w-10 text-dark-600 mx-auto mb-3" />
            <p className="text-sm text-dark-400 mb-1">No payment method on file</p>
            <p className="text-xs text-dark-500 mb-4">Add a card to upgrade your plan</p>
            <Button variant="outline" onClick={() => toast('Card form coming soon', 'info')}>
              <CreditCard className="h-4 w-4 mr-2" /> Add Card
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Billing History ───────────────────────────────────────── */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Billing History</CardTitle>
            <CardDescription>Invoices, receipts, and payment records.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {billingHistory.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-10 w-10 text-dark-600 mx-auto mb-3" />
              <p className="text-sm text-dark-400 mb-1">No billing history yet</p>
              <p className="text-xs text-dark-500">Your invoices and receipts will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {billingHistory.map((tx) => (
                <div key={tx._id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${tx.type === 'payout' ? 'bg-emerald-500/10' : 'bg-dark-800'}`}>
                      {tx.type === 'payout'
                        ? <ArrowDownRight className="h-4 w-4 text-emerald-500" />
                        : <ArrowUpRight className="h-4 w-4 text-dark-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{tx.description}</p>
                      <p className="text-xs text-dark-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${tx.amount < 0 ? 'text-emerald-500' : 'text-white'}`}>
                      {tx.amount < 0 ? '-' : '+'}{formatAmount(Math.abs(tx.amount), tx.currency)}
                    </p>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      tx.status === 'completed' ? 'text-emerald-500' : tx.status === 'pending' ? 'text-amber-500' : 'text-red-500'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Subscription Actions ──────────────────────────────────── */}
      {currentPlan !== 'starter' && (
        <Card className="border-red-500/20">
          <CardHeader>
            <CardTitle className="text-lg text-red-400">Subscription Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Need to cancel your subscription?</p>
                <p className="text-xs text-dark-500">You'll retain access until the end of your billing period.</p>
              </div>
              <Button
                variant="outline"
                className="text-red-400 border-red-500/20 hover:bg-red-500/10"
                onClick={handleCancel}
                disabled={changingPlan === 'cancel'}
              >
                {changingPlan === 'cancel' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Cancel Subscription
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
