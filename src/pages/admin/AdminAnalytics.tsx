import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../lib/convex-auth';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { BarChart3, Loader2, Users, Building2, Trophy, Globe } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartContainer } from '../../components/ui/ChartContainer';

export function AdminAnalytics() {
  const { user } = useAuth();

  const stats = useQuery(
    api.admin.queries.getPlatformStats,
    user?.id ? { firebaseUid: user.id } : 'skip'
  );

  const voting = useQuery(
    api.admin.queries.getVotingCenter,
    user?.id ? { firebaseUid: user.id } : 'skip'
  );

  if (!stats) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 text-gold-500 animate-spin" /></div>;
  }

  const growthData = [
    { name: 'Orgs', count: stats.totalOrgs },
    { name: 'Users', count: stats.totalUsers },
    { name: 'Events', count: stats.totalEvents },
    { name: 'Votes', count: Math.min(stats.totalVotes, 10000) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-white tracking-tight">Analytics</h1>
        <p className="text-dark-400 text-sm mt-1">Platform-wide analytics and insights</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Organizations', value: stats.totalOrgs, icon: Building2, color: 'text-gold-500', bg: 'bg-gold-500/10' },
          { label: 'Users', value: stats.totalUsers, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'Events', value: stats.totalEvents, icon: Trophy, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Total Votes', value: stats.totalVotes, icon: BarChart3, color: 'text-sky-400', bg: 'bg-sky-500/10' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2">{stat.label}</p>
                  <h3 className="text-2xl font-serif text-white">{stat.value.toLocaleString()}</h3>
                </div>
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Platform Growth</CardTitle>
          </CardHeader>
          <CardContent>
              <ChartContainer height={300}>
                <BarChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#5d5d5d" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#5d5d5d" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: 12 }} />
                  <Bar dataKey="count" fill="#eab308" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Platform Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/50">
              <span className="text-xs text-dark-400">Total Revenue</span>
              <span className="text-xs text-white font-medium">₦{stats.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/50">
              <span className="text-xs text-dark-400">Platform Fees</span>
              <span className="text-xs text-white font-medium">₦{stats.platformFees.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/50">
              <span className="text-xs text-dark-400">Pending Payouts</span>
              <span className="text-xs text-amber-400 font-medium">{stats.pendingWithdrawals}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/50">
              <span className="text-xs text-dark-400">Active Events</span>
              <span className="text-xs text-emerald-400 font-medium">{stats.activeEvents}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/50">
              <span className="text-xs text-dark-400">Pending Nominations</span>
              <span className="text-xs text-dark-300 font-medium">{stats.pendingNominations}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/50">
              <span className="text-xs text-dark-400">Suspended Orgs</span>
              <span className="text-xs text-rose-400 font-medium">{stats.suspendedOrgs}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/50">
              <span className="text-xs text-dark-400">Total Nominations</span>
              <span className="text-xs text-white font-medium">{stats.totalNominations}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
