import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getByCategory = query({
  args: { categoryId: v.id('categories') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('nominees')
      .withIndex('by_categoryId', (q) => q.eq('categoryId', args.categoryId))
      .filter((q) => q.eq(q.field('isDeleted'), false))
      .collect();
  },
});

export const getByEvent = query({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('nominees')
      .withIndex('by_eventId', (q) => q.eq('eventId', args.eventId))
      .filter((q) => q.eq(q.field('isDeleted'), false))
      .collect();
  },
});

export const getById = query({
  args: { nomineeId: v.id('nominees') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.nomineeId);
  },
});
