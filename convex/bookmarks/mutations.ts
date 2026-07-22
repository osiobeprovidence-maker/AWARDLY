import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser } from '../shared/helpers';

export const create = mutation({
  args: {
    targetType: v.union(v.literal('event'), v.literal('post'), v.literal('nominee')),
    targetId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const existing = await ctx.db
      .query('bookmarks')
      .withIndex('by_userId_targetType', (q) =>
        q.eq('userId', user._id).eq('targetType', args.targetType)
      )
      .filter((q) => q.eq(q.field('targetId'), args.targetId))
      .unique();

    if (existing) {
      throw new Error('Already bookmarked');
    }

    return await ctx.db.insert('bookmarks', {
      userId: user._id,
      targetType: args.targetType,
      targetId: args.targetId,
      createdAt: new Date().toISOString(),
    });
  },
});

export const remove = mutation({
  args: {
    targetType: v.union(v.literal('event'), v.literal('post'), v.literal('nominee')),
    targetId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const existing = await ctx.db
      .query('bookmarks')
      .withIndex('by_userId_targetType', (q) =>
        q.eq('userId', user._id).eq('targetType', args.targetType)
      )
      .filter((q) => q.eq(q.field('targetId'), args.targetId))
      .unique();

    if (!existing) {
      throw new Error('Bookmark not found');
    }

    if (existing.userId !== user._id) {
      throw new Error('Cannot remove another user\'s bookmark');
    }

    await ctx.db.delete(existing._id);
  },
});

export const toggle = mutation({
  args: {
    targetType: v.union(v.literal('event'), v.literal('post'), v.literal('nominee')),
    targetId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const existing = await ctx.db
      .query('bookmarks')
      .withIndex('by_userId_targetType', (q) =>
        q.eq('userId', user._id).eq('targetType', args.targetType)
      )
      .filter((q) => q.eq(q.field('targetId'), args.targetId))
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return false;
    }

    await ctx.db.insert('bookmarks', {
      userId: user._id,
      targetType: args.targetType,
      targetId: args.targetId,
      createdAt: new Date().toISOString(),
    });
    return true;
  },
});
