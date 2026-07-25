/**
 * Notification Service
 * Wraps Convex queries/mutations for notifications.
 */
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

// ─── Queries ────────────────────────────────────────────────────────────────

export function useNotifications(firebaseUid: string | undefined, limit?: number) {
  return useQuery(
    api.notifications.queries.getForUser,
    firebaseUid ? { firebaseUid, limit } : 'skip'
  );
}

export function useUnreadNotificationCount(firebaseUid: string | undefined) {
  return useQuery(
    api.notifications.queries.getUnreadCount,
    firebaseUid ? { firebaseUid } : 'skip'
  );
}

export function useUnreadNotifications(firebaseUid: string | undefined) {
  return useQuery(
    api.notifications.queries.getUnread,
    firebaseUid ? { firebaseUid } : 'skip'
  );
}

// ─── Mutations ──────────────────────────────────────────────────────────────

export function useMarkNotificationRead() {
  return useMutation(api.notifications.mutations.markAsRead);
}

export function useMarkAllNotificationsRead() {
  return useMutation(api.notifications.mutations.markAllAsRead);
}

export function useDeleteNotification() {
  return useMutation(api.notifications.mutations.deleteNotification);
}
