import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getByEvent = query({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('broadcasts')
      .withIndex('by_eventId', (q) => q.eq('eventId', args.eventId))
      .collect();
  },
});

export const getLive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('broadcasts')
      .withIndex('by_status', (q) => q.eq('status', 'live'))
      .collect();
  },
});

export const getUpcoming = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('broadcasts')
      .withIndex('by_status', (q) => q.eq('status', 'scheduled'))
      .collect();
  },
});

export const getById = query({
  args: { broadcastId: v.id('broadcasts') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.broadcastId);
  },
});
