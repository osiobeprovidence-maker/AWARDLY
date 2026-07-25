import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser } from '../shared/helpers';

export const addItem = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal('image'), v.literal('video'), v.literal('pdf'), v.literal('link')),
    url: v.string(),
    thumbnailUrl: v.optional(v.string()),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const existing = await ctx.db
      .query('portfolioItems')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .order('desc')
      .take(1);
    const nextOrder = existing.length > 0 ? (existing[0].displayOrder + 1) : 0;

    return await ctx.db.insert('portfolioItems', {
      userId: user._id,
      title: args.title,
      description: args.description,
      type: args.type,
      url: args.url,
      thumbnailUrl: args.thumbnailUrl,
      displayOrder: nextOrder,
      isPublic: args.isPublic,
      isDeleted: false,
      createdAt: new Date().toISOString(),
    });
  },
});

export const updateItem = mutation({
  args: {
    itemId: v.id('portfolioItems'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    isPublic: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const item = await ctx.db.get(args.itemId);
    if (!item || item.userId !== user._id) throw new Error('Not found');

    const updates: Record<string, any> = {};
    if (args.title !== undefined) updates.title = args.title;
    if (args.description !== undefined) updates.description = args.description;
    if (args.isPublic !== undefined) updates.isPublic = args.isPublic;
    await ctx.db.patch(args.itemId, updates);
  },
});

export const removeItem = mutation({
  args: { itemId: v.id('portfolioItems') },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const item = await ctx.db.get(args.itemId);
    if (!item || item.userId !== user._id) throw new Error('Not found');
    await ctx.db.patch(args.itemId, { isDeleted: true });
  },
});

export const reorderItems = mutation({
  args: {
    itemIds: v.array(v.id('portfolioItems')),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    for (let i = 0; i < args.itemIds.length; i++) {
      const item = await ctx.db.get(args.itemIds[i]);
      if (item && item.userId === user._id) {
        await ctx.db.patch(args.itemIds[i], { displayOrder: i });
      }
    }
  },
});
