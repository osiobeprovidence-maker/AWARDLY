import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../lib/convex-auth';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import {
  Bell, BellOff, CheckCheck, Heart, MessageCircle, AtSign, Users,
  Calendar, Radio, Award, Megaphone, Vote, Shield, ChevronRight,
} from 'lucide-react';

const TYPE_ICONS: Record<string, any> = {
  vote: Vote, comment: MessageCircle, mention: AtSign, org_invite: Users,
  event_reminder: Calendar, broadcast_starting: Radio, judge_invite: Award,
  admin_announcement: Megaphone, follow: Users, nomination: Award,
  verification: Shield, like: Heart,
};

const TYPE_COLORS: Record<string, string> = {
  vote: 'bg-gold-500/10 text-gold-500', comment: 'bg-sky-500/10 text-sky-500',
  mention: 'bg-purple-500/10 text-purple-400', org_invite: 'bg-emerald-500/10 text-emerald-400',
  event_reminder: 'bg-amber-500/10 text-amber-400', broadcast_starting: 'bg-red-500/10 text-red-400',
  judge_invite: 'bg-pink-500/10 text-pink-400', admin_announcement: 'bg-cyan-500/10 text-cyan-400',
  follow: 'bg-teal-500/10 text-teal-400', nomination: 'bg-gold-500/10 text-gold-500',
  verification: 'bg-emerald-500/10 text-emerald-400', like: 'bg-red-500/10 text-red-400',
};

export function NotificationPopover({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user } = useAuth();

  const notifications = useQuery(
    api.notifications.queries.getForUser,
    user?.id ? { firebaseUid: user.id, limit: 20 } : 'skip'
  );
  const unreadCount = useQuery(
    api.notifications.queries.getUnreadCount,
    user?.id ? { firebaseUid: user.id } : 'skip'
  );
  const markAsRead = useMutation(api.notifications.mutations.markAsRead);
  const markAllAsRead = useMutation(api.notifications.mutations.markAllAsRead);

  const handleMarkAllRead = () => {
    markAllAsRead({});
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-16 right-0 w-96 bg-dark-900 border border-white/10 rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-dark-950/40">
              <div>
                <h3 className="text-white font-serif text-lg leading-none mb-1">Notifications</h3>
                <p className="text-[10px] font-bold text-dark-500 uppercase tracking-widest">
                  {(unreadCount ?? 0) > 0 ? `${unreadCount} unread` : 'All caught up'}
                </p>
              </div>
              {(unreadCount ?? 0) > 0 && (
                <button
                  className="text-[10px] font-bold text-gold-500 uppercase tracking-widest hover:text-white transition-colors"
                  onClick={handleMarkAllRead}
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {!notifications || notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <BellOff className="h-8 w-8 text-dark-600 mx-auto mb-3" />
                  <p className="text-sm text-dark-400">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notif) => {
                  const Icon = TYPE_ICONS[notif.type] ?? Bell;
                  const colorClass = TYPE_COLORS[notif.type] ?? 'bg-white/5 text-dark-400';
                  return (
                    <div
                      key={notif._id}
                      className={`p-5 flex items-start gap-4 hover:bg-white/5 transition-all cursor-pointer border-b border-white/5 last:border-0 ${
                        !notif.isRead ? 'bg-gold-500/[0.02]' : ''
                      }`}
                      onClick={() => {
                        if (!notif.isRead) markAsRead({ notificationId: notif._id });
                        if (notif.link) window.location.href = notif.link;
                        onClose();
                      }}
                    >
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-medium ${!notif.isRead ? 'text-white' : 'text-dark-300'}`}>
                            {notif.title}
                          </h4>
                          <span className="text-[10px] text-dark-500 font-medium">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-dark-400 leading-relaxed">{notif.body}</p>
                      </div>
                      {!notif.isRead && (
                        <div className="h-2 w-2 rounded-full bg-gold-500 mt-2" />
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 bg-dark-950/40 text-center">
              <Link
                to="/dashboard/notifications"
                onClick={onClose}
                className="text-[10px] font-bold uppercase tracking-widest text-gold-500 hover:text-gold-400 flex items-center justify-center gap-1"
              >
                View all <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
