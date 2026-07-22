import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { PublicNav } from '../components/navigation/PublicNav';
import {
  Eye, Heart, MessageCircle, TrendingUp, Globe, Share2,
  Bookmark, BookmarkCheck, ExternalLink
} from 'lucide-react';
import {
  useStreamData, useLikes, useBookmarks, useFollows,
  mockPosts, currentUser, showToast
} from '../lib/feedData';
import { VideoPlayer } from '../components/feed/VideoPlayer';
import { LikeButton } from '../components/feed/LikeButton';
import { FollowButton } from '../components/feed/FollowButton';
import { ViewerCounter } from '../components/feed/ViewerCounter';
import { ReactionBar } from '../components/feed/ReactionBar';
import { CommentSection } from '../components/feed/CommentSection';
import { ShareModal } from '../components/feed/ShareModal';
import { LiveChat } from '../components/feed/LiveChat';
import { FeedPostCard } from '../components/feed/FeedPost';
import { VideoSkeleton, PostSkeleton, ChatSkeleton } from '../components/feed/SkeletonLoader';
import { NotificationToast } from '../components/feed/NotificationToast';

export function LiveFeed() {
  const stream = useStreamData();
  const { liked, counts, toggle } = useLikes();
  const { bookmarks, toggle: toggleBookmark } = useBookmarks();
  const { follows, toggle: toggleFollow } = useFollows();
  const [shareOpen, setShareOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'feed' | 'comments'>('feed');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const metrics = [
    { icon: Eye, label: `${stream.viewerCount.toLocaleString()} watching`, color: 'text-blue-400' },
    { icon: Heart, label: `${stream.likeCount.toLocaleString()} likes`, color: 'text-red-400' },
    { icon: MessageCircle, label: `${stream.commentCount.toLocaleString()} comments`, color: 'text-gold-500' },
    { icon: TrendingUp, label: `Trending #${stream.trending}`, color: 'text-emerald-500' },
    { icon: Globe, label: `${stream.countries} countries`, color: 'text-purple-400' },
  ];

  return (
    <div className="min-h-screen bg-dark-950 font-sans">
      <PublicNav />
      <NotificationToast />

      {/* Activity Bar */}
      <div className="border-b border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-4 sm:gap-6 py-3 overflow-x-auto no-scrollbar">
            {metrics.map((m, i) => (
              <div key={i} className="flex items-center gap-1.5 shrink-0">
                <m.icon className={`h-3 w-3 ${m.color}`} />
                <span className="text-[10px] text-dark-400 font-medium whitespace-nowrap">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">

          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Video Player */}
            {loading ? <VideoSkeleton /> : (
              <VideoPlayer videoId={stream.youtubeVideoId} status={stream.status} scheduledAt={stream.scheduledAt} />
            )}

            {/* Stream Info */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <h1 className="text-xl sm:text-2xl font-serif text-white italic leading-tight">{stream.title}</h1>
                  <p className="text-[12px] text-dark-400 leading-relaxed max-w-2xl">{stream.description}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-dark-500">
                    <ViewerCounter count={stream.viewerCount} />
                    {stream.startedAt && (
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                        Started {Math.floor((Date.now() - stream.startedAt) / 60000)} min ago
                      </span>
                    )}
                    <span>Headies Official</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <FollowButton following={!!follows['headies']} onToggle={() => { toggleFollow('headies'); showToast(follows['headies'] ? 'Unfollowed Headies Official' : 'Following Headies Official', '✓'); }} orgName="Headies Official" />
                  <Button variant="glass" className="h-9 px-3 text-[10px] font-bold uppercase tracking-widest" onClick={() => setShareOpen(true)}>
                    <Share2 className="h-3.5 w-3.5 mr-1" /> Share
                  </Button>
                </div>
              </div>

              {/* Reactions */}
              <div className="flex items-center justify-between">
                <ReactionBar />
                <div className="flex items-center gap-2">
                  <LikeButton
                    liked={!!liked['stream-main']}
                    count={counts['stream-main'] ?? stream.likeCount}
                    onToggle={() => { toggle('stream-main', stream.likeCount); showToast(liked['stream-main'] ? 'Removed like' : 'Liked!', '❤️'); }}
                  />
                  <button onClick={() => setShareOpen(true)} className="flex items-center gap-1.5 text-[11px] text-dark-400 hover:text-dark-200 transition-colors">
                    <Share2 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => { toggleBookmark('stream-main'); showToast(bookmarks['stream-main'] ? 'Removed from bookmarks' : 'Added to bookmarks', '✓'); }} className="flex items-center gap-1.5 text-[11px] text-dark-400 hover:text-gold-500 transition-colors">
                    {bookmarks['stream-main'] ? <BookmarkCheck className="h-3.5 w-3.5 text-gold-500" /> : <Bookmark className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Feed / Comments Tabs */}
            <div className="flex gap-1 border-b border-white/5">
              {(['feed', 'comments'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 -mb-px ${activeTab === tab ? 'border-gold-500 text-gold-500' : 'border-transparent text-dark-400 hover:text-white'}`}>
                  {tab === 'feed' ? 'Live Feed' : 'Comments'}
                </button>
              ))}
            </div>

            {/* Content */}
            {activeTab === 'feed' ? (
              <div className="space-y-4">
                {loading ? (
                  [...Array(3)].map((_, i) => <PostSkeleton key={i} />)
                ) : mockPosts.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-dark-500 text-sm">No posts yet</p>
                  </div>
                ) : (
                  mockPosts.map(post => (
                    <FeedPostCard
                      key={post.id}
                      post={post}
                      liked={!!liked[post.id]}
                      likeCount={counts[post.id] ?? post.likes}
                      onLikeToggle={() => toggle(post.id, post.likes)}
                      bookmarked={!!bookmarks[post.id]}
                      onBookmarkToggle={() => toggleBookmark(post.id)}
                      onShare={() => setShareOpen(true)}
                      commentCount={post.comments.length}
                    />
                  ))
                )}
              </div>
            ) : (
              <Card className="border-white/5">
                <CardContent className="p-5">
                  <CommentSection initialComments={mockPosts[0]?.comments || []} />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 xl:w-96 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-4">

              {/* Quick Stats */}
              <Card className="border-white/10">
                <CardContent className="p-5 space-y-3">
                  <p className="text-[9px] font-bold text-dark-600 uppercase tracking-widest">Stream Stats</p>
                  {metrics.map((m, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-2 text-dark-400"><m.icon className={`h-3.5 w-3.5 ${m.color}`} />{m.label.split(' ').slice(1).join(' ')}</span>
                      <span className="font-medium text-white">{m.label.split(' ')[0]}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Live Chat Toggle */}
              <Card className="border-white/5 overflow-hidden">
                <button onClick={() => setChatOpen(!chatOpen)} className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" /></div>
                    <span className="text-[11px] font-bold text-white uppercase tracking-widest">Live Chat</span>
                  </div>
                  <span className="text-[9px] font-bold text-dark-500 bg-white/5 px-2 py-0.5 rounded-full">{chatOpen ? 'Hide' : 'Show'}</span>
                </button>
                {chatOpen && (
                  <div className="border-t border-white/5">
                    {loading ? <ChatSkeleton /> : <LiveChat />}
                  </div>
                )}
              </Card>

              {/* Related Links */}
              <Card className="border-white/5">
                <CardContent className="p-5 space-y-3">
                  <p className="text-[9px] font-bold text-dark-600 uppercase tracking-widest">Quick Links</p>
                  <Link to="/events/evt1" className="flex items-center gap-2 text-[11px] text-dark-400 hover:text-gold-500 transition-colors">
                    <ExternalLink className="h-3.5 w-3.5" /> Event Hub
                  </Link>
                  <Link to="/events/evt1" className="flex items-center gap-2 text-[11px] text-dark-400 hover:text-gold-500 transition-colors">
                    <ExternalLink className="h-3.5 w-3.5" /> Vote Now
                  </Link>
                  <Link to="/org/headies" className="flex items-center gap-2 text-[11px] text-dark-400 hover:text-gold-500 transition-colors">
                    <ExternalLink className="h-3.5 w-3.5" /> Organization
                  </Link>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} title={stream.title} />

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 sm:py-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start gap-8 sm:gap-12">
          <div className="space-y-4 sm:space-y-6 max-w-xs"><p className="text-[10px] sm:text-xs text-dark-500 leading-relaxed uppercase tracking-widest font-bold">The world's leading platform for award management, secure voting, and community recognition.</p></div>
          <div className="flex gap-6">
            <Link to="/discover" className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-dark-500 hover:text-gold-500 transition-colors">Explore</Link>
            <Link to="/schedule" className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-dark-500 hover:text-gold-500 transition-colors">Schedule</Link>
            <Link to="/org/headies" className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-dark-500 hover:text-gold-500 transition-colors">Organization</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
