import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getForUser = query({
  args: {
    userId: v.id('users'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    return await ctx.db
      .query('notifications')
      .withIndex('by_userId_createdAt', (q) => q.eq('userId', args.userId))
      .order('desc')
      .take(limit);
  },
});

export const getUnreadCount = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const unread = await ctx.db
      .query('notifications')
      .withIndex('by_userId_isRead', (q) => q.eq('userId', args.userId).eq('isRead', false))
      .collect();
    return unread.length;
  },
});

export const getUnread = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('notifications')
      .withIndex('by_userId_isRead', (q) => q.eq('userId', args.userId).eq('isRead', false))
      .order('desc')
      .take(20);
  },
});
