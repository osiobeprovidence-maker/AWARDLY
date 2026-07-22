import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser } from '../shared/helpers';

export const markAsRead = mutation({
  args: { notificationId: v.id('notifications') },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const notification = await ctx.db.get(args.notificationId);
    if (!notification) throw new Error('Notification not found');
    if (notification.userId !== user._id) throw new Error('Not your notification');

    await ctx.db.patch(args.notificationId, { isRead: true });
  },
});

export const markAllAsRead = mutation({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (user._id !== args.userId) throw new Error('Can only mark your own notifications');

    const unread = await ctx.db
      .query('notifications')
      .withIndex('by_userId_isRead', (q) => q.eq('userId', args.userId).eq('isRead', false))
      .collect();

    for (const n of unread) {
      await ctx.db.patch(n._id, { isRead: true });
    }

    return unread.length;
  },
});

export const deleteNotification = mutation({
  args: { notificationId: v.id('notifications') },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const notification = await ctx.db.get(args.notificationId);
    if (!notification) throw new Error('Notification not found');
    if (notification.userId !== user._id) throw new Error('Not your notification');

    await ctx.db.delete(args.notificationId);
  },
});
