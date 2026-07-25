import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, UserPlus, Mail, MoreHorizontal, Filter, ArrowUpRight, TrendingUp, Users, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { useToast } from '../../lib/toast';
import { useAuth } from '../../lib/convex-auth';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export function Followers() {
  const [search, setSearch] = React.useState('');
  const [sortBy, setSortBy] = React.useState('recent');
  const { toast } = useToast();
  const { currentOrg } = useAuth();

  const followers = useQuery(
    api.followers.queries.getFollowers,
    currentOrg ? { orgId: currentOrg.id as any } : 'skip'
  ) ?? [];

  const filtered = followers
    .filter(f => {
      if (!f.user) return false;
      const q = search.toLowerCase();
      return f.user.name.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === 'recent') return (b.createdAt ?? '').localeCompare(a.createdAt ?? '');
      return 0;
    });

  if (!currentOrg) {
    return <div className="text-center py-20 text-dark-400">Select an organization first.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <Breadcrumbs />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 overflow-hidden">
        <div>
          <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Community & Followers</h1>
          <p className="text-dark-400">Deep dive into your audience and community growth.</p>
        </div>
        <Button variant="outline" onClick={() => toast('Audience list exported as CSV', 'success')}>
          <Mail className="h-4 w-4 mr-2" /> Export Audience
        </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card>
            <CardContent className="flex items-center gap-4">
               <div className="p-3 bg-gold-500/10 rounded-full border border-gold-500/20">
                  <TrendingUp className="h-6 w-6 text-gold-500" />
               </div>
               <div>
                  <p className="text-xs text-dark-500 font-bold uppercase tracking-widest">Total Followers</p>
                  <h3 className="text-2xl font-serif text-white">{currentOrg.followerCount.toLocaleString()}</h3>
               </div>
            </CardContent>
         </Card>
         <Card>
            <CardContent className="flex items-center gap-4">
               <div className="p-3 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                  <UserPlus className="h-6 w-6 text-emerald-500" />
               </div>
               <div>
                  <p className="text-xs text-dark-500 font-bold uppercase tracking-widest">Followers Listed</p>
                  <h3 className="text-2xl font-serif text-white">{followers.length}</h3>
               </div>
            </CardContent>
         </Card>
         <Card>
            <CardContent className="flex items-center gap-4">
               <div className="p-3 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                  <Users className="h-6 w-6 text-indigo-500" />
               </div>
               <div>
                  <p className="text-xs text-dark-500 font-bold uppercase tracking-widest">Team Members</p>
                  <h3 className="text-2xl font-serif text-white">{currentOrg.memberCount}</h3>
               </div>
            </CardContent>
         </Card>
      </div>

      {/* Followers Table */}
      <Card>
         <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full max-w-md">
               <Input icon={Search} placeholder="Search followers by name..." className="h-10 text-xs" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
               <select className="bg-dark-900 border border-white/10 rounded-lg px-4 h-10 text-xs text-white outline-none" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="recent">Recent Followers</option>
               </select>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="text-[10px] font-bold text-dark-500 uppercase tracking-[0.2em] border-b border-white/5">
                     <th className="px-6 py-5">Follower</th>
                     <th className="px-6 py-5">Follow Date</th>
                     <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                   {filtered.length === 0 ? (
                     <tr>
                       <td colSpan={3} className="px-6 py-16 text-center">
                         <Users className="h-12 w-12 text-dark-500 mx-auto mb-4" />
                         <p className="text-dark-400">
                           {followers.length === 0 ? 'No followers yet. Share your hub to grow your audience.' : 'No followers match your search.'}
                         </p>
                       </td>
                     </tr>
                   ) : (
                     filtered.map((f) => (
                       <motion.tr 
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         key={f._id} 
                         className="group hover:bg-white/5 transition-colors"
                       >
                          <td className="px-6 py-5">
                             <div className="flex items-center gap-3">
                                <div className="h-9 w-9 bg-dark-800 rounded-lg border border-white/5 flex items-center justify-center text-sm font-serif text-gold-500">
                                   {f.user?.name?.[0] ?? '?'}
                                </div>
                                <div>
                                   <h4 className="text-white text-sm font-medium">{f.user?.name ?? 'Unknown'}</h4>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-5 text-xs text-dark-300">
                             {f.createdAt ? new Date(f.createdAt).toLocaleDateString() : 'Unknown'}
                          </td>
                          <td className="px-6 py-5 text-right">
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-dark-500 hover:text-white">
                                <MoreHorizontal className="h-4 w-4" />
                             </Button>
                          </td>
                       </motion.tr>
                     ))
                   )}
               </tbody>
            </table>
         </div>
      </Card>
    </div>
  );
}
