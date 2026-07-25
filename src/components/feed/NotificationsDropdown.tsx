import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../lib/convex-auth';
import { Link } from 'react-router-dom';
import {
  Bell, BellOff, Check, CheckCheck, Trash2, X, Vote, MessageCircle, AtSign,
  Users, Calendar, Radio, Award, Megaphone, Heart, Shield, ChevronRight,
} from 'lucide-react';

const TYPE_ICONS: Record<string, any> = {
  vote: Vote,
  comment: MessageCircle,
  mention: AtSign,
  org_invite: Users,
  event_reminder: Calendar,
  broadcast_starting: Radio,
  judge_invite: Award,
  admin_announcement: Megaphone,
  follow: Users,
  nomination: Award,
  verification: Shield,
  like: Heart,
};

const TYPE_COLORS: Record<string, string> = {
  vote: 'text-gold-500',
  comment: 'text-blue-400',
  mention: 'text-purple-400',
  org_invite: 'text-emerald-400',
  event_reminder: 'text-amber-400',
  broadcast_starting: 'text-red-400',
  judge_invite: 'text-pink-400',
  admin_announcement: 'text-cyan-400',
  follow: 'text-teal-400',
  nomination: 'text-gold-500',
  verification: 'text-emerald-400',
  like: 'text-red-400',
};

export function NotificationsDropdown() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const notifications = useQuery(
    api.notifications.queries.getForUser,
    user?.id ? { firebaseUid: user.id } : 'skip'
  );
  const unreadCount = useQuery(
    api.notifications.queries.getUnreadCount,
    user?.id ? { firebaseUid: user.id } : 'skip'
  );
  const markAsRead = useMutation(api.notifications.mutations.markAsRead);
  const markAllAsRead = useMutation(api.notifications.mutations.markAllAsRead);
  const deleteNotification = useMutation(api.notifications.mutations.deleteNotification);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const unread = (unreadCount ?? 0) > 0;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-dark-800/60 hover:bg-dark-700/80 border border-dark-700/50 transition-all"
      >
        <Bell className={`h-5 w-5 ${unread ? 'text-gold-500' : 'text-dark-400'}`} />
        {unread && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
            {unreadCount! > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 w-80 sm:w-96 bg-dark-900/95 backdrop-blur-xl border border-dark-700/50 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-dark-700/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-gold-500" />
                <h3 className="font-serif italic text-white text-sm">Notifications</h3>
              </div>
              <div className="flex items-center gap-1">
                {unread && (
                  <button
                    onClick={() => markAllAsRead({})}
                    className="text-[10px] text-dark-400 hover:text-gold-500 transition-colors px-2 py-1 rounded-lg hover:bg-dark-800"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto scrollbar-thin">
              {!notifications || notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <BellOff className="h-8 w-8 text-dark-700 mx-auto mb-2" />
                  <p className="text-[11px] text-dark-500">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => {
                  const Icon = TYPE_ICONS[n.type] ?? Bell;
                  const colorClass = TYPE_COLORS[n.type] ?? 'text-dark-400';
                  return (
                    <div
                      key={n._id}
                      className={`px-4 py-3 border-b border-dark-800/50 hover:bg-dark-800/40 transition-colors cursor-pointer flex items-start gap-3 ${
                        !n.isRead ? 'bg-gold-500/5' : ''
                      }`}
                      onClick={() => {
                        if (!n.isRead) markAsRead({ notificationId: n._id });
                        if (n.link) window.location.href = n.link;
                        setIsOpen(false);
                      }}
                    >
                      <div className={`mt-0.5 p-2 rounded-xl bg-dark-800/60 ${colorClass}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium ${!n.isRead ? 'text-white' : 'text-dark-300'}`}>
                          {n.title}
                        </p>
                        <p className="text-[10px] text-dark-500 mt-0.5 truncate">{n.body}</p>
                        <p className="text-[9px] text-dark-600 mt-1">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {!n.isRead && (
                          <span className="h-2 w-2 rounded-full bg-gold-500" />
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification({ notificationId: n._id });
                          }}
                          className="p-1 rounded-lg text-dark-600 hover:text-red-400 hover:bg-dark-800 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {notifications && notifications.length > 0 && (
              <div className="p-3 border-t border-dark-700/50">
                <Link
                  to="/dashboard/notifications"
                  onClick={() => setIsOpen(false)}
                  className="text-[10px] text-gold-500 hover:text-gold-400 font-medium flex items-center justify-center gap-1"
                >
                  View all <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
