import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Bookmark, BookmarkCheck, MessageCircle, ChevronDown, ChevronUp, BarChart3 } from 'lucide-react';
import { FeedPost as FeedPostType, timeAgo, showToast } from '../../lib/feedData';
import { LikeButton } from './LikeButton';
import { ShareModal } from './ShareModal';

interface FeedPostCardProps {
  post: FeedPostType;
  liked: boolean;
  likeCount: number;
  onLikeToggle: () => void;
  bookmarked: boolean;
  onBookmarkToggle: () => void;
  onShare: () => void;
  commentCount: number;
}

export function FeedPostCard({ post, liked, likeCount, onLikeToggle, bookmarked, onBookmarkToggle, onShare, commentCount }: FeedPostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState<Array<{ id: string; user: string; text: string; time: string }>>([]);
  const [shareOpen, setShareOpen] = useState(false);
  const [votedPoll, setVotedPoll] = useState<number | null>(null);

  const isLong = post.text.length > 200;

  const handlePostComment = () => {
    if (commentText.trim()) {
      setLocalComments(prev => [...prev, { id: `lc${Date.now()}`, user: 'You', text: commentText.trim(), time: 'Just now' }]);
      setCommentText('');
      showToast('Comment posted', '✓');
    }
  };

  const totalPollVotes = post.poll ? post.poll.options.reduce((a, o) => a + o.votes, 0) : 0;

  return (
    <>
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 pb-0">
          <img src={post.user.avatar} alt={post.user.name} className="h-10 w-10 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" />
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-bold text-white truncate">{post.user.name}</p>
            <p className="text-[9px] text-dark-500">{post.user.handle} · {timeAgo(post.timestamp)}</p>
          </div>
        </div>

        {/* Text */}
        <div className="px-4 py-3">
          <p className={`text-[12px] text-dark-200 leading-relaxed whitespace-pre-line ${!expanded && isLong ? 'line-clamp-3' : ''}`}>{post.text}</p>
          {isLong && (
            <button onClick={() => setExpanded(!expanded)} className="text-[10px] font-bold text-gold-500 uppercase tracking-widest mt-1 hover:text-gold-400">
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className={`px-4 pb-3 ${post.images.length === 1 ? '' : 'grid grid-cols-2 gap-1'}`}>
            {post.images.map((img, i) => (
              <div key={i} className={`relative overflow-hidden rounded-xl ${post.images!.length === 1 ? 'aspect-video' : 'aspect-square'}`}>
                <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        )}

        {/* Video */}
        {post.video && (
          <div className="px-4 pb-3">
            <div className="aspect-video rounded-xl overflow-hidden bg-dark-800 flex items-center justify-center border border-white/5">
              <img src={post.video} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        )}

        {/* Poll */}
        {post.poll && (
          <div className="px-4 pb-3">
            <p className="text-[11px] font-bold text-white mb-2">{post.poll.question}</p>
            <div className="space-y-1.5">
              {post.poll.options.map((opt, i) => {
                const pct = totalPollVotes > 0 ? Math.round((opt.votes / totalPollVotes) * 100) : 0;
                const isSelected = votedPoll === i;
                return (
                  <button
                    key={i}
                    onClick={() => { if (votedPoll === null) { setVotedPoll(i); showToast('Vote recorded!', '✓'); } }}
                    className={`w-full relative rounded-xl overflow-hidden border transition-all ${isSelected ? 'border-gold-500/30' : votedPoll !== null ? 'border-white/5' : 'border-white/10 hover:border-gold-500/20'}`}
                  >
                    {votedPoll !== null && (
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} className={`absolute inset-y-0 left-0 ${isSelected ? 'bg-gold-500/15' : 'bg-white/5'}`} />
                    )}
                    <div className="relative flex items-center justify-between px-4 py-2.5">
                      <span className="text-[11px] font-medium text-dark-300">{opt.label}</span>
                      {votedPoll !== null && <span className="text-[10px] font-bold text-dark-500">{pct}%</span>}
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[9px] text-dark-600 mt-1.5">{totalPollVotes.toLocaleString()} votes</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 px-4 py-3 border-t border-white/5">
          <LikeButton liked={liked} count={likeCount} onToggle={onLikeToggle} />
          <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-dark-400 hover:text-dark-200 transition-colors">
            <MessageCircle className="h-3.5 w-3.5" />
            {commentCount + localComments.length > 0 && commentCount + localComments.length}
          </button>
          <button onClick={() => setShareOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-dark-400 hover:text-dark-200 transition-colors">
            <Share2 className="h-3.5 w-3.5" />
            {post.shares > 0 && post.shares}
          </button>
          <div className="flex-1" />
          <button onClick={() => { onBookmarkToggle(); showToast(bookmarked ? 'Removed from bookmarks' : 'Added to bookmarks', '✓'); }} className="flex items-center gap-1 px-2 py-1.5 text-[11px] text-dark-400 hover:text-gold-500 transition-colors">
            {bookmarked ? <BookmarkCheck className="h-3.5 w-3.5 text-gold-500" /> : <Bookmark className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-white/5">
              <div className="p-4 space-y-3">
                <div className="flex gap-2">
                  <input value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Add a comment..." className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-[11px] text-white placeholder:text-dark-600 outline-none focus:border-gold-500/30" onKeyDown={e => e.key === 'Enter' && handlePostComment()} />
                  <button onClick={handlePostComment} disabled={!commentText.trim()} className="h-8 w-8 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 hover:bg-gold-500/20 disabled:opacity-30 transition-colors shrink-0"><ChevronUp className="h-3.5 w-3.5" /></button>
                </div>
                {localComments.map(c => (
                  <div key={c.id} className="flex gap-2.5">
                    <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" alt="You" className="h-6 w-6 rounded-full object-cover shrink-0 border border-white/10" referrerPolicy="no-referrer" />
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-bold text-white">{c.user}</span>
                        <span className="text-[8px] text-dark-600">{c.time}</span>
                      </div>
                      <p className="text-[11px] text-dark-300">{c.text}</p>
                    </div>
                  </div>
                ))}
                {localComments.length === 0 && (
                  <p className="text-center text-[10px] text-dark-600 py-2">No comments yet</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} title={post.text.slice(0, 60)} />
    </>
  );
}
