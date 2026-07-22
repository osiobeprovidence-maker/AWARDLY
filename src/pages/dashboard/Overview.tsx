import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Trophy, Users, Eye, ArrowUpRight, TrendingUp, DollarSign, 
  MessageSquare, Heart, PlusCircle, Radio, Image, Send, LayoutGrid, Clock, Vote
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';
import { useToast } from '../../lib/toast';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { useAuth } from '../../lib/auth';
import { mockEvents } from '../../data';

const engagementData = [
  { name: 'Mon', votes: 4000, views: 2400 },
  { name: 'Tue', votes: 3000, views: 1398 },
  { name: 'Wed', votes: 2000, views: 9800 },
  { name: 'Thu', votes: 2780, views: 3908 },
  { name: 'Fri', votes: 1890, views: 4800 },
  { name: 'Sat', votes: 2390, views: 3800 },
  { name: 'Sun', votes: 3490, views: 4300 },
];

const recentActivity = [
  { id: 1, type: 'nomination' as const, user: 'Sarah J.', event: 'Artiste of the Year', time: '2m ago' },
  { id: 2, type: 'follow' as const, user: 'BigWiz Hub', event: null, time: '15m ago' },
  { id: 3, type: 'vote' as const, user: 'Anonymous', event: 'Best Collaboration', time: '22m ago' },
  { id: 4, type: 'payment' as const, user: 'Org Upgrade', event: 'Starter to Pro', time: '1h ago' },
];

