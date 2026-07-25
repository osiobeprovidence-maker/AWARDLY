import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Bell, CheckCircle } from 'lucide-react';
import { useAuth } from '../../lib/convex-auth';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface JudgeContext {
  selectedAssignment: any;
  currentEvent: any;
  currentOrg: any;
}

export function JudgeNotifications() {
  const { user } = useAuth();
  const { currentEvent } = useOutletContext<JudgeContext>();

  const notifications = useQuery(
    api.notifications.queries.getUnread,
    user ? { firebaseUid: user.id as any } : 'skip'
  ) ?? [];

  const filteredNotifications = currentEvent
    ? notifications.filter((n: any) => !n.eventId || n.eventId === (currentEvent._id || currentEvent))
    : notifications;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Notifications</h1>
        <p className="text-dark-400 text-sm">Stay updated on your judging assignments.</p>
      </div>

      {filteredNotifications.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Bell className="h-12 w-12 text-dark-600 mx-auto mb-4" />
            <h3 className="text-lg font-serif text-white mb-2">No notifications</h3>
            <p className="text-sm text-dark-400">You're all caught up.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif: any) => (
            <Card key={notif._id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-gold-500/10 flex items-center justify-center shrink-0">
                    <Bell className="h-5 w-5 text-gold-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{notif.title}</p>
                    <p className="text-xs text-dark-400 mt-1">{notif.body}</p>
                    <p className="text-xs text-dark-600 mt-2">
                      {new Date(notif.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
