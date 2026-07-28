import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer } from '../../components/ui/ChartContainer';
import { TrendingUp, Users, DollarSign, Vote, Globe, Smartphone, BarChart3 } from 'lucide-react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { useAuth } from '../../lib/convex-auth';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export function DashboardAnalytics() {
  const [timeRange, setTimeRange] = React.useState('30D');
  const { currentOrg } = useAuth();

  const events = useQuery(
    api.events.queries.getByOrg,
    currentOrg ? { orgId: currentOrg.id as any } : 'skip'
  ) ?? [];

  const nominees = useQuery(
    api.nominees.queries.getByOrg,
    currentOrg ? { orgId: currentOrg.id as any } : 'skip'
  ) ?? [];

  const totalVotes = nominees.reduce((acc: number, n: any) => acc + (n.voteCount || 0), 0);
  const hasData = events.length > 0;

  const emptyVisitData = [
    { name: 'Mon', value: 0 },
    { name: 'Tue', value: 0 },
    { name: 'Wed', value: 0 },
    { name: 'Thu', value: 0 },
    { name: 'Fri', value: 0 },
    { name: 'Sat', value: 0 },
    { name: 'Sun', value: 0 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Breadcrumbs />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Platform Analytics</h1>
          <p className="text-dark-400">Deep insights into your audience and monetization.</p>
        </div>
        <div className="flex gap-2 p-1 bg-dark-900 border border-white/5 rounded-lg">
           {['7D', '30D', '90D', 'All'].map(t => (
             <button 
               key={t} 
               onClick={() => setTimeRange(t)}
               className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${t === timeRange ? 'bg-gold-500 text-dark-950 shadow-lg shadow-gold-500/20' : 'text-dark-400 hover:text-white'}`}
             >
               {t}
             </button>
           ))}
        </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Events', value: events.length, icon: BarChart3 },
          { label: 'Total Nominees', value: nominees.length, icon: Users },
          { label: 'Total Votes', value: totalVotes, icon: Vote },
          { label: 'Active Events', value: events.filter((e: any) => ['published', 'live', 'voting_ended', 'winners_announced'].includes(e.status)).length, icon: TrendingUp },
        ].map((stat, i) => (
          <Card key={i}>
             <CardContent className="p-0">
                <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2">{stat.label}</p>
                <h3 className="text-3xl font-serif text-white mb-2">{stat.value.toLocaleString()}</h3>
             </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Growth Chart */}
        <Card className="lg:col-span-2">
           <CardHeader>
              <CardTitle>Growth Trends</CardTitle>
              <CardDescription>Unique page visitors across your organization page.</CardDescription>
           </CardHeader>
           <CardContent className="mt-6">
              {!hasData ? (
                <div className="h-[350px] flex flex-col items-center justify-center text-center">
                  <BarChart3 className="h-12 w-12 text-dark-600 mb-4" />
                  <h3 className="text-lg font-serif text-white mb-2">No visitor data yet</h3>
                  <p className="text-sm text-dark-500 max-w-xs">Create your first event and share it to start seeing audience analytics here.</p>
                </div>
              ) : (
                <ChartContainer height={350}>
                    <AreaChart data={emptyVisitData}>
                     <defs>
                       <linearGradient id="growth" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#d4a352" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="#d4a352" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                     <XAxis dataKey="name" stroke="#5d5d5d" fontSize={10} axisLine={false} tickLine={false} />
                     <YAxis stroke="#5d5d5d" fontSize={10} axisLine={false} tickLine={false} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)' }}
                        itemStyle={{ color: '#d4a352' }}
                     />
                     <Area type="monotone" dataKey="value" stroke="#d4a352" strokeWidth={2} fill="url(#growth)" />
                    </AreaChart>
                </ChartContainer>
              )}
           </CardContent>
        </Card>

        {/* Revenue Distribution */}
        <Card>
           <CardHeader>
              <CardTitle>Revenue Mix</CardTitle>
              <CardDescription>Income stream breakdown</CardDescription>
           </CardHeader>
           <CardContent className="flex flex-col pt-0">
              <div className="h-[250px] flex flex-col items-center justify-center">
                 <DollarSign className="h-10 w-10 text-dark-600 mb-3" />
                 <p className="text-sm text-dark-400">No revenue data yet</p>
                 <p className="text-xs text-dark-500 mt-1">Set up monetization to track revenue</p>
              </div>
           </CardContent>
        </Card>
      </div>

      {/* Origin Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <Card>
            <CardHeader>
               <CardTitle className="text-lg">Audience Demographics</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="py-8 text-center">
                 <Globe className="h-10 w-10 text-dark-600 mx-auto mb-3" />
                 <p className="text-sm text-dark-400">No demographic data yet</p>
                 <p className="text-xs text-dark-500 mt-1">Share your event to start collecting audience insights</p>
               </div>
            </CardContent>
         </Card>

         <Card>
            <CardHeader>
               <CardTitle className="text-lg">Device Distribution</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="py-8 text-center">
                 <Smartphone className="h-10 w-10 text-dark-600 mx-auto mb-3" />
                 <p className="text-sm text-dark-400">No device data yet</p>
                 <p className="text-xs text-dark-500 mt-1">Audience device breakdown will appear here</p>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
