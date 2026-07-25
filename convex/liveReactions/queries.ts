import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getRecent = query({
  args: {
    broadcastId: v.id('broadcasts'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('liveReactions')
      .withIndex('by_broadcastId', (q) => q.eq('broadcastId', args.broadcastId))
      .order('desc')
      .take(args.limit ?? 30);
  },
});

export const getReactionCounts = query({
  args: { broadcastId: v.id('broadcasts') },
  handler: async (ctx, args) => {
    const reactions = await ctx.db
      .query('liveReactions')
      .withIndex('by_broadcastId', (q) => q.eq('broadcastId', args.broadcastId))
      .take(200);

    const counts: Record<string, number> = {};
    for (const r of reactions) {
      counts[r.emoji] = (counts[r.emoji] || 0) + 1;
    }
    return counts;
  },
});
