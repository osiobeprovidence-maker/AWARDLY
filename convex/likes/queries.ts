import { query } from '../_generated/server';
import { v } from 'convex/values';
import { getCurrentUser } from '../shared/helpers';

export const hasLiked = query({
  args: {
    targetType: v.union(v.literal('post'), v.literal('comment'), v.literal('nominee')),
    targetId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return false;

    const like = await ctx.db
      .query('likes')
      .withIndex('by_userId_targetType_targetId', (q) =>
        q
          .eq('userId', user._id)
          .eq('targetType', args.targetType)
          .eq('targetId', args.targetId)
      )
      .unique();

    return !!like;
  },
});

export const getLikeCount = query({
  args: {
    targetType: v.union(v.literal('post'), v.literal('comment'), v.literal('nominee')),
    targetId: v.string(),
  },
  handler: async (ctx, args) => {
    const likes = await ctx.db
      .query('likes')
      .withIndex('by_targetType_targetId', (q) =>
        q.eq('targetType', args.targetType).eq('targetId', args.targetId)
      )
      .collect();

    return likes.length;
  },
});

export const getLikeCounts = query({
  args: {
    targetType: v.union(v.literal('post'), v.literal('comment'), v.literal('nominee')),
    targetIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const counts: Record<string, number> = {};
    for (const id of args.targetIds) {
      counts[id] = 0;
    }

    for (const id of args.targetIds) {
      const likes = await ctx.db
        .query('likes')
        .withIndex('by_targetType_targetId', (q) =>
          q.eq('targetType', args.targetType).eq('targetId', id)
        )
        .collect();
      counts[id] = likes.length;
    }

    return counts;
  },
});

export const getUserLikes = query({
  args: {
    targetType: v.optional(v.union(v.literal('post'), v.literal('comment'), v.literal('nominee'))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const limit = args.limit ?? 50;

    let q = ctx.db
      .query('likes')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .order('desc');

    if (args.targetType) {
      q = ctx.db
        .query('likes')
        .withIndex('by_userId_targetType_targetId', (q) =>
          q.eq('userId', user._id).eq('targetType', args.targetType!)
        )
        .order('desc');
    }

    return await q.take(limit);
  },
});