export function DashboardOverview() {
  const navigate = useNavigate();
  const [chartFilter, setChartFilter] = React.useState('Growth');
  const { toast } = useToast();
  const { currentOrg, user, currentRole, organizations } = useAuth();

  const orgEvents = currentOrg ? mockEvents.filter(e => e.orgId === currentOrg.id) : [];
  const activeEvent = orgEvents.find(e => e.isVotingActive);

  if (!currentOrg) {
    return (
      <div className="space-y-8 pb-20">
        <Breadcrumbs />
        <div className="text-center py-20">
          <Users className="h-16 w-16 text-dark-500 mx-auto mb-6" />
          <h1 className="text-3xl font-serif text-white mb-3">Welcome to Awardly</h1>
          <p className="text-dark-400 max-w-md mx-auto mb-8">
            {organizations.length === 0
              ? "Get started by creating your first organization."
              : "Select an organization from the sidebar to get started."}
          </p>
          {organizations.length === 0 && (
            <Button onClick={() => navigate('/onboarding')} size="lg" className="shadow-xl shadow-gold-500/20">
              <PlusCircle className="h-4 w-4 mr-2" /> Create Organization
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
           <Breadcrumbs />
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
             <h1 className="text-4xl font-serif text-white tracking-tight mb-2 italic">Welcome, {currentOrg.name}</h1>
             <p className="text-dark-400 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                {currentRole && <span className="text-gold-500 font-bold uppercase text-[10px] tracking-widest mr-2">{currentRole.replace('_', ' ')}</span>}
                Your community hub is seeing 15% more engagement today.
             </p>
           </motion.div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <Button variant="outline" className="flex-1 lg:flex-initial h-12 border-white/10" onClick={() => navigate('/dashboard/team')}>
             <Users className="h-4 w-4 mr-2" /> Team
          </Button>
          <Button variant="outline" className="flex-1 lg:flex-initial h-12 border-white/10" onClick={() => navigate('/dashboard/live')}>
             <Radio className="h-4 w-4 mr-2" /> Go Live
          </Button>
          <Button className="flex-1 lg:flex-initial h-12 shadow-xl shadow-gold-500/20" onClick={() => navigate('/dashboard/events/create')}>
             <Trophy className="h-4 w-4 mr-2" /> Create Event
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Followers', value: currentOrg.followerCount.toLocaleString(), change: '+12.5%', icon: Users, color: 'text-blue-400' },
          { title: 'Active Events', value: String(orgEvents.filter(e => e.status === 'published').length), change: `${orgEvents.length} total`, icon: Trophy, color: 'text-gold-500' },
          { title: 'Team Members', value: String(currentOrg.memberCount), change: currentRole === 'owner' ? 'Manage' : 'View', icon: Users, color: 'text-emerald-400' },
          { title: 'Total Votes', value: orgEvents.reduce((s, e) => s + (e.totalVotes || 0), 0).toLocaleString(), change: activeEvent ? 'Active' : 'None', icon: Vote, color: 'text-white' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="hover:border-gold-500/30 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <stat.icon className="h-16 w-16" />
              </div>
              <CardContent className="p-0">
                <p className="text-[10px] font-bold text-dark-500 uppercase tracking-[0.2em] mb-4">{stat.title}</p>
                <div className="flex items-end justify-between">
                   <h3 className="text-3xl font-serif text-white leading-none">{stat.value}</h3>
                   <div className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] font-bold text-emerald-400">{stat.change}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <Card className="bg-dark-900/40 border-white/5">
              <CardHeader className="flex flex-row items-center justify-between">
                 <div>
                    <CardTitle className="font-serif text-xl">Engagement Analytics</CardTitle>
                    <CardDescription>Real-time community interactions per day</CardDescription>
                 </div>
                 <div className="flex gap-2">
                    {['Growth', 'Reach'].map(f => (
                      <button key={f} onClick={() => setChartFilter(f)} className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${chartFilter === f ? 'bg-gold-500 text-dark-950 shadow-lg shadow-gold-500/20' : 'bg-white/5 border border-white/5 text-dark-400 hover:text-white'}`}>{f}</button>
                    ))}
                 </div>
              </CardHeader>
              <CardContent className="pt-6">
                 <div className="h-[340px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={engagementData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                       <defs>
                         <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#c68a35" stopOpacity={0.4}/>
                           <stop offset="95%" stopColor="#c68a35" stopOpacity={0}/>
                         </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                       <XAxis dataKey="name" stroke="#4f4f4f" fontSize={10} tickLine={false} axisLine={false} tick={{ transform: 'translate(0, 10)' }} />
                       <YAxis stroke="#4f4f4f" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                       <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }} itemStyle={{ color: '#fff', fontSize: '12px' }} cursor={{ stroke: 'rgba(198, 138, 53, 0.2)', strokeWidth: 20 }} />
                       <Area type="monotone" dataKey={chartFilter === 'Growth' ? 'votes' : 'views'} stroke="#c68a35" strokeWidth={3} fillOpacity={1} fill="url(#chartGradient)" />
                       <Area type="monotone" dataKey={chartFilter === 'Growth' ? 'views' : 'votes'} stroke="#4f4f4f" strokeWidth={2} fillOpacity={0} />
                     </AreaChart>
                   </ResponsiveContainer>
                 </div>
              </CardContent>
           </Card>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-gold-500/5 border-gold-500/10">
                 <CardHeader>
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-xl bg-gold-500 flex items-center justify-center text-dark-950 font-bold">
                          <PlusCircle className="h-5 w-5" />
                       </div>
                       <div>
                          <CardTitle className="text-lg">Quick Draft</CardTitle>
                          <CardDescription>Post a community update</CardDescription>
                       </div>
                    </div>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <textarea className="w-full bg-dark-950/50 border border-white/5 rounded-xl p-4 text-sm resize-none focus:border-gold-500/50 focus:outline-none h-24" placeholder="Say something to your followers..." />
                    <div className="flex justify-between items-center">
                       <div className="flex gap-2">
                          <Button variant="glass" size="icon" className="h-8 w-8"><Image className="h-4 w-4" /></Button>
                          <Button variant="glass" size="icon" className="h-8 w-8"><LayoutGrid className="h-4 w-4" /></Button>
                       </div>
                       <Button size="sm" className="px-6 h-8 text-[10px] font-bold uppercase tracking-widest" onClick={() => toast('Update shared with community!', 'success')}><Send className="h-3 w-3 mr-2" /> Share</Button>
                    </div>
                 </CardContent>
              </Card>

              <Card className="bg-dark-900/40">
                 <CardHeader>
                    <div className="flex items-center justify-between">
                       <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </div>
                 </CardHeader>
                 <CardContent className="space-y-3">
                    {[
                      { label: 'Create Event', icon: Trophy, to: '/dashboard/events/create' },
                      { label: 'Manage Team', icon: Users, to: '/dashboard/team' },
                      { label: 'View Analytics', icon: TrendingUp, to: '/dashboard/analytics' },
                      { label: 'Public Profile', icon: Eye, to: `/org/${currentOrg.slug}` },
                    ].map(a => (
                      <button key={a.label} onClick={() => navigate(a.to)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left group">
                        <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-gold-500/10 transition-colors">
                          <a.icon className="h-4 w-4 text-dark-500 group-hover:text-gold-500" />
                        </div>
                        <span className="text-sm text-dark-300 group-hover:text-white transition-colors">{a.label}</span>
                        <ArrowUpRight className="h-3 w-3 text-dark-500 group-hover:text-gold-500 ml-auto" />
                      </button>
                    ))}
                 </CardContent>
              </Card>
           </div>
        </div>

        <div className="space-y-8">
           {activeEvent && (
             <Card className="border-gold-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                   <Radio className="h-5 w-5 text-red-500 animate-pulse" />
                </div>
                <CardHeader>
                   <CardTitle className="text-lg font-serif">Event Spotlight</CardTitle>
                   <CardDescription>Current most active event</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="aspect-[4/3] rounded-2xl overflow-hidden relative mb-6 group cursor-pointer border border-white/5" onClick={() => navigate('/dashboard/events')}>
                      {activeEvent.coverUrl && <img src={activeEvent.coverUrl} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />}
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                         <h4 className="text-white font-serif text-xl mb-1 italic">{activeEvent.title}</h4>
                         <span className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">{activeEvent.status === 'published' ? 'Live' : 'Draft'}</span>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                         <p className="text-[8px] font-bold text-dark-500 uppercase tracking-widest mb-1">Total Votes</p>
                         <p className="text-white font-medium">{(activeEvent.totalVotes || 0).toLocaleString()}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                         <p className="text-[8px] font-bold text-dark-500 uppercase tracking-widest mb-1">Categories</p>
                         <p className="text-white font-medium">{activeEvent.categoryCount || 0}</p>
                      </div>
                   </div>
                   <Button className="w-full h-12 shadow-xl shadow-gold-500/10" onClick={() => navigate('/dashboard/events')}>Manage Events</Button>
                </CardContent>
             </Card>
           )}

           <Card className="bg-dark-950 border-white/5">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-white/5">
                 <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gold-500" /> Activity
                 </CardTitle>
                 <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-dark-500" onClick={() => navigate('/dashboard/analytics')}>Full Log</Button>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                 {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex gap-4 group">
                       <div className="h-2 w-2 rounded-full bg-gold-500/40 mt-1.5 group-hover:bg-gold-500 transition-colors" />
                       <div className="flex-1">
                          <p className="text-xs text-dark-300 leading-relaxed">
                             <span className="text-white font-bold">{activity.user}</span> 
                             {activity.type === 'nomination' && ' nominated a candidate in '}
                             {activity.type === 'follow' && ' followed your hub.'}
                             {activity.type === 'vote' && ' cast a vote for '}
                             {activity.type === 'payment' && ' upgraded subscription: '}
                             <span className="text-gold-500 italic font-serif ml-1">{activity.event}</span>
                          </p>
                          <span className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mt-1 block">{activity.time}</span>
                       </div>
                    </div>
                 ))}
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
