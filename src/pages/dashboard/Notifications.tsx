import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../lib/convex-auth';
import { Card, CardContent } from '../../components/ui/Card';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import {
  Bell, BellOff, CheckCheck, Check, Trash2, Vote, MessageCircle, AtSign,
  Users, Calendar, Radio, Award, Megaphone, Heart, Shield, Filter,
} from 'lucide-react';

const TYPE_ICONS: Record<string, any> = {
  vote: Vote, comment: MessageCircle, mention: AtSign, org_invite: Users,
  event_reminder: Calendar, broadcast_starting: Radio, judge_invite: Award,
  admin_announcement: Megaphone, follow: Users, nomination: Award,
  verification: Shield, like: Heart,
};

const TYPE_COLORS: Record<string, string> = {
  vote: 'text-gold-500 bg-gold-500/10', comment: 'text-blue-400 bg-blue-400/10',
  mention: 'text-purple-400 bg-purple-400/10', org_invite: 'text-emerald-400 bg-emerald-400/10',
  event_reminder: 'text-amber-400 bg-amber-400/10', broadcast_starting: 'text-red-400 bg-red-400/10',
  judge_invite: 'text-pink-400 bg-pink-400/10', admin_announcement: 'text-cyan-400 bg-cyan-400/10',
  follow: 'text-teal-400 bg-teal-400/10', nomination: 'text-gold-500 bg-gold-500/10',
  verification: 'text-emerald-400 bg-emerald-400/10', like: 'text-red-400 bg-red-400/10',
};

export function NotificationsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const notifications = useQuery(
    api.notifications.queries.getForUser,
    user?.id ? { firebaseUid: user.id, limit: 100 } : 'skip'
  );
  const markAsRead = useMutation(api.notifications.mutations.markAsRead);
  const markAllAsRead = useMutation(api.notifications.mutations.markAllAsRead);
  const deleteNotification = useMutation(api.notifications.mutations.deleteNotification);

  if (!user) return <div className="text-center py-20 text-dark-400">Please log in.</div>;

  const filtered = filter === 'unread'
    ? (notifications ?? []).filter((n) => !n.isRead)
    : (notifications ?? []);

  const unreadCount = (notifications ?? []).filter((n) => !n.isRead).length;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <Breadcrumbs />
        <h1 className="text-3xl font-serif text-white tracking-tight italic mb-2">Notifications</h1>
        <p className="text-dark-500 text-xs font-bold uppercase tracking-widest">
          Stay updated with your activity
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex bg-dark-800/60 rounded-xl p-1 border border-dark-700/50">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
              filter === 'all' ? 'bg-gold-500/20 text-gold-500' : 'text-dark-400 hover:text-white'
            }`}
          >
            All ({notifications?.length ?? 0})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
              filter === 'unread' ? 'bg-gold-500/20 text-gold-500' : 'text-dark-400 hover:text-white'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead({})}
            className="flex items-center gap-1.5 text-[11px] text-dark-400 hover:text-gold-500 transition-colors px-3 py-1.5 rounded-xl hover:bg-dark-800/60"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {!notifications || notifications.length === 0 ? (
            <div className="py-20 text-center">
              <BellOff className="h-12 w-12 text-dark-700 mx-auto mb-3" />
              <p className="text-dark-400 text-sm font-medium">No notifications yet</p>
              <p className="text-dark-600 text-[11px] mt-1">You'll see activity updates here</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Bell className="h-12 w-12 text-dark-700 mx-auto mb-3" />
              <p className="text-dark-400 text-sm">No unread notifications</p>
            </div>
          ) : (
            filtered.map((n) => {
              const Icon = TYPE_ICONS[n.type] ?? Bell;
              const colorClass = TYPE_COLORS[n.type] ?? 'text-dark-400 bg-dark-800/60';
              return (
                <div
                  key={n._id}
                  className={`px-5 py-4 border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors flex items-start gap-4 ${
                    !n.isRead ? 'bg-gold-500/[0.03]' : ''
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!n.isRead ? 'text-white font-medium' : 'text-dark-300'}`}>
                      {n.title}
                    </p>
                    <p className="text-[11px] text-dark-500 mt-1">{n.body}</p>
                    <p className="text-[10px] text-dark-600 mt-2">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!n.isRead && (
                      <button
                        onClick={() => markAsRead({ notificationId: n._id })}
                        className="p-1.5 rounded-lg text-dark-500 hover:text-gold-500 hover:bg-dark-800 transition-colors"
                        title="Mark as read"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification({ notificationId: n._id })}
                      className="p-1.5 rounded-lg text-dark-500 hover:text-red-400 hover:bg-dark-800 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
