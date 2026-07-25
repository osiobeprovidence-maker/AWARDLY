import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../lib/convex-auth';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useToast } from '../lib/toast';
import { cn } from '../lib/utils';
import type { Id } from '../../convex/_generated/dataModel';
import {
  Eye, MessageSquare, Heart, Trophy, Users, Send, Pin,
  Share2, ExternalLink, Clock, TrendingUp,
} from 'lucide-react';

const REACTION_EMOJIS = ['❤️', '👏', '🔥', '🎉', '😂', '😮', '💯', '🏆'];

export function LiveFeed() {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  const [chatInput, setChatInput] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Get live broadcast for this event
  const broadcast = useQuery(
    api.broadcasts.queries.getLiveByEvent,
    eventId ? { eventId: eventId as Id<'events'> } : 'skip'
  );

  // Get event data
  const eventData = useQuery(
    api.events.queries.getById,
    eventId ? { eventId: eventId as Id<'events'> } : 'skip'
  );

  // Chat messages
  const chatMessages = useQuery(
    api.liveChat.queries.getRecent,
    broadcast ? { broadcastId: broadcast._id, limit: 50 } : 'skip'
  ) ?? [];

  // Reactions
  const reactions = useQuery(
    api.liveReactions.queries.getReactionCounts,
    broadcast ? { broadcastId: broadcast._id } : 'skip'
  ) ?? {};

  const sendChat = useMutation(api.liveChat.mutations.send);
  const sendReaction = useMutation(api.liveReactions.mutations.send);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages.length]);

  const handleSendChat = async () => {
    if (!chatInput.trim() || !broadcast || !user) return;
    const msg = chatInput.trim();
    setChatInput('');
    try {
      await sendChat({
        broadcastId: broadcast._id as Id<'broadcasts'>,
        eventId: eventId as Id<'events'>,
        message: msg,
      });
    } catch (e: any) {
      toast(e.message || 'Failed to send', 'error');
      setChatInput(msg);
    }
  };

  const handleReaction = async (emoji: string) => {
    if (!broadcast || !user) return;
    try {
      await sendReaction({
        broadcastId: broadcast._id as Id<'broadcasts'>,
        eventId: eventId as Id<'events'>,
        emoji,
      });
    } catch (e: any) {
      toast(e.message, 'error');
    }
  };

  // Not live state
  if (broadcast === null) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="py-16 text-center">
            <div className="h-16 w-16 rounded-2xl bg-dark-800 flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-dark-500" />
            </div>
            <h2 className="text-xl font-serif text-white mb-2">Not Live Yet</h2>
            <p className="text-sm text-dark-400">
              This event isn't broadcasting right now. Check back later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (broadcast === undefined) return null;

  const videoId = broadcast.youtubeVideoId;

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
            <h1 className="text-lg font-serif text-white">{broadcast.title}</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-dark-400">
            <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {broadcast.concurrentViewers}</span>
            <span className="flex items-center gap-1"><MessageSquare className="h-4 w-4" /> {broadcast.totalChatMessages}</span>
            <button onClick={() => setShowShareModal(true)} className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-dark-400 hover:text-white transition-colors">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Main Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Video Player */}
            <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 bg-dark-900">
              {videoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <div className="h-full flex items-center justify-center text-dark-500">Stream unavailable</div>
              )}
            </div>

            {/* Pinned Message */}
            {broadcast.isPinned && broadcast.pinnedMessage && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gold-500/10 border border-gold-500/20">
                <Pin className="h-4 w-4 text-gold-500 shrink-0" />
                <p className="text-sm text-gold-500">{broadcast.pinnedMessage}</p>
              </div>
            )}

            {/* Reactions Bar */}
            <div className="flex items-center justify-center gap-2 py-2">
              {REACTION_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-lg transition-all hover:scale-110 active:scale-95"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Reaction Counts */}
            {Object.keys(reactions).length > 0 && (
              <div className="flex items-center justify-center gap-3">
                {Object.entries(reactions).map(([emoji, count]) => (
                  <span key={emoji} className="text-sm text-dark-400">{emoji} {count as number}</span>
                ))}
              </div>
            )}

            {/* Event Info */}
            {eventData && (
              <Card>
                <CardContent className="pt-4">
                  <h2 className="text-lg font-bold text-white">{eventData.title}</h2>
                  <p className="text-sm text-dark-400 mt-1">{eventData.description}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Chat Sidebar */}
          <div className="space-y-4">
            <Card className="flex flex-col" style={{ height: 'calc(100vh - 200px)', minHeight: '400px' }}>
              <CardHeader className="pb-2 border-b border-white/5">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <MessageSquare className="h-4 w-4 text-gold-500" /> Live Chat
                </CardTitle>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto space-y-3 custom-scrollbar py-3">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-8 w-8 text-dark-600 mx-auto mb-2" />
                    <p className="text-xs text-dark-500">No messages yet. Be the first!</p>
                  </div>
                ) : chatMessages.map((msg: any) => (
                  <div key={msg._id} className="flex gap-2">
                    <div className="h-7 w-7 rounded-full bg-gold-500/10 flex items-center justify-center text-[9px] text-gold-500 font-bold shrink-0 border border-gold-500/20">
                      {msg.user?.name?.[0] ?? '?'}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-gold-500">{msg.user?.name ?? 'User'}</span>
                      <p className="text-xs text-dark-200 break-words">{msg.message}</p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </CardContent>

              {/* Chat Input */}
              <div className="p-3 border-t border-white/5">
                {user ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                      placeholder="Type a message..."
                      maxLength={500}
                      className="flex-1 h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-xs placeholder:text-dark-600 focus:outline-none focus:border-gold-500/50"
                    />
                    <Button variant="primary" onClick={handleSendChat} disabled={!chatInput.trim()} className="h-9 px-3">
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-xs text-dark-500 text-center">
                    <a href="/auth/login" className="text-gold-500 hover:text-gold-400">Sign in</a> to join the chat
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm mx-4 bg-dark-900 border border-white/10 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Share Stream</h3>
              <button onClick={() => setShowShareModal(false)} className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 text-dark-400 hover:text-white">
                <span className="text-lg">×</span>
              </button>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Copy Link', action: () => { navigator.clipboard.writeText(window.location.href); toast('Link copied', 'success'); setShowShareModal(false); } },
                { label: 'WhatsApp', action: () => window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`) },
                { label: 'Twitter', action: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`) },
                { label: 'Facebook', action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`) },
              ].map((opt) => (
                <button key={opt.label} onClick={opt.action} className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm text-left transition-colors">
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
