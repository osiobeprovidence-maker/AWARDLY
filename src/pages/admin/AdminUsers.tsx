import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../lib/convex-auth';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../lib/toast';
import { Users, Search, Loader2, ShieldCheck, MoreHorizontal, Ban, UserCheck, Mail } from 'lucide-react';

export function AdminUsers() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const users = useQuery(
    api.admin.queries.getUserDirectory,
    user?.id ? { firebaseUid: user.id } : 'skip'
  );

  const suspendUser = useMutation(api.admin.mutations.suspendUser);

  if (!users) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 text-gold-500 animate-spin" /></div>;
  }

  const filtered = users.filter((u: any) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-white tracking-tight">Users</h1>
        <p className="text-dark-400 text-sm mt-1">All registered users on the platform</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-80">
          <Input placeholder="Search users..." icon={Search} value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 text-xs" />
        </div>
        <div className="flex gap-2">
          {['all', 'user', 'admin', 'platform_admin'].map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${roleFilter === r ? 'bg-gold-500 text-dark-950' : 'bg-white/5 text-dark-400 hover:text-white'}`}>
              {r === 'all' ? 'All' : r.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-dark-500 uppercase tracking-[0.2em] border-b border-white/5">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Awards</th>
                <th className="px-6 py-4">Nominations</th>
                <th className="px-6 py-4">Organizations</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((u: any) => (
                <tr key={u._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gold-500 flex items-center justify-center text-dark-950 font-bold text-sm overflow-hidden shrink-0">
                        {u.avatarUrl ? <img src={u.avatarUrl} className="w-full h-full object-cover" alt="" /> : u.name?.[0] || '?'}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-white text-sm font-medium">{u.name}</h4>
                          {u.role === 'platform_admin' && <ShieldCheck className="h-3 w-3 text-gold-500" />}
                        </div>
                        <p className="text-dark-500 text-xs">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded border ${
                      u.role === 'platform_admin' ? 'border-gold-500/30 text-gold-400 bg-gold-500/5' :
                      u.role === 'admin' ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5' :
                      'border-white/10 text-dark-300'
                    }`}>
                      {u.role.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-dark-300">{u.awardsCount}</td>
                  <td className="px-6 py-4 text-sm text-dark-300">{u.nominationsCount}</td>
                  <td className="px-6 py-4 text-sm text-dark-300">{u.membershipCount}</td>
                  <td className="px-6 py-4 text-xs text-dark-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button onClick={() => setOpenMenu(openMenu === u._id ? null : u._id)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 text-dark-400 hover:text-white transition-all">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {openMenu === u._id && (
                        <div className="absolute right-0 top-10 z-50 w-48 bg-dark-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                          {u.role !== 'platform_admin' && (
                            <button onClick={() => { if (confirm('Suspend this user?')) { suspendUser({ firebaseUid: user?.id, targetUserId: u._id }); toast('User suspended', 'success'); setOpenMenu(null); } }}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-500/5 transition-all text-left">
                              <Ban className="h-3.5 w-3.5" /> Suspend User
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-dark-500 text-sm">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
