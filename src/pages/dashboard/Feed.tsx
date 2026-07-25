import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../lib/convex-auth';
import { PostCreator } from '../../components/feed/PostCreator';
import { FeedPostCard } from '../../components/feed/FeedPost';
import { CommentSection } from '../../components/feed/CommentSection';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import {
  FileText, Clock, CheckCircle2, Archive, MessageCircle, BarChart3,
  Image as ImageIcon, Video, Pin, Filter, Loader2, RefreshCw,
} from 'lucide-react';

const TABS = [
  { id: 'published', label: 'Published', icon: CheckCircle2 },
  { id: 'drafts', label: 'Drafts', icon: FileText },
  { id: 'scheduled', label: 'Scheduled', icon: Clock },
  { id: 'archived', label: 'Archived', icon: Archive },
];

export function DashboardFeed() {
  const { currentOrg, user } = useAuth();
  const [activeTab, setActiveTab] = useState('published');
  const [filter, setFilter] = useState<string>('all');
  const [commentPostId, setCommentPostId] = useState<Id<'feedPosts'> | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [cursorStack, setCursorStack] = useState<string[]>([]);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const feedResult = useQuery(
    api.feeds.queries.getByOrg,
    currentOrg ? { orgId: currentOrg.id as any, filter: filter as any, limit: 15, cursor: cursorStack[cursorStack.length - 1] } : 'skip'
  );
  const draftPosts = useQuery(
    api.feeds.queries.getDrafts,
    currentOrg ? { orgId: currentOrg.id as any } : 'skip'
  ) ?? [];
  const scheduledPosts = useQuery(
    api.feeds.queries.getScheduled,
    currentOrg ? { orgId: currentOrg.id as any } : 'skip'
  ) ?? [];

  // Accumulate published posts as new pages load
  useEffect(() => {
    if (feedResult) {
      const newPosts = feedResult.posts ?? [];
      if (cursorStack.length === 0) {
        setAllPosts(newPosts);
      } else {
        setAllPosts((prev) => [...prev, ...newPosts]);
      }
      setHasMore(feedResult.hasMore ?? false);
      setLoadingMore(false);
    }
  }, [feedResult, cursorStack.length]);

  // Reset when filter changes
  useEffect(() => {
    setCursorStack([]);
    setAllPosts([]);
  }, [filter, refreshKey]);

  // Infinite scroll observer
  useEffect(() => {
    if (!observerRef.current || !hasMore || activeTab !== 'published') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && feedResult?.nextCursor) {
          setLoadingMore(true);
          setCursorStack((prev) => [...prev, feedResult!.nextCursor!]);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, feedResult?.nextCursor, activeTab]);

  const publishedPosts = activeTab === 'published' ? allPosts : [];

  if (!currentOrg) return <div className="text-center py-20 text-dark-400">Select an organization first.</div>;

  const currentPosts = activeTab === 'published' ? publishedPosts :
    activeTab === 'drafts' ? draftPosts :
    activeTab === 'scheduled' ? scheduledPosts :
    [];

  const stats = {
    published: publishedPosts.length,
    drafts: draftPosts.length,
    scheduled: scheduledPosts.length,
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-32">
      <div>
        <Breadcrumbs />
        <h1 className="text-3xl font-serif text-white tracking-tight italic mb-2">Community Feed</h1>
        <p className="text-dark-500 text-xs font-bold uppercase tracking-widest">Manage posts, engage your community</p>
      </div>

      <PostCreator onPostCreated={() => setRefreshKey(k => k + 1)} />

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {TABS.slice(0, 3).map(tab => (
          <Card key={tab.id} className={`p-4 cursor-pointer transition-all ${activeTab === tab.id ? 'border-gold-500/30 bg-gold-500/5' : 'hover:border-white/10'}`}
            onClick={() => setActiveTab(tab.id)}>
            <div className="flex items-center gap-3">
              <tab.icon className="h-4 w-4 text-gold-500" />
              <div>
                <p className="text-lg font-serif text-white">{stats[tab.id as keyof typeof stats] ?? 0}</p>
                <p className="text-[9px] font-bold text-dark-500 uppercase tracking-widest">{tab.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-white/5">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${
              activeTab === tab.id ? 'border-gold-500 text-white' : 'border-transparent text-dark-500 hover:text-dark-300'
            }`}>
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters for published */}
      {activeTab === 'published' && (
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: 'all', label: 'All' },
            { id: 'image', label: 'Photos', icon: ImageIcon },
            { id: 'video', label: 'Videos', icon: Video },
            { id: 'poll', label: 'Polls', icon: BarChart3 },
            { id: 'event_promotion', label: 'Events' },
            { id: 'pinned', label: 'Pinned', icon: Pin },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                filter === f.id ? 'bg-gold-500 text-dark-950' : 'bg-white/5 text-dark-400 hover:text-white hover:bg-white/10'
              }`}>
              {f.icon && <f.icon className="h-3 w-3" />}
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Posts */}
      <div className="space-y-6">
        {currentPosts.length === 0 && !loadingMore ? (
          <Card className="p-12 text-center border-dashed border-white/10">
            <FileText className="h-10 w-10 text-dark-600 mx-auto mb-3 opacity-30" />
            <h3 className="text-lg font-serif text-white mb-2">
              {activeTab === 'published' ? 'No published posts' :
               activeTab === 'drafts' ? 'No drafts' :
               activeTab === 'scheduled' ? 'No scheduled posts' :
               'No archived posts'}
            </h3>
            <p className="text-dark-500 text-xs">Create your first post to get started.</p>
          </Card>
        ) : (
          <>
            {currentPosts.map((post: any) => (
              <div key={post._id} className="space-y-2">
                {activeTab === 'drafts' && (
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-dark-500 bg-white/5 px-2 py-0.5 rounded">Draft</span>
                  </div>
                )}
                {activeTab === 'scheduled' && post.scheduledAt && (
                  <div className="flex items-center gap-2 px-1">
                    <Clock className="h-3 w-3 text-blue-400" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-blue-400">
                      Scheduled for {new Date(post.scheduledAt).toLocaleString()}
                    </span>
                  </div>
                )}
                <FeedPostCard
                  post={post}
                  org={currentOrg}
                  showOrgHeader
                  onCommentToggle={(id) => setCommentPostId(commentPostId === id ? null : id)}
                  showComments={commentPostId === post._id}
                />
                {commentPostId === post._id && (
                  <Card className="p-4">
                    <CommentSection postId={post._id} />
                  </Card>
                )}
              </div>
            ))}

            {/* Infinite scroll sentinel */}
            {activeTab === 'published' && (
              <div ref={observerRef} className="flex justify-center py-8">
                {loadingMore && (
                  <div className="flex items-center gap-2 text-dark-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-[11px]">Loading more...</span>
                  </div>
                )}
                {!hasMore && allPosts.length > 0 && (
                  <p className="text-[10px] text-dark-600 uppercase tracking-widest">End of feed</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
