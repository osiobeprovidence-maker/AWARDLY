import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser, requirePermission, logAudit } from '../shared/helpers';

export const create = mutation({
  args: {
    orgId: v.id('organizations'),
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    date: v.string(),
    time: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    bannerUrl: v.optional(v.string()),
    venue: v.optional(v.string()),
    theme: v.optional(v.string()),
    tagline: v.optional(v.string()),
    themeColor: v.optional(v.string()),
    timezone: v.optional(v.string()),
    votingType: v.optional(v.union(v.literal('public'), v.literal('member'), v.literal('judge'), v.literal('both'))),
    nominationStart: v.optional(v.string()),
    nominationEnd: v.optional(v.string()),
    votingStart: v.optional(v.string()),
    votingEnd: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    await requirePermission(ctx, user._id, args.orgId, 'manageEvents');

    // Check slug uniqueness within the org
    const existing = await ctx.db
      .query('events')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .unique();
    if (existing) {
      throw new Error('An event with this slug already exists');
    }

    const now = new Date().toISOString();

    const eventId = await ctx.db.insert('events', {
      ...args,
      status: 'draft',
      isVotingActive: false,
      categoryCount: 0,
      nomineeCount: 0,
      totalVotes: 0,
      viewCount: 0,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.patch(args.orgId, {
      eventCount: (await ctx.db.get(args.orgId))!.eventCount + 1,
      updatedAt: now,
    });

    await logAudit(ctx, args.orgId, user._id, 'create', 'event', eventId);

    return eventId;
  },
});

export const update = mutation({
  args: {
    eventId: v.id('events'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    date: v.optional(v.string()),
    time: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    bannerUrl: v.optional(v.string()),
    venue: v.optional(v.string()),
    theme: v.optional(v.string()),
    tagline: v.optional(v.string()),
    themeColor: v.optional(v.string()),
    timezone: v.optional(v.string()),
    youtubeVideoId: v.optional(v.string()),
    muxPlaybackId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error('Event not found');

    await requirePermission(ctx, user._id, event.orgId, 'manageEvents');

    const { eventId, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );

    await ctx.db.patch(eventId, { ...filtered, updatedAt: new Date().toISOString() });
  },
});

export const publish = mutation({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error('Event not found');

    await requirePermission(ctx, user._id, event.orgId, 'manageEvents');

    await ctx.db.patch(args.eventId, {
      status: 'published',
      updatedAt: new Date().toISOString(),
    });

    await logAudit(ctx, event.orgId, user._id, 'publish', 'event', args.eventId);
  },
});

export const goLive = mutation({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error('Event not found');

    await requirePermission(ctx, user._id, event.orgId, 'broadcast');

    await ctx.db.patch(args.eventId, {
      status: 'live',
      updatedAt: new Date().toISOString(),
    });
  },
});

export const close = mutation({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error('Event not found');

    await requirePermission(ctx, user._id, event.orgId, 'manageEvents');

    await ctx.db.patch(args.eventId, {
      status: 'closed',
      isVotingActive: false,
      updatedAt: new Date().toISOString(),
    });
  },
});

export const softDelete = mutation({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error('Event not found');

    await requirePermission(ctx, user._id, event.orgId, 'manageEvents');

    await ctx.db.patch(args.eventId, {
      isDeleted: true,
      updatedAt: new Date().toISOString(),
    });

    await logAudit(ctx, event.orgId, user._id, 'delete', 'event', args.eventId);
  },
});

export const toggleVoting = mutation({
  args: {
    eventId: v.id('events'),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error('Event not found');

    await requirePermission(ctx, user._id, event.orgId, 'manageVoting');

    await ctx.db.patch(args.eventId, {
      isVotingActive: args.isActive,
      updatedAt: new Date().toISOString(),
    });
  },
});

export const incrementViewCount = mutation({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) return;
    await ctx.db.patch(args.eventId, { viewCount: event.viewCount + 1 });
  },
});

export const incrementVoteCount = mutation({
  args: {
    eventId: v.id('events'),
    delta: v.number(),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) return;
    await ctx.db.patch(args.eventId, {
      totalVotes: Math.max(0, event.totalVotes + args.delta),
    });
  },
});
