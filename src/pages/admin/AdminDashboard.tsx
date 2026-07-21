import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Building2, Users, ShieldCheck, TrendingUp, AlertTriangle, Search, Filter, MoreVertical, ExternalLink, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const platformData = [
  { name: 'W1', rev: 12000, orgs: 20 },
  { name: 'W2', rev: 15000, orgs: 28 },
  { name: 'W3', rev: 28000, orgs: 45 },
  { name: 'W4', rev: 32000, orgs: 62 },
  { name: 'W5', rev: 45000, orgs: 84 },
  { name: 'W6', rev: 52000, orgs: 110 },
];

export function AdminDashboard() {
  return (
    <div className="min-h-screen bg-dark-950 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 overflow-hidden">
          <div>
            <div className="flex items-center text-emerald-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
              Platform Superadmin
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight leading-tight">Master Control</h1>
          </div>
          <div className="flex gap-3">
             <Button variant="glass"><Activity className="h-4 w-4 mr-2" /> System Health</Button>
             <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]">Broadcast Alerts</Button>
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { label: 'Active Organizations', val: '152', icon: Building2, color: 'text-gold-500' },
             { label: 'Registered Users', val: '2.4M', icon: Users, color: 'text-indigo-400' },
             { label: 'Total Volume', val: '$1.4M', icon: ShieldCheck, color: 'text-emerald-400' },
             { label: 'Pending Approvals', val: '12', icon: AlertTriangle, color: 'text-amber-400' },
           ].map((stat, i) => (
             <Card key={i}>
                <CardContent className="p-0">
                   <div className="flex justify-between items-start">
                      <div>
                         <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2">{stat.label}</p>
                         <h3 className="text-3xl font-serif text-white">{stat.val}</h3>
                      </div>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                   </div>
                </CardContent>
             </Card>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Revenue Chart */}
           <Card className="lg:col-span-2">
              <CardHeader>
                 <CardTitle>Global Revenue & Ecosystem Growth</CardTitle>
                 <CardDescription>Tracking platform-wide transaction volume and organization onboardings.</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px] mt-8">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={platformData}>
                      <defs>
                        <linearGradient id="ecosystem" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="name" stroke="#5d5d5d" fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis stroke="#5d5d5d" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                      <Tooltip 
                         contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)' }}
                         itemStyle={{ color: '#6366f1' }}
                      />
                      <Area type="monotone" dataKey="rev" stroke="#6366f1" strokeWidth={3} fill="url(#ecosystem)" />
                    </AreaChart>
                </ResponsiveContainer>
              </CardContent>
           </Card>

           {/* Top Performing Orgs */}
           <Card>
              <CardHeader className="pb-2">
                 <CardTitle className="text-xl">Top Hubs</CardTitle>
                 <CardDescription>Most active organizations by volume</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="divide-y divide-white/5">
                    {[
                      { name: 'Headies Official', volume: '$420,500', users: '154k' },
                      { name: 'Tech Awards Africa', volume: '$210,000', users: '45k' },
                      { name: 'Gospel Honors', volume: '$125,000', users: '32k' },
                      { name: 'Campus Excellence', volume: '$85,000', users: '28k' },
                    ].map((org) => (
                      <div key={org.name} className="p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                         <div className="flex justify-between items-center mb-1">
                            <h4 className="text-white text-sm font-medium group-hover:text-gold-400 transition-colors">{org.name}</h4>
                            <span className="text-indigo-400 font-medium text-xs font-serif">{org.volume}</span>
                         </div>
                         <div className="text-[10px] text-dark-500 uppercase tracking-widest">{org.users} Active Followers</div>
                      </div>
                    ))}
                 </div>
                 <Button variant="ghost" className="w-full mt-4 text-xs font-bold text-dark-400 uppercase tracking-widest">Explore All Hubs</Button>
              </CardContent>
           </Card>
        </div>

        {/* Organizations Table */}
        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-2xl font-serif text-white">Hub Directory</h2>
              <div className="flex gap-3">
                 <div className="w-64"><Input placeholder="Search Hubs..." icon={Search} className="h-10 text-xs" /></div>
                 <Button variant="outline" size="sm"><Filter className="h-4 w-4" /></Button>
              </div>
           </div>
           
           <Card className="p-0">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="text-[10px] font-bold text-dark-500 uppercase tracking-[0.2em] border-b border-white/5">
                          <th className="px-6 py-5">Hub Details</th>
                          <th className="px-6 py-5">Plan</th>
                          <th className="px-6 py-5">Activity</th>
                          <th className="px-6 py-5">Status</th>
                          <th className="px-6 py-5 text-right">Control</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {[
                          { name: 'Headies Official', slug: 'headies', plan: 'Enterprise', status: 'Active', growth: '+12%' },
                          { name: 'Tech Awards Africa', slug: 'techawards', plan: 'Pro', status: 'Active', growth: '+8%' },
                          { name: 'Campus Awards', slug: 'campus-excellence', plan: 'Starter', status: 'Suspended', growth: '-4%' },
                        ].map((hub) => (
                           <tr key={hub.slug} className="hover:bg-white/5 transition-colors">
                              <td className="px-6 py-5">
                                 <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-dark-800 rounded-xl border border-white/5 flex items-center justify-center font-serif text-gold-500">{hub.name[0]}</div>
                                    <div>
                                       <h4 className="text-white text-sm font-medium">{hub.name}</h4>
                                       <p className="text-dark-500 text-xs">hub/{hub.slug}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-5">
                                 <span className={`text-xs font-medium px-2 py-1 rounded border ${hub.plan === 'Enterprise' ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5' : 'border-white/10 text-dark-300'}`}>{hub.plan}</span>
                              </td>
                              <td className="px-6 py-5">
                                 <div className="flex items-center text-xs">
                                    <TrendingUp className={`h-3 w-3 mr-1.5 ${hub.growth.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`} />
                                    <span className={hub.growth.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}>{hub.growth}</span>
                                 </div>
                              </td>
                              <td className="px-6 py-5">
                                 <span className={`h-2 w-2 rounded-full inline-block mr-2 ${hub.status === 'Active' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                                 <span className="text-xs text-dark-300">{hub.status}</span>
                              </td>
                              <td className="px-6 py-5 text-right">
                                 <div className="flex items-center justify-end gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8"><ExternalLink className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-dark-500"><MoreVertical className="h-4 w-4" /></Button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                    </tbody>
                 </table>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
