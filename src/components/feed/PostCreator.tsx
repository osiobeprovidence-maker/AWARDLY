import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { ImageUpload } from '../ImageUpload';
import {
  Image as ImageIcon, Video, BarChart3, Link2, Calendar, Clock,
  Send, X, Plus, Trash2, Eye, EyeOff, Users, Gavel, Shield, FileText,
  ChevronDown, Loader2, Globe, Lock, Sparkles,
} from 'lucide-react';
import { useAuth } from '../../lib/convex-auth';
import { useToast } from '../../lib/toast';

const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public', icon: Globe, desc: 'Anyone can see' },
  { value: 'members_only', label: 'Members', icon: Users, desc: 'Only org members' },
  { value: 'judges_only', label: 'Judges', icon: Gavel, desc: 'Only judges' },
  { value: 'staff_only', label: 'Staff', icon: Shield, desc: 'Only staff' },
] as const;

interface PostCreatorProps {
  onPostCreated?: () => void;
}

export function PostCreator({ onPostCreated }: PostCreatorProps) {
  const { currentOrg, currentRole, user } = useAuth();
  const { toast } = useToast();
  const createPost = useMutation(api.feeds.mutations.createPost);
  const generateUploadUrl = useMutation(api.storage.mutations.generateUploadUrl);

  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'members_only' | 'judges_only' | 'staff_only'>('public');
  const [storageIds, setStorageIds] = useState<string[]>([]);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState([{ id: '1', label: '' }, { id: '2', label: '' }]);
  const [pollEndsAt, setPollEndsAt] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');
  const [showSchedule, setShowSchedule] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const resolvedUrls = useQuery(
    api.storage.queries.getUrls,
    storageIds.length > 0 ? { storageIds } : 'skip'
  );
  const mediaUrls = resolvedUrls
    ? Object.values(resolvedUrls).filter((url): url is string => url !== null)
    : [];

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentOrg || !user) return null;

  const canPost = currentRole === 'owner' || currentRole === 'admin' || currentRole === 'event_manager' || currentRole === 'moderator' || currentRole === 'content_editor';
  if (!canPost) return null;

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newIds: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadUrl = await generateUploadUrl();
        const result = await globalThis.fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': file.type },
          body: file,
        });
        const { storageId } = await result.json();
        if (storageId) newIds.push(storageId);
      }
      setStorageIds(prev => [...prev, ...newIds]);
    } catch (error) {
      toast('Upload failed', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const addPollOption = () => {
    if (pollOptions.length >= 6) return;
    setPollOptions(prev => [...prev, { id: String(Date.now()), label: '' }]);
  };

  const removePollOption = (id: string) => {
    if (pollOptions.length <= 2) return;
    setPollOptions(prev => prev.filter(o => o.id !== id));
  };

  const detectPostType = (): 'text' | 'image' | 'video' | 'poll' => {
    if (showPollCreator && pollQuestion.trim()) return 'poll';
    if (mediaUrls.length > 0) {
      const hasVideo = mediaUrls.some(u => u.includes('video') || u.includes('.mp4'));
      return hasVideo ? 'video' : 'image';
    }
    return 'text';
  };

  const handlePublish = async () => {
    if (!content.trim() && mediaUrls.length === 0 && !showPollCreator) {
      toast('Write something or add media', 'error');
      return;
    }

    if (showPollCreator && (!pollQuestion.trim() || pollOptions.filter(o => o.label.trim()).length < 2)) {
      toast('Add a poll question and at least 2 options', 'error');
      return;
    }

    setPublishing(true);
    try {
      await createPost({
        orgId: currentOrg.id as any,
        content: content.trim(),
        visibility,
        postType: detectPostType(),
        mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
        linkUrl: linkUrl || undefined,
        linkTitle: linkTitle || undefined,
        scheduledAt: scheduledAt || undefined,
        pollQuestion: showPollCreator ? pollQuestion : undefined,
        pollOptions: showPollCreator ? pollOptions.filter(o => o.label.trim()) : undefined,
        pollEndsAt: showPollCreator && pollEndsAt ? new Date(pollEndsAt).toISOString() : undefined,
        firebaseUid: user.id,
      });

      toast(scheduledAt ? 'Post scheduled!' : 'Post published!', 'success');
      setContent('');
      setStorageIds([]);
      setShowPollCreator(false);
      setPollQuestion('');
      setPollOptions([{ id: '1', label: '' }, { id: '2', label: '' }]);
      setPollEndsAt('');
      setLinkUrl('');
      setLinkTitle('');
      setShowLinkInput(false);
      setScheduledAt('');
      setShowSchedule(false);
      setExpanded(false);
      onPostCreated?.();
    } catch (error: any) {
      toast(error.message || 'Failed to create post', 'error');
    } finally {
      setPublishing(false);
    }
  };

  const saveDraft = async () => {
    if (!content.trim() && mediaUrls.length === 0) {
      toast('Nothing to save', 'error');
      return;
    }
    setPublishing(true);
    try {
      await createPost({
        orgId: currentOrg.id as any,
        content: content.trim(),
        visibility,
        postType: detectPostType(),
        mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
        scheduledAt: undefined,
        firebaseUid: user.id,
      });
      toast('Draft saved', 'success');
      setContent('');
      setStorageIds([]);
      setExpanded(false);
    } catch (error: any) {
      toast(error.message || 'Failed to save draft', 'error');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <Card className="bg-dark-900 border-white/5 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex gap-4 mb-4">
          {currentOrg.logoUrl ? (
            <img src={currentOrg.logoUrl} className="h-12 w-12 rounded-xl object-cover border border-white/10 shrink-0" alt="org" referrerPolicy="no-referrer" />
          ) : (
            <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center font-serif text-gold-500 text-lg shrink-0">
              {(currentOrg.name as string)[0]}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-bold text-white">{currentOrg.name}</span>
              <select
                value={visibility}
                onChange={e => setVisibility(e.target.value as any)}
                className="text-[10px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-dark-400 outline-none focus:border-gold-500/30 cursor-pointer"
              >
                {VISIBILITY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <textarea
              className="w-full bg-transparent border-0 focus:ring-0 text-white placeholder:text-dark-600 resize-none text-sm leading-relaxed outline-none min-h-[60px]"
              placeholder="Announce something spectacular..."
              value={content}
              onChange={e => setContent(e.target.value)}
              onFocus={() => setExpanded(true)}
              rows={expanded ? 4 : 2}
            />
          </div>
        </div>

        {/* Media Preview */}
        {mediaUrls.length > 0 && (
          <div className="mb-4 grid grid-cols-2 gap-2">
            {mediaUrls.map((url, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden aspect-video bg-dark-800 group">
                <img src={url} className="w-full h-full object-cover" alt="upload" referrerPolicy="no-referrer" />
                <button
                  onClick={() => setStorageIds(prev => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-2 right-2 h-6 w-6 rounded-full bg-dark-950/80 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Poll Creator */}
        <AnimatePresence>
          {showPollCreator && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <BarChart3 className="h-3.5 w-3.5 text-gold-500" /> Create Poll
                  </h4>
                  <button onClick={() => setShowPollCreator(false)} className="text-dark-500 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <input
                  value={pollQuestion}
                  onChange={e => setPollQuestion(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-dark-600 outline-none focus:border-gold-500/30"
                />
                <div className="space-y-2">
                  {pollOptions.map((opt, i) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-dark-500 w-4">{i + 1}.</span>
                      <input
                        value={opt.label}
                        onChange={e => setPollOptions(prev => prev.map(p => p.id === opt.id ? { ...p, label: e.target.value } : p))}
                        placeholder={`Option ${i + 1}`}
                        className="flex-1 bg-dark-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-dark-600 outline-none focus:border-gold-500/30"
                      />
                      {pollOptions.length > 2 && (
                        <button onClick={() => removePollOption(opt.id)} className="text-dark-500 hover:text-red-400">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  {pollOptions.length < 6 && (
                    <button onClick={addPollOption} className="text-[10px] font-bold text-gold-500 uppercase tracking-widest flex items-center gap-1 hover:text-gold-400">
                      <Plus className="h-3 w-3" /> Add Option
                    </button>
                  )}
                  <div className="flex-1" />
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-dark-500" />
                    <input
                      type="datetime-local"
                      value={pollEndsAt}
                      onChange={e => setPollEndsAt(e.target.value)}
                      className="bg-dark-900 border border-white/10 rounded-lg px-3 py-1.5 text-[11px] text-dark-400 outline-none focus:border-gold-500/30"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Link Input */}
        <AnimatePresence>
          {showLinkInput && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <Link2 className="h-3.5 w-3.5 text-gold-500" /> Attach Link
                  </h4>
                  <button onClick={() => { setShowLinkInput(false); setLinkUrl(''); setLinkTitle(''); }} className="text-dark-500 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <input
                  value={linkUrl}
                  onChange={e => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-dark-600 outline-none focus:border-gold-500/30"
                />
                <input
                  value={linkTitle}
                  onChange={e => setLinkTitle(e.target.value)}
                  placeholder="Link title (optional)"
                  className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-dark-600 outline-none focus:border-gold-500/30"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Schedule */}
        <AnimatePresence>
          {showSchedule && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-center gap-4">
                <Calendar className="h-4 w-4 text-gold-500" />
                <span className="text-xs font-bold text-white uppercase tracking-widest">Schedule for:</span>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={e => setScheduledAt(e.target.value)}
                  className="bg-dark-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-gold-500/30"
                />
                <button onClick={() => { setShowSchedule(false); setScheduledAt(''); }} className="text-dark-500 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        {expanded && (
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-1">
              <input ref={fileInputRef} type="file" multiple accept="image/*,video/*,.pdf" className="hidden" onChange={handleMediaUpload} />
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3 text-dark-400 hover:text-gold-400 hover:bg-white/5 rounded-xl"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <ImageIcon className="h-4 w-4 mr-1" />}
                <span className="text-[10px] font-bold uppercase tracking-widest">Media</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-9 px-3 hover:bg-white/5 rounded-xl ${showPollCreator ? 'text-gold-400' : 'text-dark-400 hover:text-gold-400'}`}
                onClick={() => setShowPollCreator(!showPollCreator)}
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Poll</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-9 px-3 hover:bg-white/5 rounded-xl ${showLinkInput ? 'text-gold-400' : 'text-dark-400 hover:text-gold-400'}`}
                onClick={() => setShowLinkInput(!showLinkInput)}
              >
                <Link2 className="h-4 w-4 mr-1" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Link</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-9 px-3 hover:bg-white/5 rounded-xl ${showSchedule ? 'text-gold-400' : 'text-dark-400 hover:text-gold-400'}`}
                onClick={() => setShowSchedule(!showSchedule)}
              >
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Schedule</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-9 text-dark-400 text-[10px] font-bold uppercase tracking-widest" onClick={saveDraft} disabled={publishing}>
                Save Draft
              </Button>
              <Button
                size="sm"
                className="px-6 h-9 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-gold-500/10"
                onClick={handlePublish}
                disabled={publishing || (!content.trim() && mediaUrls.length === 0 && !showPollCreator)}
              >
                {publishing ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Send className="h-3.5 w-3.5 mr-1" />}
                {scheduledAt ? 'Schedule' : 'Publish'}
              </Button>
            </div>
          </div>
        )}

        {!expanded && content === '' && mediaUrls.length === 0 && (
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-9 px-3 text-dark-400 hover:text-gold-400 hover:bg-white/5 rounded-xl" onClick={() => fileInputRef.current?.click()}>
                <ImageIcon className="h-4 w-4 mr-1" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Media</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-9 px-3 text-dark-400 hover:text-gold-400 hover:bg-white/5 rounded-xl" onClick={() => { setExpanded(true); setShowPollCreator(true); }}>
                <BarChart3 className="h-4 w-4 mr-1" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Poll</span>
              </Button>
            </div>
            <Button size="sm" className="px-6 h-9 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-gold-500/10" onClick={() => setExpanded(true)}>
              <Sparkles className="h-3.5 w-3.5 mr-1" /> Create Post
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
