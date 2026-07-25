import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { useAuth } from '../../lib/convex-auth';
import { useToast } from '../../lib/toast';
import { Button } from '../ui/Button';
import { ImageCarousel } from './ImageCarousel';
import { HashtagMentionText } from './HashtagMentionText';

// Moderation mutations may not exist in types yet; use dynamic access
const moderationMutations = (api as any).moderations?.mutations;
import {
  Heart, MessageCircle, Share2, Bookmark, BookmarkCheck, MoreHorizontal,
  Pin, Eye, ChevronDown, ChevronUp, BarChart3, Play, ExternalLink,
  Calendar, MapPin, Users, Trash2, PinOff, Archive, Edit3, Clock,
  Shield, EyeOff, Star, Lock,
} from 'lucide-react';

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface FeedPostProps {
  key?: React.Key;
  post: any;
  org?: any;
  showOrgHeader?: boolean;
  onCommentToggle?: (postId: Id<'feedPosts'>) => void;
  showComments?: boolean;
  isPublic?: boolean;
}

export function FeedPostCard({ post, org, showOrgHeader = false, onCommentToggle, showComments = false, isPublic = false }: FeedPostProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const toggleLike = useMutation(api.feeds.mutations.toggleLike);
  const toggleBookmark = useMutation(api.feeds.mutations.toggleBookmark);
  const incrementShare = useMutation(api.feeds.mutations.incrementShare);
  const togglePin = useMutation(api.feeds.mutations.togglePin);
  const deletePost = useMutation(api.feeds.mutations.deletePost);
  const archivePost = useMutation(api.feeds.mutations.archivePost);
  const votePoll = useMutation(api.feeds.mutations.votePoll);
  const addComment = useMutation(api.feeds.mutations.addComment);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likesCount ?? 0);
  const [bookmarked, setBookmarked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [localCommentCount, setLocalCommentCount] = useState(0);
  const [votedOption, setVotedOption] = useState<string | null>(null);
  const [showPollResults, setShowPollResults] = useState(false);

  const pollData = useQuery(
    api.feeds.queries.getPollByPost,
    post.postType === 'poll' ? { postId: post._id } : 'skip'
  );
  const hasVoted = useQuery(
    api.feeds.queries.hasVoted,
    pollData && user?.convexUserId ? { pollId: pollData._id, userId: user.convexUserId as any } : 'skip'
  );

  const likeStatus = useQuery(
    api.feeds.queries.isLiked,
    user?.convexUserId ? { userId: user.convexUserId as any, targetType: 'post', targetId: post._id } : 'skip'
  );
  const bookmarkStatus = useQuery(
    api.feeds.queries.isBookmarked,
    user?.convexUserId ? { userId: user.convexUserId as any, targetType: 'post', targetId: post._id } : 'skip'
  );

  useEffect(() => {
    if (likeStatus !== undefined) setLiked(likeStatus);
  }, [likeStatus]);
  useEffect(() => {
    if (bookmarkStatus !== undefined) setBookmarked(bookmarkStatus);
  }, [bookmarkStatus]);
  useEffect(() => {
    if (hasVoted) setVotedOption(hasVoted);
  }, [hasVoted]);

  const handleLike = async () => {
    if (!user) { toast('Login to like', 'error'); return; }
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : Math.max(0, prev - 1));
    try {
      await toggleLike({ targetType: 'post', targetId: post._id, firebaseUid: user.id });
    } catch {
      setLiked(!newLiked);
      setLikeCount(prev => liked ? prev + 1 : Math.max(0, prev - 1));
    }
  };

  const handleBookmark = async () => {
    if (!user) { toast('Login to bookmark', 'error'); return; }
    setBookmarked(!bookmarked);
    try {
      await toggleBookmark({ targetType: 'post', targetId: post._id, firebaseUid: user.id });
    } catch { setBookmarked(!bookmarked); }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/org/${org?.slug ?? ''}`;
    try {
      await navigator.clipboard.writeText(url);
      toast('Link copied!', 'success');
      await incrementShare({ postId: post._id });
    } catch { toast('Failed to copy', 'error'); }
  };

  const handleVote = async (optionId: string) => {
    if (!user || votedOption) return;
    setVotedOption(optionId);
    try {
      await votePoll({ pollId: pollData!._id, optionId, firebaseUid: user.id });
    } catch (e: any) {
      toast(e.message || 'Failed to vote', 'error');
      setVotedOption(null);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim() || !user) return;
    try {
      await addComment({ postId: post._id, content: commentText.trim(), firebaseUid: user.id });
      setCommentText('');
      setLocalCommentCount(prev => prev + 1);
    } catch (e: any) {
      toast(e.message || 'Failed to comment', 'error');
    }
  };

  const handlePin = async () => {
    try {
      await togglePin({ postId: post._id, firebaseUid: user?.id });
      toast(post.isPinned ? 'Unpinned' : 'Pinned', 'success');
    } catch (e: any) { toast(e.message || 'Failed', 'error'); }
    setShowMenu(false);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return;
    try {
      await deletePost({ postId: post._id, firebaseUid: user?.id });
      toast('Post deleted', 'success');
    } catch (e: any) { toast(e.message || 'Failed', 'error'); }
    setShowMenu(false);
  };

  const handleArchive = async () => {
    try {
      await archivePost({ postId: post._id, firebaseUid: user?.id });
      toast('Post archived', 'success');
    } catch (e: any) { toast(e.message || 'Failed', 'error'); }
    setShowMenu(false);
  };

  const handleLock = async () => {
    try {
      const locked = await moderationMutations?.lockPost({
        postId: post._id, firebaseUid: user?.id,
      });
      toast(locked ? 'Post locked' : 'Post unlocked', 'success');
    } catch (e: any) { toast(e.message || 'Failed', 'error'); }
    setShowMenu(false);
  };

  const isLong = (post.content?.length ?? 0) > 280;
  const postOrg = org ?? post.org;
  const author = post.author;

  const totalPollVotes = pollData?.totalVotes ?? 0;

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 pb-0">
        {showOrgHeader && postOrg ? (
          <>
            {postOrg.logoUrl ? (
              <img src={postOrg.logoUrl} className="h-10 w-10 rounded-xl object-cover border border-white/10" alt="org" referrerPolicy="no-referrer" />
            ) : (
              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center font-serif text-gold-500 text-sm">{postOrg.name?.[0]}</div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[12px] font-bold text-white truncate">{postOrg.name}</p>
                {postOrg.isVerified && <span className="text-gold-500">✓</span>}
              </div>
              <p className="text-[9px] text-dark-500">{timeAgo(post.createdAt)} {post.isPinned && '· Pinned'}</p>
            </div>
          </>
        ) : (
          <>
            {author?.avatarUrl ? (
              <img src={author.avatarUrl} className="h-10 w-10 rounded-full object-cover border border-white/10" alt="avatar" referrerPolicy="no-referrer" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center font-serif text-gold-500 text-sm">{author?.name?.[0] ?? '?'}</div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-white truncate">{author?.name ?? 'Unknown'}</p>
              <p className="text-[9px] text-dark-500">{timeAgo(post.createdAt)} {post.isPinned && '· Pinned'}</p>
            </div>
          </>
        )}

        {post.isPinned && (
          <div className="flex items-center h-5 px-2 bg-gold-500/10 border border-gold-500/20 text-gold-500 text-[8px] font-black uppercase tracking-widest rounded-full">
            <Pin className="h-2.5 w-2.5 mr-1" /> Pinned
          </div>
        )}

        {post.status === 'scheduled' && (
          <div className="flex items-center h-5 px-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8px] font-black uppercase tracking-widest rounded-full">
            <Clock className="h-2.5 w-2.5 mr-1" /> Scheduled
          </div>
        )}

        {!isPublic && (
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="h-8 w-8 rounded-full hover:bg-white/5 flex items-center justify-center text-dark-500 transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
            <AnimatePresence>
              {showMenu && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 top-10 z-20 bg-dark-800 border border-white/10 rounded-xl shadow-2xl py-1 min-w-[160px]">
                  <button onClick={handlePin} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-dark-300 hover:bg-white/5 hover:text-white transition-colors">
                    {post.isPinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
                    {post.isPinned ? 'Unpin' : 'Pin Post'}
                  </button>
                  <button onClick={handleArchive} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-dark-300 hover:bg-white/5 hover:text-white transition-colors">
                    <Archive className="h-3.5 w-3.5" /> Archive
                  </button>
                  <button onClick={handleLock} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-dark-300 hover:bg-white/5 hover:text-white transition-colors">
                    <Lock className="h-3.5 w-3.5" /> Lock Comments
                  </button>
                  <button onClick={handleDelete} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        <p className={`text-[13px] text-dark-200 leading-relaxed whitespace-pre-line ${!expanded && isLong ? 'line-clamp-4' : ''}`}>
          <HashtagMentionText text={post.content} />
        </p>
        {isLong && (
          <button onClick={() => setExpanded(!expanded)} className="text-[10px] font-bold text-gold-500 uppercase tracking-widest mt-1 hover:text-gold-400">
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Media Grid */}
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="px-4 pb-3">
          <ImageCarousel images={post.mediaUrls} />
        </div>
      )}

      {/* Link Preview */}
      {post.linkUrl && (
        <div className="mx-4 mb-3 rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transition-colors cursor-pointer">
          {post.linkImage && (
            <div className="h-32 overflow-hidden">
              <img src={post.linkImage} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
            </div>
          )}
          <div className="p-3 bg-white/[0.02]">
            <p className="text-[11px] font-bold text-white mb-0.5">{post.linkTitle || post.linkUrl}</p>
            {post.linkDescription && <p className="text-[10px] text-dark-500 line-clamp-2">{post.linkDescription}</p>}
            <p className="text-[9px] text-dark-600 mt-1 flex items-center gap-1"><ExternalLink className="h-2.5 w-2.5" /> {new URL(post.linkUrl).hostname}</p>
          </div>
        </div>
      )}

      {/* Poll */}
      {pollData && (
        <div className="px-4 pb-3">
          <p className="text-[12px] font-bold text-white mb-2">{pollData.question}</p>
          <div className="space-y-1.5">
            {pollData.options.map((opt: any) => {
              const pct = totalPollVotes > 0 ? Math.round((opt.votes / totalPollVotes) * 100) : 0;
              const isSelected = votedOption === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleVote(opt.id)}
                  disabled={!!votedOption}
                  className={`w-full relative rounded-xl overflow-hidden border transition-all ${
                    isSelected ? 'border-gold-500/30' :
                    votedOption ? 'border-white/5' : 'border-white/10 hover:border-gold-500/20'
                  }`}
                >
                  {votedOption && (
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`absolute inset-y-0 left-0 ${isSelected ? 'bg-gold-500/15' : 'bg-white/5'}`} />
                  )}
                  <div className="relative flex items-center justify-between px-4 py-2.5">
                    <span className="text-[11px] font-medium text-dark-300">{opt.label}</span>
                    {votedOption && <span className="text-[10px] font-bold text-dark-500">{pct}%</span>}
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-[9px] text-dark-600 mt-1.5">{totalPollVotes.toLocaleString()} votes{pollData.endsAt && ` · Ends ${timeAgo(pollData.endsAt)}`}</p>
        </div>
      )}

      {/* Event Promotion */}
      {post.postType === 'event_promotion' && post.eventId && (
        <EventPromotion postId={post._id} />
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 px-4 py-3 border-t border-white/5">
        <button onClick={handleLike} className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] transition-colors ${liked ? 'text-red-500' : 'text-dark-400 hover:text-red-500'}`}>
          <Heart className={`h-3.5 w-3.5 ${liked ? 'fill-red-500' : ''}`} />
          {likeCount > 0 && likeCount}
        </button>
        <button onClick={() => onCommentToggle?.(post._id)} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-dark-400 hover:text-white transition-colors">
          <MessageCircle className="h-3.5 w-3.5" />
          {(post.commentsCount ?? 0) + localCommentCount > 0 && (post.commentsCount ?? 0) + localCommentCount}
        </button>
        <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-dark-400 hover:text-white transition-colors">
          <Share2 className="h-3.5 w-3.5" />
          {post.sharesCount > 0 && post.sharesCount}
        </button>
        <div className="flex-1" />
        {post.viewsCount > 0 && (
          <span className="flex items-center gap-1 px-2 text-[9px] text-dark-600">
            <Eye className="h-3 w-3" /> {post.viewsCount}
          </span>
        )}
        <button onClick={handleBookmark} className={`flex items-center gap-1 px-2 py-1.5 text-[11px] transition-colors ${bookmarked ? 'text-gold-500' : 'text-dark-400 hover:text-gold-500'}`}>
          {bookmarked ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Inline Comment */}
      {showComments && (
        <div className="px-4 pb-4 border-t border-white/5">
          <div className="flex gap-2 pt-3">
            <input
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-[11px] text-white placeholder:text-dark-600 outline-none focus:border-gold-500/30"
              onKeyDown={e => e.key === 'Enter' && handleComment()}
            />
            <Button size="sm" className="h-8 w-8 rounded-full" onClick={handleComment} disabled={!commentText.trim()}>
              <span className="text-[10px]">→</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function EventPromotion({ postId }: { postId: Id<'feedPosts'> }) {
  const post = useQuery(api.feeds.queries.getById, { postId });
  const event = useQuery(
    api.events.queries.getById,
    post?.eventId ? { eventId: post.eventId } : 'skip'
  );

  if (!event) return null;

  return (
    <div className="mx-4 mb-3 rounded-xl border border-gold-500/20 overflow-hidden bg-gold-500/5">
      {event.coverUrl && (
        <div className="h-32 overflow-hidden">
          <img src={event.coverUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-3.5 w-3.5 text-gold-500" />
          <span className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">Event</span>
        </div>
        <h4 className="text-sm font-serif text-white mb-1">{event.title}</h4>
        <div className="flex items-center gap-3 text-[10px] text-dark-400">
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(event.date).toLocaleDateString()}</span>
          {event.venue && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.venue}</span>}
        </div>
      </div>
    </div>
  );
}
