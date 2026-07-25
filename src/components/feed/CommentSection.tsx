import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../lib/convex-auth';
import { useToast } from '../../lib/toast';
import { Button } from '../ui/Button';
import { Id } from '../../../convex/_generated/dataModel';
import {
  Send, Smile, Trash2, Edit3, MessageCircle, ChevronDown, ChevronUp,
  Heart, MoreHorizontal, Pin, EyeOff, Star,
} from 'lucide-react';

// Moderation mutations may not exist in types yet; use dynamic access
const moderationMutations = (api as any).moderations?.mutations;

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

const EMOJIS = ['😂', '❤️', '🔥', '👏', '😍', '🎉', '💯', '🙌', '😢', '🤔', '😎', '✨'];

interface CommentSectionProps {
  postId: Id<'feedPosts'>;
  isPublic?: boolean;
}

export function CommentSection({ postId, isPublic = false }: CommentSectionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const comments = useQuery(api.feeds.queries.getComments, { postId });
  const addComment = useMutation(api.feeds.mutations.addComment);
  const deleteComment = useMutation(api.feeds.mutations.deleteComment);
  const updateComment = useMutation(api.feeds.mutations.updateComment);
  const toggleLike = useMutation(api.feeds.mutations.toggleLike);

  const [newComment, setNewComment] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const handlePost = async () => {
    if (!newComment.trim() || !user) return;
    setSubmitting(true);
    try {
      await addComment({ postId, content: newComment.trim(), firebaseUid: user.id });
      setNewComment('');
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (e: any) {
      toast(e.message || 'Failed to post comment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!comments) return <div className="py-4 text-center text-[11px] text-dark-500">Loading comments...</div>;

  return (
    <div className="space-y-0">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle className="h-4 w-4 text-gold-500" />
        <h3 className="text-sm font-bold text-white">{comments.length} Comment{comments.length !== 1 ? 's' : ''}</h3>
      </div>

      {!isPublic && user && (
        <div className="flex gap-3 pb-4 border-b border-white/5">
          <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-gold-500 shrink-0">
            {user.name?.[0] ?? '?'}
          </div>
          <div className="flex-1 relative">
            <input
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-20 text-[12px] text-white placeholder:text-dark-600 outline-none focus:border-gold-500/30 transition-colors"
              onKeyDown={e => e.key === 'Enter' && handlePost()}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <div className="relative">
                <button onClick={() => setShowEmoji(!showEmoji)} className="h-7 w-7 rounded-full flex items-center justify-center text-dark-500 hover:text-dark-300 transition-colors">
                  <Smile className="h-4 w-4" />
                </button>
                <AnimatePresence>
                  {showEmoji && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute bottom-8 right-0 bg-dark-800 border border-white/10 rounded-xl p-2 grid grid-cols-6 gap-1 z-10 shadow-xl">
                      {EMOJIS.map(e => (
                        <button key={e} onClick={() => { setNewComment(p => p + e); setShowEmoji(false); }}
                          className="h-8 w-8 rounded-lg flex items-center justify-center text-base hover:bg-white/10 transition-colors">{e}</button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button onClick={handlePost} disabled={!newComment.trim() || submitting}
                className="h-7 w-7 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 hover:bg-gold-500/20 disabled:opacity-30 transition-colors">
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="divide-y divide-white/5">
        {comments.length === 0 && (
          <div className="py-8 text-center">
            <MessageCircle className="h-8 w-8 text-dark-700 mx-auto mb-2" />
            <p className="text-[11px] text-dark-500">No comments yet. Be the first!</p>
          </div>
        )}
        {comments.map((c: any) => (
          <CommentItem
            key={c._id as string}
            comment={c}
            postId={postId}
            userId={user?.id}
            isPublic={isPublic}
          />
        ))}
      </div>
      <div ref={endRef} />
    </div>
  );
}

function CommentItem({ key, comment, postId, userId, isPublic, depth = 0 }: {
  key?: React.Key;
  comment: any;
  postId: Id<'feedPosts'>;
  userId?: string;
  isPublic: boolean;
  depth?: number;
}) {
  const { toast } = useToast();
  const addComment = useMutation(api.feeds.mutations.addComment);
  const deleteComment = useMutation(api.feeds.mutations.deleteComment);
  const updateComment = useMutation(api.feeds.mutations.updateComment);
  const toggleLike = useMutation(api.feeds.mutations.toggleLike);
  const togglePinComment = useMutation(api.feeds.mutations.togglePinComment);
  const hideComment = useMutation(moderationMutations?.hideComment ?? api.feeds.mutations.togglePinComment);
  const featureComment = useMutation(moderationMutations?.featureComment ?? api.feeds.mutations.togglePinComment);

  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState(depth === 0);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [liked, setLiked] = useState(false);

  const isMe = comment.authorId && userId && comment.author._id === userId;

  const handleReply = async () => {
    if (!replyText.trim()) return;
    try {
      await addComment({ postId, content: replyText.trim(), parentCommentId: comment._id, firebaseUid: userId });
      setReplyText('');
      setShowReply(false);
      setShowReplies(true);
    } catch (e: any) { toast(e.message || 'Failed', 'error'); }
  };

  const handleEdit = async () => {
    if (!editText.trim() || editText === comment.content) { setEditing(false); return; }
    try {
      await updateComment({ commentId: comment._id, content: editText.trim(), firebaseUid: userId });
      setEditing(false);
    } catch (e: any) { toast(e.message || 'Failed', 'error'); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete comment?')) return;
    try {
      await deleteComment({ commentId: comment._id, firebaseUid: userId });
    } catch (e: any) { toast(e.message || 'Failed', 'error'); }
  };

  const handleLike = async () => {
    if (!userId) return;
    setLiked(!liked);
    try {
      await toggleLike({ targetType: 'comment', targetId: comment._id, firebaseUid: userId });
    } catch { setLiked(!liked); }
  };

  const handleHide = async () => {
    try {
      await hideComment({ commentId: comment._id, firebaseUid: userId });
      toast('Comment hidden', 'success');
    } catch (e: any) { toast(e.message || 'Failed', 'error'); }
  };

  const handleFeature = async () => {
    try {
      const featured = await featureComment({ commentId: comment._id, firebaseUid: userId });
      toast(featured ? 'Comment featured' : 'Unfeatured', 'success');
    } catch (e: any) { toast(e.message || 'Failed', 'error'); }
  };

  const handlePin = async () => {
    try {
      const pinned = await togglePinComment({ commentId: comment._id, firebaseUid: userId });
      toast(pinned ? 'Comment pinned' : 'Unpinned', 'success');
    } catch (e: any) { toast(e.message || 'Failed', 'error'); }
  };

  return (
    <div className={depth > 0 ? 'ml-8 sm:ml-12' : ''}>
      <div className="flex gap-3 py-3">
        {comment.author?.avatarUrl ? (
          <img src={comment.author.avatarUrl} className="h-8 w-8 rounded-full object-cover shrink-0 border border-white/10" alt="" referrerPolicy="no-referrer" />
        ) : (
          <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-gold-500 shrink-0">
            {comment.author?.name?.[0] ?? '?'}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-white">{comment.author?.name ?? 'Unknown'}</span>
            <span className="text-[9px] text-dark-500">{timeAgo(comment.createdAt)}</span>
            {comment.isPinned && <span className="text-[8px] font-bold text-gold-500 uppercase">Pinned</span>}
            {comment.isFeatured && <span className="text-[8px] font-bold text-emerald-500 uppercase">Featured</span>}
          </div>

          {editing ? (
            <div className="flex gap-2">
              <input value={editText} onChange={e => setEditText(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[11px] text-white outline-none focus:border-gold-500/30"
                onKeyDown={e => e.key === 'Enter' && handleEdit()} />
              <button onClick={handleEdit} className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">Save</button>
              <button onClick={() => { setEditing(false); setEditText(comment.content); }} className="text-[10px] font-bold text-dark-500 uppercase tracking-widest">Cancel</button>
            </div>
          ) : (
            <p className="text-[12px] text-dark-300 leading-relaxed">{comment.content}</p>
          )}

          {!isPublic && (
            <div className="flex items-center gap-3 mt-1.5">
              <button onClick={handleLike} className={`flex items-center gap-1 text-[10px] transition-colors ${liked ? 'text-red-500' : 'text-dark-500 hover:text-dark-300'}`}>
                <Heart className={`h-3 w-3 ${liked ? 'fill-red-500' : ''}`} /> {comment.likesCount > 0 && comment.likesCount}
              </button>
              <button onClick={() => setShowReply(!showReply)} className="flex items-center gap-1 text-[10px] text-dark-500 hover:text-dark-300 transition-colors">
                <MessageCircle className="h-3 w-3" /> Reply
              </button>
              {isMe && (
                <>
                  <button onClick={() => setEditing(true)} className="text-[10px] text-dark-500 hover:text-dark-300 transition-colors"><Edit3 className="h-3 w-3" /></button>
                  <button onClick={handleDelete} className="text-[10px] text-dark-500 hover:text-red-400 transition-colors"><Trash2 className="h-3 w-3" /></button>
                </>
              )}
              {!isMe && !isPublic && userId && (
                <>
                  <button onClick={handlePin} className="text-[10px] text-dark-500 hover:text-gold-500 transition-colors" title="Pin">
                    <Pin className="h-3 w-3" />
                  </button>
                  <button onClick={handleHide} className="text-[10px] text-dark-500 hover:text-amber-500 transition-colors" title="Hide">
                    <EyeOff className="h-3 w-3" />
                  </button>
                  <button onClick={handleFeature} className="text-[10px] text-dark-500 hover:text-emerald-500 transition-colors" title="Feature">
                    <Star className="h-3 w-3" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showReply && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden ml-11">
            <div className="flex gap-2 py-2">
              <input value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Write a reply..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white placeholder:text-dark-600 outline-none focus:border-gold-500/30"
                onKeyDown={e => e.key === 'Enter' && handleReply()} />
              <button onClick={handleReply} disabled={!replyText.trim()}
                className="h-8 w-8 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 hover:bg-gold-500/20 disabled:opacity-30 transition-colors">
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {comment.replies && comment.replies.length > 0 && (
        <div>
          <button onClick={() => setShowReplies(!showReplies)} className="flex items-center gap-1 text-[10px] font-bold text-gold-500 uppercase tracking-widest ml-11 mb-1 hover:text-gold-400">
            {showReplies ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
          </button>
          <AnimatePresence>
            {showReplies && comment.replies.map((reply: any) => (
              <motion.div key={reply._id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <CommentItem comment={reply} postId={postId} userId={userId} isPublic={isPublic} depth={depth + 1} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
