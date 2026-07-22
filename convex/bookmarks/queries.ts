import { query } from '../_generated/server';
import { v } from 'convex/values';
import { getCurrentUser } from '../shared/helpers';

export const isBookmarked = query({
  args: {
    targetType: v.union(v.literal('event'), v.literal('post'), v.literal('nominee')),
    targetId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return false;

    const bookmark = await ctx.db
      .query('bookmarks')
      .withIndex('by_userId_targetType', (q) =>
        q.eq('userId', user._id).eq('targetType', args.targetType)
      )
      .filter((q) => q.eq(q.field('targetId'), args.targetId))
      .unique();

    return !!bookmark;
  },
});

export const getUserBookmarks = query({
  args: {
    targetType: v.optional(v.union(v.literal('event'), v.literal('post'), v.literal('nominee'))),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    let query = ctx.db
      .query('bookmarks')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .order('desc');

    if (args.targetType) {
      query = ctx.db
        .query('bookmarks')
        .withIndex('by_userId_targetType', (q) =>
          q.eq('userId', user._id).eq('targetType', args.targetType!)
        )
        .order('desc');
    }

    return await query.collect();
  },
});

export const getBookmarksByEvent = query({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('bookmarks')
      .withIndex('by_userId_targetType', (q) =>
        q.eq('targetType', 'event')
      )
      .filter((q) => q.eq(q.field('targetId'), args.eventId))
      .order('desc')
      .collect();
  },
});

export const getBookmarkCounts = query({
  args: {
    targetType: v.union(v.literal('event'), v.literal('post'), v.literal('nominee')),
    targetIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const counts: Record<string, number> = {};
    for (const id of args.targetIds) {
      counts[id] = 0;
    }

    for (const id of args.targetIds) {
      const bookmarks = await ctx.db
        .query('bookmarks')
        .withIndex('by_userId_targetType', (q) =>
          q.eq('targetType', args.targetType)
        )
        .filter((q) => q.eq(q.field('targetId'), id))
        .collect();
      counts[id] = bookmarks.length;
    }

    return counts;
  },
});
