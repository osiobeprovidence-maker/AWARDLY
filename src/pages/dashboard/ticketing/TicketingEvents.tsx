import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Breadcrumbs } from '../../../components/ui/Breadcrumbs';
import { useAuth } from '../../../lib/convex-auth';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Ticket, Eye, Settings, ExternalLink } from 'lucide-react';

export function TicketingEvents() {
  const { currentOrg } = useAuth();

  const orgEvents = useQuery(
    api.events.queries.getByOrg,
    currentOrg ? { orgId: currentOrg.id as any } : 'skip'
  ) ?? [];

  const orders = useQuery(
    api.ticketing.mutations.getOrdersByOrg,
    currentOrg ? { orgId: currentOrg.id as any } : 'skip'
  ) ?? [];

  const eventStats = orgEvents.map((event) => {
    const eventOrders = orders.filter(o => o.eventId === event._id);
    const successfulOrders = eventOrders.filter(o => o.paymentStatus === 'successful');
    const ticketsSold = successfulOrders.reduce((sum, o) => sum + o.quantity, 0);
    const revenue = successfulOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    let status: 'Active' | 'Draft' | 'Completed' = 'Draft';
    if (event.status === 'published' || event.status === 'live') status = 'Active';
    else if (event.status === 'closed' || event.status === 'archived') status = 'Completed';

    return {
      id: event._id,
      title: event.title,
      date: event.date,
      ticketsSold,
      revenue,
      status,
      hasTicketing: !!event.ticketing,
    };
  });

  const statusColors: Record<string, string> = {
    Active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Draft: 'bg-dark-800 text-dark-400 border-white/10',
    Completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  return (
    <div className="space-y-8">
      <div>
        <Breadcrumbs />
        <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Events</h1>
        <p className="text-dark-400">Manage ticketing for your events.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Events</CardTitle>
        </CardHeader>
        <CardContent>
          {eventStats.length === 0 ? (
            <div className="text-center py-16">
              <Ticket className="h-12 w-12 text-dark-600 mx-auto mb-4" />
              <h3 className="text-lg font-serif text-white mb-2">No events yet</h3>
              <p className="text-sm text-dark-400 mb-6">Create an event to start selling tickets.</p>
              <Link to="/dashboard/events/create">
                <Button>Create Event</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="pb-3 text-[10px] font-bold text-dark-500 uppercase tracking-widest">Event</th>
                    <th className="pb-3 text-[10px] font-bold text-dark-500 uppercase tracking-widest text-right">Tickets Sold</th>
                    <th className="pb-3 text-[10px] font-bold text-dark-500 uppercase tracking-widest text-right">Revenue</th>
                    <th className="pb-3 text-[10px] font-bold text-dark-500 uppercase tracking-widest text-center">Status</th>
                    <th className="pb-3 text-[10px] font-bold text-dark-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {eventStats.map((event) => (
                    <tr key={event.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="py-4">
                        <div>
                          <p className="text-sm font-medium text-white">{event.title}</p>
                          <p className="text-xs text-dark-500">{event.date}</p>
                        </div>
                      </td>
                      <td className="py-4 text-right text-sm text-white">{event.ticketsSold}</td>
                      <td className="py-4 text-right text-sm text-white">₦{event.revenue.toLocaleString()}</td>
                      <td className="py-4 text-center">
                        <span className={`inline-flex px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full border ${statusColors[event.status]}`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/dashboard/ticketing/orders`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-3.5 w-3.5 mr-1" /> View Orders
                            </Button>
                          </Link>
                          {event.hasTicketing && (
                            <Button variant="outline" size="sm">
                              <Settings className="h-3.5 w-3.5 mr-1" /> Manage Tickets
                            </Button>
                          )}
                        </div>
                      </td>
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
