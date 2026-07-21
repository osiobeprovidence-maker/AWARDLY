import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Vote, ArrowUpRight, ArrowDownRight, Globe, Smartphone, Monitor } from 'lucide-react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';

const visitData = [
  { name: 'Jan', value: 45000 },
  { name: 'Feb', value: 52000 },
  { name: 'Mar', value: 48000 },
  { name: 'Apr', value: 61000 },
  { name: 'May', value: 55000 },
  { name: 'Jun', value: 67000 },
  { name: 'Jul', value: 89000 },
];

const revenueData = [
  { name: 'Votes', value: 75 },
  { name: 'Tickets', value: 15 },
  { name: 'Sponsors', value: 10 },
];

const COLORS = ['#d4a352', '#ead8b0', '#714324'];

export function DashboardAnalytics() {
  const [timeRange, setTimeRange] = React.useState('30D');

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

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Audience Reach', value: '842k', change: '+24%', trend: 'up' },
          { label: 'Engagement Rate', value: '18.4%', change: '+2.1%', trend: 'up' },
          { label: 'Avg Session', value: '12m 45s', change: '-4%', trend: 'down' },
          { label: 'Total Revenue', value: '₦84,520', change: '+52%', trend: 'up' },
        ].map((stat, i) => (
          <Card key={i}>
             <CardContent className="p-0">
                <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2">{stat.label}</p>
                <h3 className="text-3xl font-serif text-white mb-2">{stat.value}</h3>
                <div className={`text-xs flex items-center font-medium ${stat.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {stat.change} <span className="text-dark-500 ml-2 font-normal">vs prev. period</span>
                </div>
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
           <CardContent className="h-[350px] mt-6">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={visitData}>
                   <defs>
                     <linearGradient id="growth" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#d4a352" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#d4a352" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                   <XAxis dataKey="name" stroke="#5d5d5d" fontSize={10} axisLine={false} tickLine={false} />
                   <YAxis stroke="#5d5d5d" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}k`} />
                   <Tooltip 
                      contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)' }}
                      itemStyle={{ color: '#d4a352' }}
                   />
                   <Area type="monotone" dataKey="value" stroke="#d4a352" strokeWidth={2} fill="url(#growth)" />
                 </AreaChart>
              </ResponsiveContainer>
           </CardContent>
        </Card>

        {/* Revenue Distribution */}
        <Card>
           <CardHeader>
              <CardTitle>Revenue Mix</CardTitle>
              <CardDescription>Income stream breakdown</CardDescription>
           </CardHeader>
           <CardContent className="h-[350px] flex flex-col pt-0">
              <div className="flex-1">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie data={revenueData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {revenueData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                       </Pie>
                       <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
              </div>
              <div className="space-y-3 mt-4">
                 {revenueData.map((item, i) => (
                    <div key={item.name} className="flex justify-between items-center text-xs">
                       <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[i] }} />
                          <span className="text-dark-300">{item.name}</span>
                       </div>
                       <span className="text-white font-medium">{item.value}%</span>
                    </div>
                 ))}
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
            <CardContent className="space-y-5">
               {[
                 { label: 'Nigeria', val: 65, icon: Globe },
                 { label: 'United States', val: 15, icon: Globe },
                 { label: 'United Kingdom', val: 12, icon: Globe },
                 { label: 'Ghana', val: 8, icon: Globe },
               ].map((item) => (
                 <div key={item.label} className="space-y-2">
                    <div className="flex justify-between text-xs mb-1">
                       <span className="text-dark-200">{item.label}</span>
                       <span className="text-dark-500">{item.val}%</span>
                    </div>
                    <div className="h-1 w-full bg-dark-900 rounded-full overflow-hidden">
                       <div className="h-full bg-gold-500 transition-all duration-1000" style={{ width: `${item.val}%` }} />
                    </div>
                 </div>
               ))}
            </CardContent>
         </Card>

         <Card>
            <CardHeader>
               <CardTitle className="text-lg">Device Distribution</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
                {[
                  { icon: Smartphone, label: 'Mobile', val: '78%' },
                  { icon: Monitor, label: 'Desktop', val: '18%' },
                  { icon: Globe, label: 'Tablet', val: '4%' },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5">
                     <item.icon className="h-6 w-6 text-gold-500 mb-3" />
                     <span className="text-2xl font-serif text-white mb-1">{item.val}</span>
                     <span className="text-[10px] text-dark-500 uppercase tracking-widest">{item.label}</span>
                  </div>
                ))}
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
