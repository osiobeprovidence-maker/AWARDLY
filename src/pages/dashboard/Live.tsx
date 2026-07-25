import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../lib/convex-auth';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useToast } from '../../lib/toast';
import { cn } from '../../lib/utils';
import type { Id } from '../../../convex/_generated/dataModel';
import {
  Radio, Youtube, Link2, Calendar, Clock, Users, MessageSquare,
  Heart, Trophy, DollarSign, Play, Square, Pin, Trash2, Settings,
  ArrowRight, ArrowLeft, CheckCircle, Eye, TrendingUp, BarChart3,
  Copy, ExternalLink, Zap, Send, X,
} from 'lucide-react';

type WizardStep = 'source' | 'connect' | 'select' | 'preview';

export function DashboardLive() {
  const { currentOrg } = useAuth();
  const { toast } = useToast();

  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState<WizardStep>('source');
  const [source, setSource] = useState<'youtube' | 'rtmp' | 'upload'>('youtube');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastDescription, setBroadcastDescription] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [scheduledStartTime, setScheduledStartTime] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const events = useQuery(
    api.events.queries.getByOrgWithCategories,
    currentOrg ? { orgId: currentOrg.id as Id<'organizations'> } : 'skip'
  ) ?? [];

  const broadcasts = useQuery(
    api.broadcasts.queries.getByEvent,
    events.length > 0 ? { eventId: events[0]._id } : 'skip'
  ) ?? [];

  const activeBroadcast = broadcasts.find((b: any) => b.status === 'live');
  const scheduledBroadcasts = broadcasts.filter((b: any) => b.status === 'scheduled');
  const endedBroadcasts = broadcasts.filter((b: any) => b.status === 'ended');

  const createBroadcast = useMutation(api.broadcasts.mutations.create);
  const goLive = useMutation(api.broadcasts.mutations.goLive);
  const endLive = useMutation(api.broadcasts.mutations.endLive);
  const pinMessage = useMutation(api.broadcasts.mutations.pinMessage);
  const unpinMessage = useMutation(api.broadcasts.mutations.unpinMessage);

  // Live stats for active broadcast
  const liveStats = useQuery(
    api.broadcasts.queries.getLiveStats,
    activeBroadcast ? { broadcastId: activeBroadcast._id } : 'skip'
  );

  // Chat messages for active broadcast
  const chatMessages = useQuery(
    api.liveChat.queries.getRecent,
    activeBroadcast ? { broadcastId: activeBroadcast._id, limit: 50 } : 'skip'
  ) ?? [];

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/|youtube\.com\/embed\/)([^&\s?/]+)/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];
    for (const p of patterns) {
      const m = url.match(p);
      if (m) return m[1];
    }
    return null;
  };

  const handleCreateBroadcast = async () => {
    if (!selectedEventId || !currentOrg) return;
    setIsCreating(true);
    try {
      const videoId = extractVideoId(youtubeUrl);
      await createBroadcast({
        eventId: selectedEventId as Id<'events'>,
        title: broadcastTitle || `Live Event - ${new Date().toLocaleDateString()}`,
        description: broadcastDescription || undefined,
        source: 'youtube',
        youtubeVideoId: videoId ?? undefined,
        youtubeLiveUrl: youtubeUrl || undefined,
        thumbnailUrl: thumbnailUrl || undefined,
        scheduledStartTime: scheduledStartTime || undefined,
      });
      toast('Broadcast created', 'success');
      setShowWizard(false);
      resetWizard();
    } catch (e: any) {
      toast(e.message || 'Failed to create broadcast', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const handleGoLive = async (broadcastId: string) => {
    try {
      await goLive({ broadcastId: broadcastId as Id<'broadcasts'> });
      toast('Broadcast is now live!', 'success');
    } catch (e: any) {
      toast(e.message || 'Failed to go live', 'error');
    }
  };

  const handleEndLive = async (broadcastId: string) => {
    if (!confirm('End this broadcast?')) return;
    try {
      await endLive({ broadcastId: broadcastId as Id<'broadcasts'> });
      toast('Broadcast ended', 'success');
    } catch (e: any) {
      toast(e.message || 'Failed to end broadcast', 'error');
    }
  };

  const resetWizard = () => {
    setWizardStep('source');
    setSource('youtube');
    setYoutubeUrl('');
    setBroadcastTitle('');
    setBroadcastDescription('');
    setSelectedEventId(null);
    setScheduledStartTime('');
    setThumbnailUrl('');
  };

  // ─── WIZARD ────────────────────────────────────────────────────────────
  if (showWizard) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <button onClick={() => { setShowWizard(false); resetWizard(); }} className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-dark-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-serif text-white tracking-tight">Go Live</h1>
            <p className="text-dark-400 text-sm mt-1">Step {wizardStep === 'source' ? '1' : wizardStep === 'connect' ? '2' : wizardStep === 'select' ? '3' : '4'} of 4</p>
          </div>
        </div>

        {/* Step Progress */}
        <div className="flex gap-2">
          {(['source', 'connect', 'select', 'preview'] as WizardStep[]).map((step, i) => (
            <div key={step} className={cn("h-1.5 flex-1 rounded-full transition-colors", i <= ['source', 'connect', 'select', 'preview'].indexOf(wizardStep) ? "bg-gold-500" : "bg-dark-800")} />
          ))}
        </div>

        {/* Step 1: Choose Source */}
        {wizardStep === 'source' && (
          <Card>
            <CardHeader><CardTitle>Choose Source</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { id: 'youtube', icon: Youtube, label: 'YouTube Live', desc: 'Embed a YouTube live stream (Recommended)', color: 'text-red-500' },
                { id: 'rtmp', icon: Radio, label: 'RTMP (Advanced)', desc: 'Stream directly via RTMP protocol', color: 'text-violet-500' },
                { id: 'upload', icon: Play, label: 'Upload Recorded Video', desc: 'Upload a pre-recorded video file', color: 'text-blue-500' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => { setSource(opt.id as any); setWizardStep(opt.id === 'youtube' ? 'preview' : 'connect'); }}
                  className={cn("w-full flex items-center gap-4 p-5 rounded-xl border transition-all text-left", source === opt.id ? "border-gold-500/50 bg-gold-500/5" : "border-white/5 bg-white/[0.02] hover:border-white/10")}
                >
                  <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center bg-white/5")}>
                    <opt.icon className={cn("h-6 w-6", opt.color)} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{opt.label}</p>
                    <p className="text-xs text-dark-400 mt-0.5">{opt.desc}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-dark-500" />
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Connect YouTube */}
        {wizardStep === 'connect' && (
          <Card>
            <CardHeader><CardTitle>Connect YouTube</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {currentOrg?.youtubeChannelName ? (
                <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle className="h-6 w-6 text-emerald-500" />
                  <div>
                    <p className="text-sm font-medium text-white">Connected</p>
                    <p className="text-xs text-dark-400">{currentOrg.youtubeChannelName}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Youtube className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <p className="text-dark-400 text-sm mb-4">Connect your YouTube channel to list live streams.</p>
                  <Button variant="outline" onClick={() => toast('YouTube OAuth coming soon — use Paste URL for now', 'info')}>
                    Connect YouTube Channel
                  </Button>
                </div>
              )}
              <div className="flex justify-between">
                <Button variant="secondary" onClick={() => setWizardStep('source')}>Back</Button>
                <Button variant="primary" onClick={() => setWizardStep('preview')}>Continue</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Select Stream */}
        {wizardStep === 'select' && (
          <Card>
            <CardHeader><CardTitle>Select Stream</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-dark-400 text-sm">Choose how to connect your stream.</p>
              <div className="space-y-3">
                {[
                  { id: 'paste', icon: Link2, label: 'Paste Live URL', desc: 'Paste your YouTube live stream URL' },
                  { id: 'existing', icon: Play, label: 'Existing Live Stream', desc: 'Select from your connected channel' },
                  { id: 'schedule', icon: Calendar, label: 'Schedule New Stream', desc: 'Create a scheduled stream on YouTube' },
                ].map((opt) => (
                  <button key={opt.id} onClick={() => setWizardStep('preview')} className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all text-left">
                    <opt.icon className="h-5 w-5 text-gold-500" />
                    <div>
                      <p className="text-sm font-medium text-white">{opt.label}</p>
                      <p className="text-xs text-dark-400">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <Button variant="secondary" onClick={() => setWizardStep('connect')}>Back</Button>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Preview & Create */}
        {wizardStep === 'preview' && (
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Stream Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-white block mb-2">YouTube Live URL</label>
                  <div className="relative">
                    <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                    <input type="url" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="https://youtube.com/watch?v=... or https://youtube.com/live/..." className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-dark-600 focus:outline-none focus:border-gold-500/50" />
                  </div>
                  {youtubeUrl && extractVideoId(youtubeUrl) && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-emerald-500">
                      <CheckCircle className="h-3 w-3" /> Valid YouTube URL detected
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-white block mb-2">Broadcast Title</label>
                    <input type="text" value={broadcastTitle} onChange={(e) => setBroadcastTitle(e.target.value)} placeholder="Headies 2026 Live" className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-dark-600 focus:outline-none focus:border-gold-500/50" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white block mb-2">Event</label>
                    <select value={selectedEventId ?? ''} onChange={(e) => setSelectedEventId(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500/50 appearance-none">
                      <option value="" className="bg-dark-900">Select event...</option>
                      {events.map((ev: any) => <option key={ev._id} value={ev._id} className="bg-dark-900">{ev.title}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-white block mb-2">Description (optional)</label>
                  <textarea value={broadcastDescription} onChange={(e) => setBroadcastDescription(e.target.value)} rows={3} placeholder="Watch the biggest awards ceremony..." className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-dark-600 focus:outline-none focus:border-gold-500/50 resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-white block mb-2">Schedule Start (optional)</label>
                    <input type="datetime-local" value={scheduledStartTime} onChange={(e) => setScheduledStartTime(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500/50" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white block mb-2">Thumbnail URL (optional)</label>
                    <input type="url" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="https://..." className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-dark-600 focus:outline-none focus:border-gold-500/50" />
                  </div>
                </div>

                {/* Preview */}
                {youtubeUrl && extractVideoId(youtubeUrl) && (
                  <div className="mt-4">
                    <p className="text-xs text-dark-500 uppercase tracking-widest mb-2">Preview</p>
                    <div className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-dark-900">
                      <iframe src={`https://www.youtube.com/embed/${extractVideoId(youtubeUrl)}`} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="secondary" onClick={() => setWizardStep(source === 'youtube' ? 'source' : 'select')}>Back</Button>
              <Button variant="primary" onClick={handleCreateBroadcast} disabled={!youtubeUrl || !selectedEventId || isCreating} className="flex items-center gap-2">
                {isCreating ? <span className="h-4 w-4 border-2 border-dark-950 border-t-transparent rounded-full animate-spin" /> : <Radio className="h-4 w-4" />}
                Create Broadcast
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── LIVE CONTROL CENTER ───────────────────────────────────────────────
  if (activeBroadcast) {
    const videoId = activeBroadcast.youtubeVideoId;
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
            <h1 className="text-3xl font-serif text-white tracking-tight">Live Control Center</h1>
          </div>
          <Button variant="primary" onClick={() => handleEndLive(activeBroadcast._id)} className="bg-red-600 hover:bg-red-700 flex items-center gap-2">
            <Square className="h-4 w-4" /> End Broadcast
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Video Player */}
            <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 bg-dark-900">
              {videoId ? (
                <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
              ) : (
                <div className="h-full flex items-center justify-center text-dark-500">No stream URL set</div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Viewers', value: liveStats?.concurrentViewers ?? 0, icon: Eye, color: 'text-gold-500' },
                { label: 'Chat Messages', value: liveStats?.totalChatMessages ?? 0, icon: MessageSquare, color: 'text-blue-500' },
                { label: 'Reactions', value: liveStats?.totalReactions ?? 0, icon: Heart, color: 'text-rose-500' },
                { label: 'Revenue', value: `₦${(liveStats?.revenueDuringStream ?? 0).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-500' },
              ].map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="pt-4 pb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <stat.icon className={cn("h-3.5 w-3.5", stat.color)} />
                      <span className="text-[10px] text-dark-500 uppercase tracking-widest">{stat.label}</span>
                    </div>
                    <p className="text-xl font-serif text-white">{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Pinned Message */}
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-sm"><Pin className="h-4 w-4 text-gold-500" /> Pinned Message</CardTitle></CardHeader>
              <CardContent>
                {activeBroadcast.isPinned ? (
                  <div>
                    <p className="text-sm text-white bg-gold-500/10 border border-gold-500/20 rounded-lg p-3">{activeBroadcast.pinnedMessage}</p>
                    <button onClick={() => unpinMessage({ broadcastId: activeBroadcast._id })} className="text-xs text-dark-400 hover:text-rose-400 mt-2">Unpin</button>
                  </div>
                ) : (
                  <PinMessageForm broadcastId={activeBroadcast._id} onPin={pinMessage} />
                )}
              </CardContent>
            </Card>

            {/* Live Chat */}
            <Card className="flex flex-col" style={{ height: '400px' }}>
              <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm"><MessageSquare className="h-4 w-4 text-gold-500" /> Live Chat ({chatMessages.length})</CardTitle></CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                {chatMessages.length === 0 ? (
                  <p className="text-xs text-dark-500 text-center py-8">No messages yet</p>
                ) : chatMessages.map((msg: any) => (
                  <div key={msg._id} className="flex gap-2">
                    <div className="h-6 w-6 rounded-full bg-gold-500/10 flex items-center justify-center text-[8px] text-gold-500 font-bold shrink-0">
                      {msg.user?.name?.[0] ?? '?'}
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gold-500">{msg.user?.name ?? 'User'}</span>
                      <p className="text-xs text-dark-300">{msg.message}</p>
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

  // ─── NO ACTIVE BROADCAST ──────────────────────────────────────────────
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Live Broadcasts</h1>
          <p className="text-dark-400 text-sm">Manage your live streams and engage your audience in real-time.</p>
        </div>
        <Button variant="primary" onClick={() => setShowWizard(true)} className="flex items-center gap-2">
          <Radio className="h-4 w-4" /> Go Live
        </Button>
      </div>

      {/* How it works */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-4 gap-6">
            {[
              { step: '1', icon: Youtube, label: 'Connect YouTube', desc: 'Paste your YouTube live URL', color: 'text-red-500' },
              { step: '2', icon: Settings, label: 'Configure', desc: 'Set title, event, schedule', color: 'text-violet-500' },
              { step: '3', icon: Radio, label: 'Go Live', desc: 'Embed stream on Awardly', color: 'text-gold-500' },
              { step: '4', icon: Users, label: 'Engage', desc: 'Chat, vote, donate, react', color: 'text-emerald-500' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className={cn("h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3")}>
                  <item.icon className={cn("h-6 w-6", item.color)} />
                </div>
                <p className="text-xs font-bold text-white mb-1">{item.label}</p>
                <p className="text-[11px] text-dark-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Broadcasts */}
      {scheduledBroadcasts.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Calendar className="h-5 w-5 text-violet-500" /> Scheduled</h2>
          <div className="space-y-3">
            {scheduledBroadcasts.map((b: any) => (
              <Card key={b._id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
                        <Radio className="h-6 w-6 text-violet-500" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{b.title}</h3>
                        <p className="text-xs text-dark-400">{b.scheduledStartTime ? new Date(b.scheduledStartTime).toLocaleString() : 'No schedule set'}</p>
                      </div>
                    </div>
                    <Button variant="primary" onClick={() => handleGoLive(b._id)} className="flex items-center gap-2">
                      <Play className="h-4 w-4" /> Go Live
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Ended Broadcasts */}
      {endedBroadcasts.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><BarChart3 className="h-5 w-5 text-dark-500" /> Past Broadcasts</h2>
          <div className="space-y-3">
            {endedBroadcasts.map((b: any) => (
              <Card key={b._id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-dark-800 flex items-center justify-center">
                        <Play className="h-6 w-6 text-dark-500" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{b.title}</h3>
                        <p className="text-xs text-dark-400">
                          {b.endedAt ? new Date(b.endedAt).toLocaleDateString() : ''} · {b.duration ? `${Math.round(b.duration / 60)}m` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 text-xs text-dark-400">
                      <span><Eye className="h-3 w-3 inline" /> {b.peakViewerCount}</span>
                      <span><MessageSquare className="h-3 w-3 inline" /> {b.totalChatMessages}</span>
                      <span><DollarSign className="h-3 w-3 inline" /> ₦{b.revenueDuringStream.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {broadcasts.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <Radio className="h-16 w-16 text-dark-600 mx-auto mb-4" />
            <h3 className="text-xl font-serif text-white mb-2">Ready to go live?</h3>
            <p className="text-sm text-dark-400 max-w-md mx-auto mb-6">
              Connect your YouTube live stream and create an interactive viewing experience for your audience.
              Fans can watch, vote, chat, donate, and engage — all on Awardly.
            </p>
            <Button variant="primary" onClick={() => setShowWizard(true)} className="flex items-center gap-2 mx-auto">
              <Radio className="h-4 w-4" /> Go Live
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── Pin Message Form ────────────────────────────────────────────────────
function PinMessageForm({ broadcastId, onPin }: { broadcastId: string; onPin: any }) {
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handlePin = async () => {
    if (!message.trim()) return;
    try {
      await onPin({ broadcastId: broadcastId as Id<'broadcasts'>, message: message.trim() });
      toast('Message pinned', 'success');
      setMessage('');
    } catch (e: any) {
      toast(e.message || 'Failed to pin', 'error');
    }
  };

  return (
    <div className="flex gap-2">
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Pin a message..." onKeyDown={(e) => e.key === 'Enter' && handlePin()} className="flex-1 h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-xs placeholder:text-dark-600 focus:outline-none focus:border-gold-500/50" />
      <Button variant="primary" onClick={handlePin} disabled={!message.trim()} className="h-9 px-3 text-xs">
        <Pin className="h-3 w-3" />
      </Button>
    </div>
  );
}
