import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Breadcrumbs } from '../../../components/ui/Breadcrumbs';
import { useAuth } from '../../../lib/convex-auth';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Search, Users, Mail, Phone } from 'lucide-react';

export function TicketCustomers() {
  const { currentOrg } = useAuth();
  const [search, setSearch] = useState('');

  const customers = useQuery(
    api.ticketing.mutations.getCustomers,
    currentOrg ? { orgId: currentOrg.id as any } : 'skip'
  ) ?? [];

  const filtered = useMemo(() => {
    if (!search.trim()) return customers;
    const q = search.toLowerCase();
    return customers.filter(
      c => c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone && c.phone.toLowerCase().includes(q))
    );
  }, [customers, search]);

  return (
    <div className="space-y-8">
      <div>
        <Breadcrumbs />
        <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Customers</h1>
        <p className="text-dark-400">View attendees who have purchased tickets.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gold-500" /> All Customers ({filtered.length})
          </CardTitle>
          <div className="w-full md:w-72">
            <Input
              icon={Search}
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Users className="h-12 w-12 text-dark-600 mx-auto mb-4" />
              <h3 className="text-lg font-serif text-white mb-2">No customers yet</h3>
              <p className="text-sm text-dark-400">
                {search ? 'Try a different search term.' : 'Customer data will appear once tickets are purchased.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="pb-3 text-[10px] font-bold text-dark-500 uppercase tracking-widest">Name</th>
                    <th className="pb-3 text-[10px] font-bold text-dark-500 uppercase tracking-widest">Email</th>
                    <th className="pb-3 text-[10px] font-bold text-dark-500 uppercase tracking-widest">Phone</th>
                    <th className="pb-3 text-[10px] font-bold text-dark-500 uppercase tracking-widest text-center">Tickets Purchased</th>
                    <th className="pb-3 text-[10px] font-bold text-dark-500 uppercase tracking-widest text-center">Events Attended</th>
                    <th className="pb-3 text-[10px] font-bold text-dark-500 uppercase tracking-widest text-right">Lifetime Spend</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((customer) => (
                    <tr key={customer.email} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gold-500/10 flex items-center justify-center text-xs font-bold text-gold-500">
                            {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="text-sm font-medium text-white">{customer.name}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1.5 text-sm text-dark-300">
                          <Mail className="h-3 w-3 text-dark-500" />
                          {customer.email}
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1.5 text-sm text-dark-400">
                          {customer.phone && <Phone className="h-3 w-3 text-dark-500" />}
                          {customer.phone ?? '—'}
                        </div>
                      </td>
                      <td className="py-3 text-center text-sm text-white">{customer.totalOrders}</td>
                      <td className="py-3 text-center text-sm text-white">{customer.eventCount}</td>
                      <td className="py-3 text-right text-sm text-white font-medium">₦{customer.totalSpent.toLocaleString()}</td>
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
