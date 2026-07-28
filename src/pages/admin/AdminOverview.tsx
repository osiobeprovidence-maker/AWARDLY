import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../lib/convex-auth';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Loader2, Building2, Users, Trophy, Vote, DollarSign, TrendingUp, AlertTriangle, Activity, ShieldCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartContainer } from '../../components/ui/ChartContainer';

export function AdminOverview() {
  const { user } = useAuth();
  const stats = useQuery(
    api.admin.queries.getPlatformStats,
    user?.id ? { firebaseUid: user.id } : 'skip'
  );

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-gold-500 animate-spin" />
      </div>
    );
  }

  const kpiCards = [
    { label: 'Organizations', value: stats.totalOrgs.toLocaleString(), icon: Building2, color: 'text-gold-500', bg: 'bg-gold-500/10' },
    { label: 'Active Events', value: stats.activeEvents.toLocaleString(), icon: Trophy, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Total Votes', value: stats.totalVotes.toLocaleString(), icon: Vote, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { label: 'Platform Revenue', value: `₦${(stats.totalRevenue / 1000).toFixed(0)}K`, icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Platform Fees', value: `₦${(stats.platformFees / 1000).toFixed(0)}K`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Pending Payouts', value: stats.pendingWithdrawals.toLocaleString(), icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { label: 'Pending Nominations', value: stats.pendingNominations.toLocaleString(), icon: Activity, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center text-emerald-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
          Platform Overview
        </div>
        <h1 className="text-3xl md:text-4xl font-serif text-white tracking-tight">Welcome Back, Super Admin</h1>
        <p className="text-dark-400 text-sm mt-1">Signed in as {user?.email}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiCards.map((stat, i) => (
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
            <CardTitle>Revenue Trend (Daily)</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.revenueChart.length > 0 ? (
                <ChartContainer height={300}>
                  <AreaChart data={stats.revenueChart}>
                    <defs>
                      <linearGradient id="adminRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#5d5d5d" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#5d5d5d" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: 12 }}
                      formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="rev" stroke="#22c55e" strokeWidth={3} fill="url(#adminRevenue)" />
                  </AreaChart>
                </ChartContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-dark-500 text-sm">No revenue data yet</div>
              )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Platform Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/50">
              <span className="text-xs text-dark-400">Platform Status</span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Healthy
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/50">
              <span className="text-xs text-dark-400">Total Events</span>
              <span className="text-xs text-white font-medium">{stats.totalEvents}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/50">
              <span className="text-xs text-dark-400">Active Events</span>
              <span className="text-xs text-emerald-400 font-medium">{stats.activeEvents}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/50">
              <span className="text-xs text-dark-400">Suspended Orgs</span>
              <span className="text-xs text-rose-400 font-medium">{stats.suspendedOrgs}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/50">
              <span className="text-xs text-dark-400">Total Nominations</span>
              <span className="text-xs text-white font-medium">{stats.totalNominations}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/50">
              <span className="text-xs text-dark-400">Pending Verifications</span>
              <span className="text-xs text-amber-400 font-medium">{stats.pendingApprovals}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-serif text-white">Top Organizations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.topOrgs.slice(0, 6).map((org: any) => (
            <Card key={org._id} className="hover:bg-white/5 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-dark-800 rounded-xl border border-white/5 flex items-center justify-center font-serif text-gold-500 text-sm shrink-0">
                    {org.name?.[0] || '?'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-white text-sm font-medium truncate">{org.name}</h4>
                      {org.isVerified && <ShieldCheck className="h-3 w-3 text-gold-500 shrink-0" />}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-dark-500 uppercase tracking-widest mt-1">
                      <span>{org.eventCount} events</span>
                      <span>{org.followerCount} followers</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
