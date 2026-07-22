import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getByEvent = query({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('categories')
      .withIndex('by_eventId', (q) => q.eq('eventId', args.eventId))
      .filter((q) => q.eq(q.field('isDeleted'), false))
      .collect();
  },
});

export const getById = query({
  args: { categoryId: v.id('categories') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.categoryId);
  },
});
