import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getRecent = query({
  args: {
    broadcastId: v.id('broadcasts'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query('liveChat')
      .withIndex('by_broadcastId_createdAt', (q) => q.eq('broadcastId', args.broadcastId))
      .order('desc')
      .take(args.limit ?? 50);

    const result = [];
    for (const msg of messages) {
      if (msg.isDeleted) continue;
      const user = await ctx.db.get(msg.userId);
      result.push({
        ...msg,
        user: user ? { name: user.name, avatarUrl: user.avatarUrl } : null,
      });
    }

    return result.reverse();
  },
});

export const getRecentWithDeleted = query({
  args: {
    broadcastId: v.id('broadcasts'),
    orgId: v.id('organizations'),
  },
  handler: async (ctx, args) => {
    // Only for org moderators
    const messages = await ctx.db
      .query('liveChat')
      .withIndex('by_broadcastId_createdAt', (q) => q.eq('broadcastId', args.broadcastId))
      .order('desc')
      .take(100);

    const result = [];
    for (const msg of messages) {
      const user = await ctx.db.get(msg.userId);
      result.push({
        ...msg,
        user: user ? { name: user.name, avatarUrl: user.avatarUrl } : null,
      });
    }

    return result.reverse();
  },
});
