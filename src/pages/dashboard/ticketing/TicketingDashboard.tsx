import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Breadcrumbs } from '../../../components/ui/Breadcrumbs';
import { useAuth } from '../../../lib/convex-auth';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { motion } from 'motion/react';
import {
  Ticket, DollarSign, TrendingUp, Clock, CheckCircle,
  Users, BarChart3, Activity, ShoppingCart, QrCode,
} from 'lucide-react';

export function TicketingDashboard() {
  const { currentOrg } = useAuth();

  const stats = useQuery(
    api.ticketing.mutations.getDashboardStats,
    currentOrg ? { orgId: currentOrg.id as any } : 'skip'
  );

  const dailySales = useQuery(
    api.ticketing.mutations.getDailySales,
    currentOrg ? { orgId: currentOrg.id as any, days: 14 } : 'skip'
  );

  const salesByType = useQuery(
    api.ticketing.mutations.getSalesByType,
    currentOrg ? { orgId: currentOrg.id as any } : 'skip'
  );

  const orders = useQuery(
    api.ticketing.mutations.getOrdersByOrg,
    currentOrg ? { orgId: currentOrg.id as any } : 'skip'
  );

  const totalSold = stats?.totalTicketsSold ?? 0;
  const totalRevenue = stats?.totalRevenue ?? 0;
  const activeEvents = stats?.activeEvents ?? 0;
  const pendingOrders = stats?.pendingOrders ?? 0;
  const successfulOrders = stats?.successfulOrders ?? 0;
  const checkinsToday = stats?.checkedInToday ?? 0;
  const physicalTickets = orders?.filter(o => o.deliveryMethod === 'physical').length ?? 0;
  const conversionRate = orders && orders.length > 0
    ? Math.round((successfulOrders / orders.length) * 100)
    : 0;

  const statCards = [
    { label: 'Total Tickets Sold', value: totalSold.toLocaleString(), icon: Ticket, color: 'text-gold-500', bg: 'bg-gold-500/10' },
    { label: 'Revenue', value: `₦${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Active Events', value: String(activeEvents), icon: Activity, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Pending Orders', value: String(pendingOrders), icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { label: 'Successful Orders', value: String(successfulOrders), icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Check-ins Today', value: String(checkinsToday), icon: QrCode, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Physical Tickets', value: String(physicalTickets), icon: ShoppingCart, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { label: 'Conversion Rate', value: `${conversionRate}%`, icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  ];

  const chartPlaceholders = [
    { title: 'Daily Sales', description: 'Ticket orders over time' },
    { title: 'Revenue Trend', description: 'Revenue collected per day' },
    { title: 'Ticket Types', description: 'Sales breakdown by ticket type' },
    { title: 'Check-ins', description: 'Check-in activity throughout events' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Breadcrumbs />
        <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Ticketing Overview</h1>
        <p className="text-dark-400">Track ticket sales, revenue, and attendee activity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="hover:border-gold-500/30 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-5">
                <stat.icon className="h-14 w-14" />
              </div>
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <p className="text-[10px] font-bold text-dark-500 uppercase tracking-[0.2em]">{stat.label}</p>
                </div>
                <h3 className="text-2xl font-serif text-white">{stat.value}</h3>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {chartPlaceholders.map((chart) => (
          <Card key={chart.title}>
            <CardHeader>
              <CardTitle className="text-lg">{chart.title}</CardTitle>
              <p className="text-xs text-dark-500">{chart.description}</p>
            </CardHeader>
            <CardContent>
              <div className="h-48 rounded-xl bg-dark-950/50 border border-white/5 flex flex-col items-center justify-center">
                <BarChart3 className="h-8 w-8 text-dark-600 mb-2" />
                <p className="text-xs text-dark-500 font-medium">Chart data</p>
                {chart.title === 'Ticket Types' && salesByType && salesByType.length > 0 && (
                  <div className="mt-3 space-y-2 w-full px-4">
                    {salesByType.map((t) => (
                      <div key={t.name} className="flex items-center gap-2">
                        <div className="h-2 rounded-full bg-gold-500" style={{ width: `${Math.min(100, (t.sold / (totalSold || 1)) * 100)}%` }} />
                        <span className="text-[10px] text-dark-400 whitespace-nowrap">{t.name} ({t.sold})</span>
                      </div>
                    ))}
                  </div>
                )}
                {chart.title === 'Daily Sales' && dailySales && dailySales.length > 0 && (
                  <div className="mt-3 flex items-end gap-1 h-12 px-4">
                    {dailySales.slice(-14).map((d, i) => (
                      <div
                        key={d.date}
                        className="flex-1 bg-gold-500/60 rounded-t"
                        style={{ height: `${Math.max(4, (d.count / Math.max(...dailySales.map(x => x.count), 1)) * 48)}px` }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
