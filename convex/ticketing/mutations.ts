import { mutation, query } from '../_generated/server';
import { v } from 'convex/values';

export const updateCeremony = mutation({
  args: {
    eventId: v.id('events'),
    awardFormat: v.union(v.literal('online'), v.literal('physical'), v.literal('hybrid')),
    ceremony: v.object({
      venueName: v.optional(v.string()),
      venueAddress: v.optional(v.string()),
      coordinates: v.optional(v.object({ lat: v.number(), lng: v.number() })),
      date: v.optional(v.string()),
      time: v.optional(v.string()),
      host: v.optional(v.string()),
      dressCode: v.optional(v.string()),
      capacity: v.optional(v.number()),
      parkingInfo: v.optional(v.string()),
      accessibilityNotes: v.optional(v.string()),
      description: v.optional(v.string()),
      livestreamUrl: v.optional(v.string()),
      winnerAnnouncementDate: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error('Event not found');

    await ctx.db.patch(args.eventId, {
      awardFormat: args.awardFormat,
      ceremony: args.ceremony,
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  },
});

export const connectTicketEvent = mutation({
  args: {
    eventId: v.id('events'),
    ticketEventId: v.string(),
    ticketUrl: v.string(),
    eventName: v.string(),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error('Event not found');

    await ctx.db.patch(args.eventId, {
      ticketing: {
        provider: 'myinvite',
        ticketEventId: args.ticketEventId,
        ticketUrl: args.ticketUrl,
        ticketStatus: 'connected',
        ticketSales: 0,
        ticketRevenue: 0,
        guestCount: 0,
        eventName: args.eventName,
      },
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  },
});

export const disconnectTicketEvent = mutation({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.eventId, {
      ticketing: undefined,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  },
});

export const updateTicketStatus = mutation({
  args: {
    eventId: v.id('events'),
    ticketStatus: v.union(
      v.literal('not_connected'),
      v.literal('connected'),
      v.literal('syncing'),
      v.literal('error'),
    ),
    ticketSales: v.optional(v.number()),
    ticketRevenue: v.optional(v.number()),
    guestCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error('Event not found');

    const existing = event.ticketing;
    if (!existing) throw new Error('No ticketing configured');

    await ctx.db.patch(args.eventId, {
      ticketing: {
        ...existing,
        ticketStatus: args.ticketStatus,
        ...(args.ticketSales !== undefined && { ticketSales: args.ticketSales }),
        ...(args.ticketRevenue !== undefined && { ticketRevenue: args.ticketRevenue }),
        ...(args.guestCount !== undefined && { guestCount: args.guestCount }),
      },
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  },
});

export const getCeremonyByEvent = query({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) return null;

    return {
      awardFormat: event.awardFormat,
      ceremony: event.ceremony,
      ticketing: event.ticketing,
      title: event.title,
      date: event.date,
      time: event.time,
      venue: event.venue,
      status: event.status,
    };
  },
});

export const getTicketingByEvent = query({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) return null;
    return event.ticketing ?? null;
  },
});

export const getCeremonyOverview = query({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) return null;

    const categories = await ctx.db
      .query('categories')
      .withIndex('by_eventId', (q) => q.eq('eventId', args.eventId))
      .collect();

    return {
      title: event.title,
      awardFormat: event.awardFormat,
      ceremony: event.ceremony,
      ticketing: event.ticketing,
      status: event.status,
      date: event.date,
      time: event.time,
      venue: event.venue,
      categoryCount: categories.length,
      nomineeCount: event.nomineeCount,
      totalVotes: event.totalVotes,
    };
  },
});
