/**
 * Notification Service
 * Wraps Convex queries/mutations for notifications.
 */
import { useQuery, useMutation } from 'convex/react';

// ─── Queries ────────────────────────────────────────────────────────────────

export function useNotifications(userId: string | undefined, limit?: number) {
  return useQuery(
    'notifications:getForUser',
    userId ? { userId: userId as any, limit } : 'skip'
  );
}

export function useUnreadNotificationCount(userId: string | undefined) {
  return useQuery(
    'notifications:getUnreadCount',
    userId ? { userId: userId as any } : 'skip'
  );
}

export function useUnreadNotifications(userId: string | undefined) {
  return useQuery(
    'notifications:getUnread',
    userId ? { userId: userId as any } : 'skip'
  );
}

// ─── Mutations ──────────────────────────────────────────────────────────────

export function useMarkNotificationRead() {
  return useMutation('notifications:markAsRead');
}

export function useMarkAllNotificationsRead() {
  return useMutation('notifications:markAllAsRead');
}

export function useDeleteNotification() {
  return useMutation('notifications:deleteNotification');
}
