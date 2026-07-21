import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Radio, Play, Settings, ExternalLink, Calendar, Users, Eye, AlertCircle } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { useToast } from '../../lib/toast';

export function DashboardLive() {
  const { toast } = useToast();
  return (
    <div className="space-y-8">
      <div>
        <Breadcrumbs />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Live Broadcasts</h1>
          <p className="text-dark-400">Stream your events live and engage in real-time.</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)]" onClick={() => toast('Live transmission started! Your stream is now active.', 'success')}>
          <Radio className="h-4 w-4 mr-2" /> Start Transmission
        </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Preview */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-0 overflow-hidden border-white/10 group relative">
             <div className="aspect-video bg-black flex items-center justify-center relative">
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                   <div className="px-2 py-1 bg-red-600 text-[10px] font-bold uppercase rounded flex items-center">
                     <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse mr-1.5" />
                     Live
                   </div>
                   <div className="px-2 py-1 bg-black/40 backdrop-blur-md text-[10px] font-medium uppercase rounded text-white flex items-center">
                     <Eye className="h-3 w-3 mr-1.5" /> 12.4k viewers
                   </div>
                </div>
                
                <img 
                  src="https://images.unsplash.com/photo-1540039155732-684735035727?q=80" 
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                  alt="preview"
                  referrerPolicy="no-referrer"
                />
                
                <div className="relative z-10 text-center">
                   <Button variant="glass" size="icon" className="h-20 w-20 rounded-full border-2 border-white/20">
                     <Play className="h-10 w-10 text-white fill-white" />
                   </Button>
                </div>
             </div>
             <div className="p-6 flex items-center justify-between border-t border-white/5">
                <div>
                   <h3 className="text-white font-medium">Main Stage: Preview Feed</h3>
                   <p className="text-dark-500 text-xs">RTMP Connection Active • 1080p60</p>
                </div>
                <div className="flex gap-2">
                   <Button variant="outline" size="sm" onClick={() => toast('Broadcast settings opened', 'info')}><Settings className="h-4 w-4 mr-2" /> Settings</Button>
                </div>
             </div>
          </Card>

          <Card>
             <CardHeader>
                <CardTitle className="text-lg">Broadcast Settings</CardTitle>
             </CardHeader>
             <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-dark-500 uppercase">Stream Key</label>
                      <div className="relative">
                        <Input type="password" value="sk_headies_2026_live_xxxx_yyyy" readOnly />
                        <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-2 text-gold-500" onClick={() => { navigator.clipboard.writeText('sk_headies_2026_live_xxxx_yyyy'); toast('Stream key copied to clipboard', 'success'); }}>Copy</Button>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-dark-500 uppercase">Server URL</label>
                      <Input value="rtmps://live.awards.com/app" readOnly />
                   </div>
                </div>
                
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex gap-4">
                   <AlertCircle className="h-5 w-5 text-gold-500 shrink-0" />
                   <p className="text-sm text-dark-300">Ensure your encoder bitrate is set between 4000-6000 Kbps for optimal quality during the awards ceremony.</p>
                </div>
             </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
             <CardHeader>
                <CardTitle className="text-lg">Real-time Statistics</CardTitle>
             </CardHeader>
             <CardContent className="space-y-6">
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                   <div className="flex items-center text-dark-300 text-sm">
                      <Users className="h-4 w-4 mr-3 text-gold-500" /> Max Concurrency
                   </div>
                   <span className="text-white font-medium">42,500</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                   <div className="flex items-center text-dark-300 text-sm">
                      <Calendar className="h-4 w-4 mr-3 text-gold-500" /> Session Duration
                   </div>
                   <span className="text-white font-medium">02h 45m</span>
                </div>
                <div className="flex justify-between items-center py-3">
                   <div className="flex items-center text-dark-300 text-sm">
                      <ExternalLink className="h-4 w-4 mr-3 text-gold-500" /> CDN Ingress
                   </div>
                   <span className="text-emerald-400 font-medium">Optimal</span>
                </div>
             </CardContent>
          </Card>

          <Card className="bg-gold-500/5 group">
             <CardHeader>
                <CardTitle className="text-lg">Upcoming Schedule</CardTitle>
             </CardHeader>
             <CardContent className="p-0">
                {[
                  { title: 'Red Carpet Live', time: '16:00 UTC', date: 'Sept 4' },
                  { title: 'Main Ceremony', time: '18:00 UTC', date: 'Sept 4' },
                  { title: 'After Party', time: '22:30 UTC', date: 'Sept 4' },
                ].map((item, i) => (
                  <div key={i} className="p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                     <h4 className="text-white font-medium text-sm">{item.title}</h4>
                     <p className="text-[10px] text-dark-500 uppercase tracking-widest mt-1">{item.date} • {item.time}</p>
                  </div>
                ))}
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
