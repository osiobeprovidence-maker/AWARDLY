import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getByEvent = query({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    const broadcasts = await ctx.db
      .query('broadcasts')
      .withIndex('by_eventId', (q) => q.eq('eventId', args.eventId))
      .order('desc')
      .collect();

    const result = [];
    for (const b of broadcasts) {
      const org = await ctx.db.get(b.orgId);
      result.push({
        ...b,
        org: org ? { name: org.name, logoUrl: org.logoUrl, primaryColor: org.primaryColor } : null,
      });
    }
    return result;
  },
});

export const getByOrg = query({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    const broadcasts = await ctx.db
      .query('broadcasts')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .order('desc')
      .collect();

    const result = [];
    for (const b of broadcasts) {
      const event = await ctx.db.get(b.eventId);
      result.push({
        ...b,
        event: event ? { title: event.title, slug: event.slug, date: event.date, status: event.status } : null,
      });
    }
    return result;
  },
});

export const getLiveByEvent = query({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    const broadcast = await ctx.db
      .query('broadcasts')
      .withIndex('by_eventId_status', (q) => q.eq('eventId', args.eventId).eq('status', 'live'))
      .unique();

    if (!broadcast) return null;

    const org = await ctx.db.get(broadcast.orgId);
    const event = await ctx.db.get(broadcast.eventId);

    return {
      ...broadcast,
      org: org ? { name: org.name, logoUrl: org.logoUrl, primaryColor: org.primaryColor, youtubeChannelId: org.youtubeChannelId } : null,
      event: event ? { title: event.title, slug: event.slug, date: event.date, status: event.status } : null,
    };
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
    const broadcast = await ctx.db.get(args.broadcastId);
    if (!broadcast) return null;

    const org = await ctx.db.get(broadcast.orgId);
    const event = await ctx.db.get(broadcast.eventId);

    return {
      ...broadcast,
      org: org ? { name: org.name, logoUrl: org.logoUrl, primaryColor: org.primaryColor, youtubeChannelId: org.youtubeChannelId } : null,
      event: event ? { title: event.title, slug: event.slug, date: event.date, status: event.status } : null,
    };
  },
});

export const getLiveStats = query({
  args: { broadcastId: v.id('broadcasts') },
  handler: async (ctx, args) => {
    const broadcast = await ctx.db.get(args.broadcastId);
    if (!broadcast) return null;

    return {
      concurrentViewers: broadcast.concurrentViewers,
      peakViewerCount: broadcast.peakViewerCount,
      totalChatMessages: broadcast.totalChatMessages,
      totalReactions: broadcast.totalReactions,
      totalVotesDuringStream: broadcast.totalVotesDuringStream,
      totalDonationsDuringStream: broadcast.totalDonationsDuringStream,
      revenueDuringStream: broadcast.revenueDuringStream,
      duration: broadcast.duration,
      status: broadcast.status,
    };
  },
});
