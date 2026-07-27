import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../lib/convex-auth';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { DollarSign, Loader2, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function AdminRevenue() {
  const { user } = useAuth();

  const stats = useQuery(
    api.admin.queries.getPlatformStats,
    user?.id ? { firebaseUid: user.id } : 'skip'
  );

  const transactions = useQuery(
    api.admin.queries.getAllTransactions,
    user?.id ? { firebaseUid: user.id, status: 'completed' } : 'skip'
  );

  if (!stats) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 text-gold-500 animate-spin" /></div>;
  }

  const typeBreakdown = transactions?.reduce((acc: Record<string, number>, t: any) => {
    if (t.status === 'completed') {
      acc[t.type] = (acc[t.type] || 0) + t.amount;
    }
    return acc;
  }, {}) || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-white tracking-tight">Revenue</h1>
        <p className="text-dark-400 text-sm mt-1">Platform revenue analytics</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `₦${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-gold-500', bg: 'bg-gold-500/10' },
          { label: 'Platform Fees', value: `₦${stats.platformFees.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Pending Payouts', value: stats.pendingWithdrawals.toLocaleString(), icon: ArrowDownRight, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Active Events', value: stats.activeEvents.toLocaleString(), icon: ArrowUpRight, color: 'text-sky-400', bg: 'bg-sky-500/10' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2">{stat.label}</p>
                  <h3 className="text-2xl font-serif text-white">{stat.value}</h3>
                </div>
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {stats.revenueChart.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={stats.revenueChart}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#eab308" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#5d5d5d" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#5d5d5d" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: 12 }} formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Revenue']} />
                    <Area type="monotone" dataKey="rev" stroke="#eab308" strokeWidth={3} fill="url(#revGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-dark-500 text-sm">No revenue data yet</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue by Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(typeBreakdown).sort(([,a], [,b]) => (b as number) - (a as number)).map(([type, amount]) => (
              <div key={type} className="flex items-center justify-between p-3 rounded-xl bg-dark-900/50">
                <span className="text-xs text-dark-400 capitalize">{type.replace(/_/g, ' ')}</span>
                <span className="text-xs text-white font-medium">₦{(amount as number).toLocaleString()}</span>
              </div>
            ))}
            {Object.keys(typeBreakdown).length === 0 && (
              <div className="text-center text-dark-500 text-sm py-8">No transactions yet</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
