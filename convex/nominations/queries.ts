import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getByEvent = query({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('nominations')
      .withIndex('by_eventId', (q) => q.eq('eventId', args.eventId))
      .collect();
  },
});

export const getByEventAndStatus = query({
  args: {
    eventId: v.id('events'),
    status: v.union(
      v.literal('pending'), v.literal('approved'),
      v.literal('rejected'), v.literal('shortlisted'),
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('nominations')
      .withIndex('by_eventId_status', (q) =>
        q.eq('eventId', args.eventId).eq('status', args.status)
      )
      .collect();
  },
});

export const getByOrg = query({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('nominations')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .collect();
  },
});

export const getById = query({
  args: { nominationId: v.id('nominations') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.nominationId);
  },
});

export const getEventNominationStatus = query({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) return null;

    const now = new Date().toISOString();
    const nominationsOpen = event.status !== 'draft' && event.status !== 'archived'
      && (!event.nominationStart || event.nominationStart <= now)
      && (!event.nominationEnd || event.nominationEnd > now);

    return {
      eventId: event._id,
      nominationsOpen,
      nominationStart: event.nominationStart,
      nominationEnd: event.nominationEnd,
    };
  },
});

export const getBySubmitterEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    if (!args.email) return [];

    return await ctx.db
      .query('nominations')
      .withIndex('by_submitterEmail', (q) => q.eq('submitterEmail', args.email))
      .order('desc')
      .collect();
  },
});
