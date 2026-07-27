import React, { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  Trophy, Users, Eye, ArrowUpRight, TrendingUp, Loader2,
  Medal, Ticket, Building2, Zap, User, DollarSign, Clock,
  Vote, FileCheck, AlertCircle, ChevronRight, Star,
  BarChart3, ArrowRight, Activity, Plus
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../lib/convex-auth';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

function StatCard({ label, value, icon: Icon, color, to, sub, delay = 0 }: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  to?: string;
  sub?: string;
  delay?: number;
}) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card
        className="hover:border-gold-500/30 transition-all group overflow-hidden relative cursor-pointer"
        onClick={() => to && navigate(to)}
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[9px] font-bold text-dark-500 uppercase tracking-widest mb-2">{label}</p>
              <h3 className="text-2xl font-serif text-white">{value}</h3>
              {sub && <p className="text-[10px] text-dark-500 mt-1">{sub}</p>}
            </div>
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function formatCurrency(amount: number) {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(1)}K`;
  return `₦${amount.toLocaleString()}`;
}

function formatAction(action: string): string {
  const map: Record<string, string> = {
    create: 'Created',
    publish: 'Published',
    delete: 'Deleted',
    go_live: 'Went live',
    close: 'Closed',
    'transition:draft': 'Moved to Draft',
    'transition:ready_for_review': 'Submitted for Review',
    'transition:published': 'Published',
    'transition:live': 'Went Live',
    'transition:voting_ended': 'Ended Voting',
    'transition:winners_announced': 'Announced Winners',
    'transition:archived': 'Archived',
    'transition:closed': 'Closed',
    invite_judge: 'Invited Judge',
    approve_nomination: 'Approved Nomination',
    reject_nomination: 'Rejected Nomination',
  };
  return map[action] || action.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const PIE_COLORS = ['#c68a35', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444'];

export function DashboardOverview() {
  const { user, currentOrg, organizations } = useAuth();
  const navigate = useNavigate();

  const stats = useQuery(
    api.dashboard.queries.getOrgStats,
    currentOrg ? { orgId: currentOrg.id as any } : 'skip'
  );

  const activity = useQuery(
    api.dashboard.queries.getRecentActivity,
    currentOrg ? { orgId: currentOrg.id as any, limit: 15 } : 'skip'
  );

  const loading = stats === undefined;

  const chartData = useMemo(() => {
    if (!stats?.dailyAnalytics) return [];
    const days: { date: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({ date: key.slice(5), count: stats.dailyAnalytics[key] || 0 });
    }
    return days;
  }, [stats?.dailyAnalytics]);

  const eventPipelineData = useMemo(() => {
    if (!stats?.eventStats) return [];
    return [
      { name: 'Draft', value: stats.eventStats.draft, color: '#6b7280' },
      { name: 'In Review', value: stats.eventStats.inReview, color: '#f59e0b' },
      { name: 'Published', value: stats.eventStats.published, color: '#3b82f6' },
      { name: 'Live', value: stats.eventStats.live, color: '#10b981' },
      { name: 'Voting Ended', value: stats.eventStats.votingEnded, color: '#f97316' },
      { name: 'Winners', value: stats.eventStats.winnersAnnounced, color: '#c68a35' },
      { name: 'Archived', value: stats.eventStats.archived, color: '#374151' },
    ].filter((d) => d.value > 0);
  }, [stats?.eventStats]);

  const nominationPieData = useMemo(() => {
    if (!stats?.nominationStats) return [];
    return [
      { name: 'Pending', value: stats.nominationStats.pending, color: '#f59e0b' },
      { name: 'Approved', value: stats.nominationStats.approved, color: '#10b981' },
      { name: 'Rejected', value: stats.nominationStats.rejected, color: '#ef4444' },
      { name: 'Shortlisted', value: stats.nominationStats.shortlisted, color: '#8b5cf6' },
    ].filter((d) => d.value > 0);
  }, [stats?.nominationStats]);

  if (!currentOrg) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <Building2 className="h-16 w-16 text-dark-600 mb-6" />
        <h2 className="text-2xl font-serif text-white mb-3">Select an Organization</h2>
        <p className="text-dark-400 text-sm mb-8 max-w-sm">
          Choose an organization from the sidebar to view its dashboard.
        </p>
        {organizations.length > 0 ? (
          <Button onClick={() => navigate('/dashboard/events')}>
            Go to Events
          </Button>
        ) : (
          <Button onClick={() => navigate('/onboarding')}>
            <Plus className="h-4 w-4 mr-2" /> Create Organization
          </Button>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 text-gold-500 animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-32 text-dark-400">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-dark-600" />
        <p>Unable to load dashboard data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} className="h-14 w-14 rounded-2xl object-cover border-2 border-white/10" alt="" referrerPolicy="no-referrer" />
          ) : (
            <div className="h-14 w-14 rounded-2xl bg-gold-500/10 flex items-center justify-center border border-gold-500/20">
              <User className="h-7 w-7 text-gold-500" />
            </div>
          )}
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl md:text-3xl font-serif text-white tracking-tight italic"
            >
              {currentOrg.name} Dashboard
            </motion.h1>
            <p className="text-dark-400 text-sm mt-1">
              Welcome back, {user?.name?.split(' ')[0] || 'there'}
            </p>
          </div>
        </div>
        <Link to="/dashboard/events/create">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" /> New Event
          </Button>
        </Link>
      </div>

      {/* Primary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Events"
          value={stats.eventStats.total}
          icon={Trophy}
          color="bg-gold-500/10 text-gold-500"
          to="/dashboard/events"
          sub={`${stats.eventStats.live} live now`}
          delay={0}
        />
        <StatCard
          label="Total Votes"
          value={stats.totalVotes.toLocaleString()}
          icon={Vote}
          color="bg-emerald-500/10 text-emerald-500"
          to="/dashboard/analytics"
          sub={`Across ${stats.totalCategories} categories`}
          delay={0.05}
        />
        <StatCard
          label="Nominations"
          value={stats.nominationStats.total}
          icon={Medal}
          color="bg-amber-500/10 text-amber-500"
          to="/dashboard/nomination-review"
          sub={`${stats.nominationStats.pending} pending review`}
          delay={0.1}
        />
        <StatCard
          label="Revenue"
          value={formatCurrency(stats.revenue.total)}
          icon={DollarSign}
          color="bg-sky-500/10 text-sky-500"
          to="/dashboard/billing"
          sub={`${formatCurrency(stats.revenue.thisMonth)} this month`}
          delay={0.15}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Followers"
          value={stats.followerCount}
          icon={Users}
          color="bg-purple-500/10 text-purple-500"
          to="/dashboard/followers"
          delay={0.2}
        />
        <StatCard
          label="Team Members"
          value={stats.memberStats.total}
          icon={Users}
          color="bg-indigo-500/10 text-indigo-500"
          to="/dashboard/team"
          sub={`${stats.memberStats.judges} judges`}
          delay={0.25}
        />
        <StatCard
          label="Page Views"
          value={stats.totalViews.toLocaleString()}
          icon={Eye}
          color="bg-pink-500/10 text-pink-500"
          to="/dashboard/analytics"
          delay={0.3}
        />
        <StatCard
          label="Nominees"
          value={stats.totalNominees}
          icon={Star}
          color="bg-orange-500/10 text-orange-500"
          to="/dashboard/events"
          delay={0.35}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-gold-500" />
              Activity (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#c68a35" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#c68a35" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: '#6b7280', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#6b7280', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#111',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: 12,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#c68a35"
                      strokeWidth={2}
                      fill="url(#goldGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-dark-500 text-sm">
                No analytics data yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Event Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Event Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            {eventPipelineData.length > 0 ? (
              <div className="space-y-4">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={eventPipelineData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {eventPipelineData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#111',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: 12,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {eventPipelineData.map((d) => (
                    <div key={d.name} className="flex items-center gap-2 text-xs">
                      <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-dark-400 truncate">{d.name}</span>
                      <span className="text-white font-bold ml-auto">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-dark-500 text-sm">
                No events yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Nominations & Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nomination Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Nominations</CardTitle>
          </CardHeader>
          <CardContent>
            {nominationPieData.length > 0 ? (
              <div className="space-y-4">
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={nominationPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={65}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {nominationPieData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#111',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: 12,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {nominationPieData.map((d) => (
                    <div key={d.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="text-dark-400">{d.name}</span>
                      </div>
                      <span className="text-white font-bold">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-dark-500 text-sm">
                No nominations yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: 'Create Event', icon: Trophy, to: '/dashboard/events/create' },
              { label: 'Review Nominations', icon: FileCheck, to: '/dashboard/nomination-review' },
              { label: 'Manage Judges', icon: Users, to: '/dashboard/judges' },
              { label: 'View Analytics', icon: BarChart3, to: '/dashboard/analytics' },
              { label: 'Manage Team', icon: Users, to: '/dashboard/team' },
              { label: 'Org Settings', icon: Building2, to: '/dashboard/settings' },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.to)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left group"
              >
                <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-gold-500/10 transition-colors shrink-0">
                  <action.icon className="h-4 w-4 text-dark-500 group-hover:text-gold-500" />
                </div>
                <span className="text-xs text-dark-300 group-hover:text-white transition-colors flex-1">{action.label}</span>
                <ChevronRight className="h-3 w-3 text-dark-600 group-hover:text-gold-500 shrink-0" />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <Activity className="h-4 w-4 text-gold-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!activity || activity.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-8 w-8 text-dark-600 mx-auto mb-3" />
                <p className="text-sm text-dark-400">No activity yet</p>
                <p className="text-[10px] text-dark-500 mt-1">Actions will appear here</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {activity.map((log) => (
                  <div key={log._id} className="flex gap-3 group">
                    <div className="relative">
                      <div className="h-2 w-2 rounded-full bg-gold-500 mt-2" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-dark-300">
                        <span className="text-white font-medium">{log.userName}</span>{' '}
                        {formatAction(log.action)}
                        {log.targetType && (
                          <span className="text-dark-500"> on {log.targetType}</span>
                        )}
                      </p>
                      <p className="text-[10px] text-dark-600 mt-0.5">
                        {timeAgo(log.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Revenue Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-serif flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-gold-500" />
            Financial Summary
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard/billing')}
            className="text-[10px] font-bold uppercase tracking-widest text-dark-500"
          >
            View All <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-[9px] font-bold text-dark-500 uppercase tracking-widest mb-1">Available Balance</p>
              <p className="text-xl font-serif text-gold-500">{formatCurrency(stats.revenue.available)}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-dark-500 uppercase tracking-widest mb-1">Pending</p>
              <p className="text-xl font-serif text-amber-400">{formatCurrency(stats.revenue.pending)}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-dark-500 uppercase tracking-widest mb-1">Withdrawn</p>
              <p className="text-xl font-serif text-dark-300">{formatCurrency(stats.revenue.withdrawn)}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-dark-500 uppercase tracking-widest mb-1">This Month</p>
              <p className="text-xl font-serif text-emerald-400">{formatCurrency(stats.revenue.thisMonth)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
