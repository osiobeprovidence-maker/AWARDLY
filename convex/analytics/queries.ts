import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getOrgAnalytics = query({
  args: {
    orgId: v.id('organizations'),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let events = ctx.db
      .query('analyticsEvents')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId));

    if (args.startDate) {
      events = events.filter((q) => q.gte(q.field('createdAt'), args.startDate!));
    }
    if (args.endDate) {
      events = events.filter((q) => q.lte(q.field('createdAt'), args.endDate!));
    }

    const allEvents = await events.collect();

    // Aggregate by type
    const byType: Record<string, number> = {};
    for (const e of allEvents) {
      byType[e.type] = (byType[e.type] || 0) + 1;
    }

    // Daily counts
    const daily: Record<string, number> = {};
    for (const e of allEvents) {
      const day = e.createdAt.slice(0, 10);
      daily[day] = (daily[day] || 0) + 1;
    }

    return {
      total: allEvents.length,
      byType,
      daily,
    };
  },
});

export const getEventAnalytics = query({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    const allEvents = await ctx.db
      .query('analyticsEvents')
      .withIndex('by_eventId', (q) => q.eq('eventId', args.eventId))
      .collect();

    const byType: Record<string, number> = {};
    for (const e of allEvents) {
      byType[e.type] = (byType[e.type] || 0) + 1;
    }

    return {
      total: allEvents.length,
      byType,
    };
  },
});
