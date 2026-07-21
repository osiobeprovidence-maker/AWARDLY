import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, UserPlus, Mail, MoreHorizontal, Filter, ArrowUpRight, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { useToast } from '../../lib/toast';

const followers = [
  { id: 1, name: 'Tobi Adeyemi', email: 'tobi@example.com', date: '2 hours ago', activity: 'High', votes: 124 },
  { id: 2, name: 'Sarah Nelson', email: 'sarah.n@design.co', date: '5 hours ago', activity: 'Medium', votes: 42 },
  { id: 3, name: 'Chinelo Okafor', email: 'chinelo@tech.ng', date: '1 day ago', activity: 'High', votes: 890 },
  { id: 4, name: 'Marcus Wright', email: 'marcus@wright.com', date: '1 day ago', activity: 'New', votes: 0 },
  { id: 5, name: 'Aisha Bello', email: 'aisha@music.com', date: '2 days ago', activity: 'Medium', votes: 15 },
];

export function Followers() {
  const [search, setSearch] = React.useState('');
  const [sortBy, setSortBy] = React.useState('recent');
  const { toast } = useToast();

  const filtered = followers
    .filter(f => f.name.toLowerCase().includes(search.toLowerCase()) || f.email.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'votes') return b.votes - a.votes;
      if (sortBy === 'active') return a.activity === 'High' ? -1 : 1;
      return 0;
    });

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
                  <p className="text-xs text-dark-500 font-bold uppercase tracking-widest">Growth Retention</p>
                  <h3 className="text-2xl font-serif text-white">84.2%</h3>
               </div>
            </CardContent>
         </Card>
         <Card>
            <CardContent className="flex items-center gap-4">
               <div className="p-3 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                  <UserPlus className="h-6 w-6 text-emerald-500" />
               </div>
               <div>
                  <p className="text-xs text-dark-500 font-bold uppercase tracking-widest">New Today</p>
                  <h3 className="text-2xl font-serif text-white">+1,240</h3>
               </div>
            </CardContent>
         </Card>
         <Card>
            <CardContent className="flex items-center gap-4">
               <div className="p-3 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                  <ArrowUpRight className="h-6 w-6 text-indigo-500" />
               </div>
               <div>
                  <p className="text-xs text-dark-500 font-bold uppercase tracking-widest">Engagement Score</p>
                  <h3 className="text-2xl font-serif text-white">74 / 100</h3>
               </div>
            </CardContent>
         </Card>
      </div>

      {/* Followers Table */}
      <Card>
         <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full max-w-md">
               <Input icon={Search} placeholder="Search followers by name or email..." className="h-10 text-xs" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
               <Button variant="glass" size="icon" onClick={() => toast('Advanced filters coming soon', 'info')}><Filter className="h-4 w-4" /></Button>
               <select className="bg-dark-900 border border-white/10 rounded-lg px-4 h-10 text-xs text-white outline-none" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option>Recent Followers</option>
                  <option>Most Active</option>
                  <option>Top Voters</option>
               </select>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="text-[10px] font-bold text-dark-500 uppercase tracking-[0.2em] border-b border-white/5">
                     <th className="px-6 py-5">Follower</th>
                     <th className="px-6 py-5">Follow Date</th>
                     <th className="px-6 py-5">Engagement</th>
                     <th className="px-6 py-5">Votes Cast</th>
                     <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                   {filtered.map((f) => (
                     <motion.tr 
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       key={f.id} 
                       className="group hover:bg-white/5 transition-colors"
                     >
                        <td className="px-6 py-5">
                           <div className="flex items-center gap-3">
                              <div className="h-9 w-9 bg-dark-800 rounded-lg border border-white/5 flex items-center justify-center text-sm font-serif text-gold-500">
                                 {f.name[0]}
                              </div>
                              <div>
                                 <h4 className="text-white text-sm font-medium">{f.name}</h4>
                                 <p className="text-dark-500 text-xs">{f.email}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-5 text-xs text-dark-300">{f.date}</td>
                        <td className="px-6 py-5">
                           <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${
                             f.activity === 'High' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' :
                             f.activity === 'New' ? 'border-indigo-500/20 text-indigo-400 bg-indigo-500/5' :
                             'border-white/10 text-dark-400'
                           }`}>
                              {f.activity}
                           </span>
                        </td>
                        <td className="px-6 py-5 text-xs text-white font-medium">{f.votes.toLocaleString()}</td>
                        <td className="px-6 py-5 text-right">
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-dark-500 hover:text-white">
                              <MoreHorizontal className="h-4 w-4" />
                           </Button>
                        </td>
                     </motion.tr>
                  ))}
               </tbody>
            </table>
         </div>
         <div className="p-4 border-t border-white/5 flex justify-center">
            <Button variant="ghost" className="text-xs font-bold text-dark-400 uppercase tracking-widest" onClick={() => toast('Loading more followers...', 'info')}>Load More Followers</Button>
         </div>
      </Card>
    </div>
  );
}
