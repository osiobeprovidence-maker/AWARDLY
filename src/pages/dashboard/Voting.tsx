import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { Vote, Users, Search, Filter, Trophy, CheckCircle } from 'lucide-react';
import { useAuth } from '../../lib/convex-auth';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useToast } from '../../lib/toast';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';

export function DashboardVoting() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentOrg } = useAuth();
  const nominees = useQuery(
    api.nominees.queries.getByOrg,
    currentOrg ? { orgId: currentOrg.id as any } : 'skip'
  ) ?? [];
  const sortedNominees = [...nominees].sort((a, b) => b.voteCount - a.voteCount);
  const totalVotes = nominees.reduce((acc, n) => acc + n.voteCount, 0);
  return (
    <div className="space-y-8">
      <div>
        <Breadcrumbs />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Nominations & Voting</h1>
          <p className="text-dark-400">Review public nominations and monitor real-time vote counts.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/dashboard/voting/settings')}>Nomination Settings</Button>
          <Button variant="outline" onClick={() => window.open(`/org/${currentOrg?.slug}`, '_blank')}>View Voting Page</Button>
          <Button onClick={() => navigate('/dashboard/monetization')}>Configure Packages</Button>
        </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gold-500/5 border-gold-500/20">
          <CardContent>
            <p className="text-dark-400 text-xs uppercase tracking-widest mb-2">Total Votes Cast</p>
            <h3 className="text-4xl font-serif text-gold-400">{totalVotes.toLocaleString()}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-dark-400 text-xs uppercase tracking-widest mb-2">Pending Nominations</p>
            <h3 className="text-4xl font-serif text-white">0</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-dark-400 text-xs uppercase tracking-widest mb-2">Total Nominees</p>
            <h3 className="text-4xl font-serif text-white">{nominees.length}</h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Leaderboard */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Global Leaderboard</CardTitle>
              <CardDescription>Top trending nominees across all categories</CardDescription>
            </div>
            <div className="flex gap-2">
               <Button variant="ghost" size="icon" onClick={() => toast('Leaderboard filters coming soon', 'info')}><Filter className="h-4 w-4" /></Button>
               <Button variant="ghost" size="icon" onClick={() => toast('Search nominees coming soon', 'info')}><Search className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 px-4 pb-4">
             <div className="space-y-1">
               {sortedNominees.map((nominee, i) => (
                 <div key={nominee._id} className="flex items-center p-4 hover:bg-white/5 transition-colors rounded-xl group cursor-pointer" onClick={() => toast(`Details for ${nominee.name}`, 'info')}>
                   <div className="w-8 text-dark-500 font-serif text-lg">0{i+1}</div>
                   <img src={nominee.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${nominee.name}`} className="h-12 w-12 rounded-lg object-cover" alt={nominee.name} referrerPolicy="no-referrer" />
                    <div className="ml-4 flex-1">
                       <h4 className="text-white font-medium text-sm">{nominee.name}</h4>
                       <p className="text-[10px] text-dark-500 uppercase tracking-widest">Nominee</p>
                   </div>
                   <div className="text-right">
                      <div className="text-white font-medium">{nominee.voteCount.toLocaleString()}</div>
                      <div className="text-[10px] text-emerald-500">Trending</div>
                   </div>
                 </div>
               ))}
             </div>
              <Button variant="ghost" className="w-full mt-4 text-dark-400" onClick={() => toast('Full leaderboard view coming soon', 'info')}>View Full Leaderboard</Button>
          </CardContent>
        </Card>

        {/* Categories shortcut */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
               <CardTitle className="text-lg">Category Pulse</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               {sortedNominees.length === 0 ? (
                 <div className="text-center py-4">
                   <p className="text-sm text-dark-500">No nominees to display</p>
                 </div>
               ) : (
                 sortedNominees.slice(0, 3).map((nominee) => {
                   const fill = totalVotes > 0 ? Math.round((nominee.voteCount / totalVotes) * 100) : 0;
                   return (
                     <div key={nominee._id} className="space-y-2 group cursor-pointer">
                      <div className="flex justify-between text-xs transition-colors group-hover:text-gold-500">
                        <span className="text-dark-300 group-hover:text-gold-400 transition-colors">{nominee.name}</span>
                        <span className="text-white">{nominee.voteCount.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 w-full bg-dark-800 rounded-full overflow-hidden">
                         <div className="h-full bg-gold-500 rounded-full transition-all group-hover:bg-gold-400" style={{ width: `${fill}%` }} />
                      </div>
                     </div>
                   );
                 })
               )}
            </CardContent>
          </Card>

          <Card className="bg-emerald-500/5 border-emerald-500/20">
            <CardContent className="flex items-center gap-4 py-4">
              <div className="p-3 bg-emerald-500/10 rounded-full">
                <CheckCircle className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <h4 className="text-white font-medium text-sm">Voting Active</h4>
                <p className="text-xs text-dark-400">Configure payment gateways in Monetization</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
