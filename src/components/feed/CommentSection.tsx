import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Smile, Trash2, Edit3, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Comment, currentUser, timeAgo, useComments, showToast } from '../../lib/feedData';
import { LikeButton } from './LikeButton';

interface CommentSectionProps {
  initialComments: Comment[];
}

const emojis = ['😂', '❤️', '🔥', '👏', '😍', '🎉', '💯', '🙌', '😢', '🤔', '😎', '✨'];

function CommentItem({ comment, onLike, onDelete, onEdit, onReply, depth = 0 }: {
  comment: Comment;
  onLike: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onReply: (text: string, parentId?: string) => void;
  depth?: number;
}) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState(false);
  const isMe = comment.user.id === 'me';

  const handleEdit = () => {
    if (editText.trim() && editText !== comment.text) {
      onEdit(comment.id, editText.trim());
      setEditing(false);
      showToast('Comment updated', '✓');
    }
  };

  const handleReply = () => {
    if (replyText.trim()) {
      onReply(replyText.trim(), comment.id);
      setReplyText('');
      setShowReply(false);
      setShowReplies(true);
      showToast('Reply posted', '✓');
    }
  };

  return (
    <div className={`${depth > 0 ? 'ml-8 sm:ml-12' : ''}`}>
      <div className="flex gap-3 py-3">
        <img src={comment.user.avatar} alt={comment.user.name} className="h-8 w-8 rounded-full object-cover shrink-0 border border-white/10" referrerPolicy="no-referrer" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-white">{comment.user.name}</span>
            <span className="text-[9px] text-dark-500">{timeAgo(comment.timestamp)}</span>
          </div>
          {editing ? (
            <div className="flex gap-2">
              <input value={editText} onChange={e => setEditText(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[11px] text-white outline-none focus:border-gold-500/30" onKeyDown={e => e.key === 'Enter' && handleEdit()} />
              <button onClick={handleEdit} className="text-[10px] font-bold text-gold-500 uppercase tracking-widest hover:text-gold-400">Save</button>
              <button onClick={() => { setEditing(false); setEditText(comment.text); }} className="text-[10px] font-bold text-dark-500 uppercase tracking-widest hover:text-dark-400">Cancel</button>
            </div>
          ) : (
            <p className="text-[12px] text-dark-300 leading-relaxed">{comment.text}</p>
          )}
          <div className="flex items-center gap-3 mt-1.5">
            <LikeButton liked={comment.likedByMe} count={comment.likes} onToggle={() => onLike(comment.id)} size="sm" />
            <button onClick={() => setShowReply(!showReply)} className="flex items-center gap-1 text-[10px] text-dark-500 hover:text-dark-300 transition-colors">
              <MessageCircle className="h-3 w-3" /> Reply
            </button>
            {isMe && (
              <>
                <button onClick={() => setEditing(true)} className="text-[10px] text-dark-500 hover:text-dark-300 transition-colors"><Edit3 className="h-3 w-3" /></button>
                <button onClick={() => { onDelete(comment.id); showToast('Comment deleted', '✓'); }} className="text-[10px] text-dark-500 hover:text-red-400 transition-colors"><Trash2 className="h-3 w-3" /></button>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Reply Input */}
      <AnimatePresence>
        {showReply && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden ml-11">
            <div className="flex gap-2 py-2">
              <input value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Write a reply..." className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white placeholder:text-dark-600 outline-none focus:border-gold-500/30" onKeyDown={e => e.key === 'Enter' && handleReply()} />
              <button onClick={handleReply} disabled={!replyText.trim()} className="h-8 w-8 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 hover:bg-gold-500/20 disabled:opacity-30 transition-colors"><Send className="h-3.5 w-3.5" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Replies */}
      {comment.replies.length > 0 && (
        <div>
          <button onClick={() => setShowReplies(!showReplies)} className="flex items-center gap-1 text-[10px] font-bold text-gold-500 uppercase tracking-widest ml-11 mb-1 hover:text-gold-400">
            {showReplies ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
          </button>
          <AnimatePresence>
            {showReplies && comment.replies.map(reply => (
              <motion.div key={reply.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <CommentItem comment={reply} onLike={onLike} onDelete={onDelete} onEdit={onEdit} onReply={onReply} depth={depth + 1} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export function CommentSection({ initialComments }: CommentSectionProps) {
  const { comments, add, remove, edit, likeComment } = useComments(initialComments);
  const [newComment, setNewComment] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const handlePost = () => {
    if (newComment.trim()) {
      add(newComment.trim());
      setNewComment('');
      showToast('Comment posted', '✓');
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  return (
    <div className="space-y-0">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle className="h-4 w-4 text-gold-500" />
        <h3 className="text-sm font-bold text-white">{comments.length} Comment{comments.length !== 1 ? 's' : ''}</h3>
      </div>
      {/* Comment Input */}
      <div className="flex gap-3 pb-4 border-b border-white/5">
        <img src={currentUser.avatar} alt="You" className="h-8 w-8 rounded-full object-cover shrink-0 border border-white/10" referrerPolicy="no-referrer" />
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
              <button onClick={() => setShowEmoji(!showEmoji)} className="h-7 w-7 rounded-full flex items-center justify-center text-dark-500 hover:text-dark-300 transition-colors"><Smile className="h-4 w-4" /></button>
              <AnimatePresence>
                {showEmoji && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="absolute bottom-8 right-0 bg-dark-800 border border-white/10 rounded-xl p-2 grid grid-cols-6 gap-1 z-10 shadow-xl">
                    {emojis.map(e => (
                      <button key={e} onClick={() => { setNewComment(p => p + e); setShowEmoji(false); }} className="h-8 w-8 rounded-lg flex items-center justify-center text-base hover:bg-white/10 transition-colors">{e}</button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button onClick={handlePost} disabled={!newComment.trim()} className="h-7 w-7 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 hover:bg-gold-500/20 disabled:opacity-30 transition-colors"><Send className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      </div>
      {/* Comments List */}
      <div className="divide-y divide-white/5">
        {comments.length === 0 && (
          <div className="py-8 text-center">
            <MessageCircle className="h-8 w-8 text-dark-700 mx-auto mb-2" />
            <p className="text-[11px] text-dark-500">No comments yet. Be the first!</p>
          </div>
        )}
        {comments.map(c => (
          <CommentItem key={c.id} comment={c} onLike={likeComment} onDelete={remove} onEdit={edit} onReply={add} />
        ))}
      </div>
      <div ref={endRef} />
    </div>
  );
}
