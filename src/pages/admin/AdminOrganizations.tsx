import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../lib/convex-auth';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../lib/toast';
import {
  Building2, Search, ShieldCheck, Ban, CheckCircle2, XCircle,
  ChevronDown, Loader2, ExternalLink, MoreHorizontal, Eye, Trash2
} from 'lucide-react';

export function AdminOrganizations() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const orgs = useQuery(
    api.admin.queries.getOrgDirectory,
    user?.id ? { firebaseUid: user.id } : 'skip'
  );

  const suspendOrg = useMutation(api.admin.mutations.suspendOrg);
  const unsuspendOrg = useMutation(api.admin.mutations.unsuspendOrg);
  const verifyOrg = useMutation(api.admin.mutations.verifyOrg);
  const unverifyOrg = useMutation(api.admin.mutations.unverifyOrg);
  const updateOrgPlan = useMutation(api.admin.mutations.updateOrgPlan);

  if (!orgs) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 text-gold-500 animate-spin" /></div>;
  }

  const filtered = orgs.filter((o: any) => {
    const matchesSearch = o.name.toLowerCase().includes(search.toLowerCase()) || o.slug?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'suspended' ? o.isDeleted : !o.isDeleted);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-white tracking-tight">Organizations</h1>
        <p className="text-dark-400 text-sm mt-1">Manage all organizations on the platform</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-80">
          <Input
            placeholder="Search organizations..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 text-xs"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'suspended'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                statusFilter === status
                  ? 'bg-gold-500 text-dark-950'
                  : 'bg-white/5 text-dark-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-dark-500 uppercase tracking-[0.2em] border-b border-white/5">
                <th className="px-6 py-4">Organization</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Events</th>
                <th className="px-6 py-4">Revenue</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((org: any) => (
                <tr key={org._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-dark-800 rounded-xl border border-white/5 flex items-center justify-center font-serif text-gold-500 text-sm shrink-0">
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
                  <td className="px-6 py-4 text-xs text-dark-300 capitalize">{org.type || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded border ${
                      org.plan === 'enterprise' ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5' :
                      org.plan === 'professional' ? 'border-gold-500/30 text-gold-400 bg-gold-500/5' :
                      'border-white/10 text-dark-300'
                    }`}>
                      {org.plan === 'none' ? 'Free' : org.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-dark-300">{org.eventCount}</td>
                  <td className="px-6 py-4 text-sm text-white font-medium">₦{org.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`h-2 w-2 rounded-full inline-block mr-2 ${org.isDeleted ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                    <span className="text-xs text-dark-300">{org.isDeleted ? 'Suspended' : 'Active'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === org._id ? null : org._id)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 text-dark-400 hover:text-white transition-all"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {openMenu === org._id && (
                        <div className="absolute right-0 top-10 z-50 w-48 bg-dark-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                          <a href={`/org/${org.slug}`} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2.5 text-xs text-dark-300 hover:text-white hover:bg-white/5 transition-all">
                            <ExternalLink className="h-3.5 w-3.5" /> View Public Profile
                          </a>
                          <button onClick={() => { verifyOrg({ firebaseUid: user?.id, orgId: org._id }); toast('Organization verified', 'success'); setOpenMenu(null); }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-dark-300 hover:text-white hover:bg-white/5 transition-all text-left">
                            <ShieldCheck className="h-3.5 w-3.5" /> Verify
                          </button>
                          <button onClick={() => { updateOrgPlan({ firebaseUid: user?.id, orgId: org._id, plan: 'professional' }); toast('Upgraded to Professional', 'success'); setOpenMenu(null); }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-dark-300 hover:text-white hover:bg-white/5 transition-all text-left">
                            <ChevronDown className="h-3.5 w-3.5" /> Upgrade Plan
                          </button>
                          {org.isDeleted ? (
                            <button onClick={() => { unsuspendOrg({ firebaseUid: user?.id, orgId: org._id }); toast('Organization restored', 'success'); setOpenMenu(null); }}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-emerald-400 hover:bg-emerald-500/5 transition-all text-left">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Restore
                            </button>
                          ) : (
                            <button onClick={() => { if (confirm('Suspend this organization?')) { suspendOrg({ firebaseUid: user?.id, orgId: org._id, reason: 'Admin action' }); toast('Organization suspended', 'success'); setOpenMenu(null); } }}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-500/5 transition-all text-left">
                              <Ban className="h-3.5 w-3.5" /> Suspend
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-dark-500 text-sm">
                    {search ? 'No organizations match your search' : 'No organizations yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
