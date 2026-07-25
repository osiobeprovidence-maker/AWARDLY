import { query } from '../_generated/server';
import { v } from 'convex/values';

async function resolveUserId(ctx: any, firebaseUid?: string, userId?: string) {
  if (userId) return userId;
  if (firebaseUid) {
    const user = await ctx.db
      .query('users')
      .withIndex('by_firebaseUid', (q: any) => q.eq('firebaseUid', firebaseUid))
      .unique();
    return user?._id ?? null;
  }
  return null;
}

export const getForUser = query({
  args: {
    firebaseUid: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await resolveUserId(ctx, args.firebaseUid);
    if (!userId) return [];
    const limit = args.limit ?? 50;
    return await ctx.db
      .query('notifications')
      .withIndex('by_userId_createdAt', (q) => q.eq('userId', userId as any))
      .order('desc')
      .take(limit);
  },
});

export const getUnreadCount = query({
  args: { firebaseUid: v.string() },
  handler: async (ctx, args) => {
    const userId = await resolveUserId(ctx, args.firebaseUid);
    if (!userId) return 0;
    const unread = await ctx.db
      .query('notifications')
      .withIndex('by_userId_isRead', (q) => q.eq('userId', userId as any).eq('isRead', false))
      .collect();
    return unread.length;
  },
});

export const getUnread = query({
  args: { firebaseUid: v.string() },
  handler: async (ctx, args) => {
    const userId = await resolveUserId(ctx, args.firebaseUid);
    if (!userId) return [];
    return await ctx.db
      .query('notifications')
      .withIndex('by_userId_isRead', (q) => q.eq('userId', userId as any).eq('isRead', false))
      .order('desc')
      .take(20);
  },
});
