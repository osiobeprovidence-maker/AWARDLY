import React from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../lib/convex-auth';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../lib/toast';
import { Vote, Loader2, TrendingUp, AlertTriangle, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartContainer } from '../../components/ui/ChartContainer';

export function AdminVoting() {
  const { user } = useAuth();
  const { toast } = useToast();

  const voting = useQuery(
    api.admin.queries.getVotingCenter,
    user?.id ? { firebaseUid: user.id } : 'skip'
  );

  const blockVote = useMutation(api.admin.mutations.blockVote);

  if (!voting) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 text-gold-500 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-white tracking-tight">Voting Center</h1>
        <p className="text-dark-400 text-sm mt-1">Global voting monitor and fraud detection</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Votes', value: voting.totalVotes.toLocaleString(), icon: Vote, color: 'text-sky-400', bg: 'bg-sky-500/10' },
          { label: 'Paid Votes', value: voting.paidVotes.toLocaleString(), icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Free Votes', value: voting.freeVotes.toLocaleString(), icon: CheckCircle2, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'Suspicious', value: voting.suspiciousVotes.toLocaleString(), icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2">{stat.label}</p>
                  <h3 className="text-2xl font-serif text-white">{stat.value}</h3>
                </div>
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Votes (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {voting.votesChart.length > 0 ? (
                <ChartContainer height={250}>
                  <BarChart data={voting.votesChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#5d5d5d" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#5d5d5d" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: 12 }} />
                    <Bar dataKey="votes" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-dark-500 text-sm">No vote data yet</div>
              )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/50">
              <span className="text-xs text-dark-400">Unique IPs</span>
              <span className="text-xs text-white font-medium">{voting.uniqueIPs.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/50">
              <span className="text-xs text-dark-400">Paid Vote Value</span>
              <span className="text-xs text-white font-medium">₦{voting.paidVoteValue.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/50">
              <span className="text-xs text-dark-400">Total Vote Quantity</span>
              <span className="text-xs text-white font-medium">{voting.totalVoteQuantity.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Votes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold text-dark-500 uppercase tracking-[0.2em] border-b border-white/5">
                  <th className="px-6 py-3">Vote ID</th>
                  <th className="px-6 py-3">Quantity</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">IP</th>
                  <th className="px-6 py-3">Time</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {voting.recentVotes.map((vote: any) => (
                  <tr key={vote._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-3 text-xs text-dark-400 font-mono">{vote._id.slice(0, 12)}...</td>
                    <td className="px-6 py-3 text-sm text-white">{vote.quantity}</td>
                    <td className="px-6 py-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${vote.isPaid ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-dark-400'}`}>
                        {vote.isPaid ? 'Paid' : 'Free'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-xs text-dark-500 font-mono">{vote.ipAddress || 'N/A'}</td>
                    <td className="px-6 py-3 text-xs text-dark-500">{new Date(vote.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-3">
                      <button onClick={() => { if (confirm('Block this vote?')) { blockVote({ firebaseUid: user?.id, voteId: vote._id }); toast('Vote blocked', 'success'); } }}
                        className="h-7 px-2.5 rounded-lg bg-rose-500/10 text-rose-400 text-xs hover:bg-rose-500/20 transition-all flex items-center gap-1">
                        <Trash2 className="h-3 w-3" /> Block
                      </button>
                    </td>
                  </tr>
                ))}
                {voting.recentVotes.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-dark-500 text-sm">No votes yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
