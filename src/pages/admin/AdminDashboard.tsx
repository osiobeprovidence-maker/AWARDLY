import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  Building2, Users, ShieldCheck, TrendingUp, AlertTriangle, Search,
  ExternalLink, Activity, Loader2, DollarSign, Vote, Trophy, Ban, Eye,
  CheckCircle2, XCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../lib/convex-auth';

export function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const stats = useQuery(
    api.admin.queries.getPlatformStats,
    user?.id ? { firebaseUid: user.id } : 'skip'
  );

  const orgs = useQuery(
    api.admin.queries.getOrgDirectory,
    user?.id ? { firebaseUid: user.id } : 'skip'
  );

  const loading = stats === undefined;

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-gold-500 animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center gap-4">
        <ShieldCheck className="h-16 w-16 text-dark-600" />
        <h2 className="text-2xl font-serif text-white">Access Denied</h2>
        <p className="text-dark-400 text-sm">You need platform admin privileges.</p>
        <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
      </div>
    );
  }

  const filteredOrgs = orgs?.filter((o: any) =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.slug?.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <div className="min-h-screen bg-dark-950 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 overflow-hidden">
          <div>
            <div className="flex items-center text-emerald-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
              Platform Admin
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight leading-tight">Master Control</h1>
            <p className="text-dark-400 text-sm mt-2">Signed in as {user?.email}</p>
          </div>
          <Button variant="glass" onClick={() => navigate('/dashboard')}>
            <Activity className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Organizations', val: stats.totalOrgs.toLocaleString(), icon: Building2, color: 'text-gold-500', bg: 'bg-gold-500/10' },
            { label: 'Registered Users', val: stats.totalUsers.toLocaleString(), icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
            { label: 'Total Votes', val: stats.totalVotes.toLocaleString(), icon: Vote, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Platform Revenue', val: `₦${(stats.totalRevenue / 1000).toFixed(0)}K`, icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2">{stat.label}</p>
                    <h3 className="text-2xl font-serif text-white">{stat.val}</h3>
                  </div>
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pending Items */}
        <div className="grid grid-cols-2 gap-6">
          <Card className="border-amber-500/20">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest">Pending Verifications</p>
                  <h3 className="text-xl font-serif text-white">{stats.pendingApprovals}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-sky-500/20">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-sky-500" />
                </div>
                <div>
                  <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest">Pending Nominations</p>
                  <h3 className="text-xl font-serif text-white">{stats.pendingNominations}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Platform Revenue (Weekly)</CardTitle>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="h-[300px] w-full">
                {stats.revenueChart.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={stats.revenueChart}>
                      <defs>
                        <linearGradient id="ecosystem" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="name" stroke="#5d5d5d" fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis stroke="#5d5d5d" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: 12 }}
                        formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Revenue']}
                      />
                      <Area type="monotone" dataKey="rev" stroke="#6366f1" strokeWidth={3} fill="url(#ecosystem)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-dark-500 text-sm">No revenue data yet</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Hubs */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Top Hubs</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5 max-h-[350px] overflow-y-auto">
                {stats.topOrgs.length > 0 ? stats.topOrgs.map((org: any) => (
                  <div key={org._id} className="p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-white text-sm font-medium group-hover:text-gold-400 transition-colors truncate">{org.name}</h4>
                      {org.isVerified && <CheckCircle2 className="h-3.5 w-3.5 text-gold-500 shrink-0" />}
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-dark-500 uppercase tracking-widest">
                      <span>{org.eventCount} events</span>
                      <span>{org.followerCount} followers</span>
                    </div>
                  </div>
                )) : (
                  <div className="p-6 text-center text-dark-500 text-sm">No organizations yet</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Organization Directory */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif text-white">Organization Directory</h2>
            <div className="w-64">
              <Input
                placeholder="Search organizations..."
                icon={Search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 text-xs"
              />
            </div>
          </div>

          <Card className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-dark-500 uppercase tracking-[0.2em] border-b border-white/5">
                    <th className="px-6 py-5">Organization</th>
                    <th className="px-6 py-5">Plan</th>
                    <th className="px-6 py-5">Events</th>
                    <th className="px-6 py-5">Followers</th>
                    <th className="px-6 py-5">Revenue</th>
                    <th className="px-6 py-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredOrgs.map((org: any) => (
                    <tr key={org._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-dark-800 rounded-xl border border-white/5 flex items-center justify-center font-serif text-gold-500 text-sm">
                            {org.name?.[0] || '?'}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-white text-sm font-medium">{org.name}</h4>
                              {org.isVerified && <CheckCircle2 className="h-3 w-3 text-gold-500" />}
                            </div>
                            <p className="text-dark-500 text-xs">/{org.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`text-xs font-medium px-2 py-1 rounded border ${
                          org.plan === 'enterprise' ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5' :
                          org.plan === 'professional' ? 'border-gold-500/30 text-gold-400 bg-gold-500/5' :
                          'border-white/10 text-dark-300'
                        }`}>
                          {org.plan === 'none' ? 'Free' : org.plan}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-dark-300">{org.eventCount}</td>
                      <td className="px-6 py-5 text-sm text-dark-300">{org.followerCount}</td>
                      <td className="px-6 py-5 text-sm text-white font-medium">
                        ₦{org.revenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-5">
                        <span className="h-2 w-2 rounded-full inline-block mr-2 bg-emerald-400" />
                        <span className="text-xs text-dark-300">Active</span>
                      </td>
                    </tr>
                  ))}
                  {filteredOrgs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-dark-500 text-sm">
                        {search ? 'No organizations match your search' : 'No organizations yet'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
