import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Breadcrumbs } from '../../../components/ui/Breadcrumbs';
import { useAuth } from '../../../lib/convex-auth';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { motion } from 'motion/react';
import {
  DollarSign, Ticket, TrendingUp, QrCode, BarChart3,
  ArrowUpRight, Trophy,
} from 'lucide-react';

export function TicketingAnalytics() {
  const { currentOrg } = useAuth();

  const stats = useQuery(
    api.ticketing.mutations.getDashboardStats,
    currentOrg ? { orgId: currentOrg.id as any } : 'skip'
  );

  const salesByType = useQuery(
    api.ticketing.mutations.getSalesByType,
    currentOrg ? { orgId: currentOrg.id as any } : 'skip'
  );

  const dailySales = useQuery(
    api.ticketing.mutations.getDailySales,
    currentOrg ? { orgId: currentOrg.id as any, days: 30 } : 'skip'
  );

  const orders = useQuery(
    api.ticketing.mutations.getOrdersByOrg,
    currentOrg ? { orgId: currentOrg.id as any } : 'skip'
  ) ?? [];

  const totalSold = stats?.totalTicketsSold ?? 0;
  const totalRevenue = stats?.totalRevenue ?? 0;
  const checkinsToday = stats?.checkedInToday ?? 0;
  const avgPrice = totalSold > 0 ? Math.round(totalRevenue / totalSold) : 0;
  const conversionRate = orders.length > 0
    ? Math.round((stats?.successfulOrders ?? 0) / orders.length * 100)
    : 0;

  const topEvents = React.useMemo(() => {
    const eventMap = new Map<string, { title: string; sold: number; revenue: number }>();
    const successfulOrders = orders.filter(o => o.paymentStatus === 'successful');
    for (const order of successfulOrders) {
      const existing = eventMap.get(order.eventId);
      if (existing) {
        existing.sold += order.quantity;
        existing.revenue += order.totalAmount;
      } else {
        eventMap.set(order.eventId, {
          title: order.eventId,
          sold: order.quantity,
          revenue: order.totalAmount,
        });
      }
    }
    return Array.from(eventMap.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [orders]);

  const statCards = [
    { label: 'Total Revenue', value: `₦${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Tickets Sold', value: totalSold.toLocaleString(), icon: Ticket, color: 'text-gold-500', bg: 'bg-gold-500/10' },
    { label: 'Conversion Rate', value: `${conversionRate}%`, icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { label: 'Check-ins Today', value: String(checkinsToday), icon: QrCode, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Avg Ticket Price', value: `₦${avgPrice.toLocaleString()}`, icon: BarChart3, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  ];

  const maxTypeRevenue = Math.max(...(salesByType?.map(t => t.revenue) ?? [1]), 1);

  return (
    <div className="space-y-8">
      <div>
        <Breadcrumbs />
        <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Analytics</h1>
        <p className="text-dark-400">Insights into your ticketing performance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="p-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`h-7 w-7 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
                  </div>
                  <p className="text-[10px] font-bold text-dark-500 uppercase tracking-[0.2em]">{stat.label}</p>
                </div>
                <h3 className="text-2xl font-serif text-white">{stat.value}</h3>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sales by Ticket Type</CardTitle>
          </CardHeader>
          <CardContent>
            {!salesByType || salesByType.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center">
                <BarChart3 className="h-8 w-8 text-dark-600 mb-2" />
                <p className="text-xs text-dark-500">No sales data yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {salesByType.map((t) => (
                  <div key={t.name} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white">{t.name}</span>
                      <span className="text-xs text-dark-400">₦{t.revenue.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold-500 rounded-full transition-all"
                        style={{ width: `${(t.revenue / maxTypeRevenue) * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-dark-500">
                      <span>{t.sold} tickets</span>
                      <span>{t.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sales by Day</CardTitle>
            <p className="text-xs text-dark-500">Last 30 days</p>
          </CardHeader>
          <CardContent>
            {!dailySales || dailySales.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center">
                <BarChart3 className="h-8 w-8 text-dark-600 mb-2" />
                <p className="text-xs text-dark-500">No daily data yet</p>
              </div>
            ) : (
              <div>
                <div className="flex items-end gap-1 h-32 mb-3">
                  {dailySales.slice(-30).map((d) => {
                    const maxCount = Math.max(...dailySales.map(x => x.count), 1);
                    return (
                      <div
                        key={d.date}
                        className="flex-1 bg-gold-500/60 rounded-t hover:bg-gold-500 transition-colors"
                        style={{ height: `${Math.max(2, (d.count / maxCount) * 128)}px` }}
                        title={`${d.date}: ${d.count} orders, ₦${d.revenue.toLocaleString()}`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between text-[10px] text-dark-500">
                  <span>{dailySales[0]?.date}</span>
                  <span>{dailySales[dailySales.length - 1]?.date}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-4 w-4 text-gold-500" /> Top Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topEvents.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-8 w-8 text-dark-600 mx-auto mb-3" />
              <p className="text-sm text-dark-400">No event sales data yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="pb-3 text-[10px] font-bold text-dark-500 uppercase tracking-widest">#</th>
                    <th className="pb-3 text-[10px] font-bold text-dark-500 uppercase tracking-widest">Event</th>
                    <th className="pb-3 text-[10px] font-bold text-dark-500 uppercase tracking-widest text-center">Tickets Sold</th>
                    <th className="pb-3 text-[10px] font-bold text-dark-500 uppercase tracking-widest text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topEvents.map((event, i) => (
                    <tr key={event.title} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                      <td className="py-3 text-sm text-dark-400">{i + 1}</td>
                      <td className="py-3 text-sm text-white font-medium">{event.title}</td>
                      <td className="py-3 text-center text-sm text-white">{event.sold}</td>
                      <td className="py-3 text-right text-sm text-white">₦{event.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
