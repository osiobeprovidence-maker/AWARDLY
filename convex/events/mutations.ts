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
    awardFormat: v.optional(v.union(v.literal('online'), v.literal('physical'), v.literal('hybrid'))),
    ceremony: v.optional(v.object({
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
    })),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { firebaseUid, ...insertData } = args;
    const user = await getAuthenticatedUser(ctx, firebaseUid);
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
      ...insertData,
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
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { eventId, firebaseUid, ...updates } = args;
    const user = await getAuthenticatedUser(ctx, firebaseUid);
    const event = await ctx.db.get(eventId);
    if (!event) throw new Error('Event not found');

    await requirePermission(ctx, user._id, event.orgId, 'manageEvents');

    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );

    await ctx.db.patch(eventId, { ...filtered, updatedAt: new Date().toISOString() });
  },
});

export const publish = mutation({
  args: {
    eventId: v.id('events'),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
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
  args: {
    eventId: v.id('events'),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
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
  args: {
    eventId: v.id('events'),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
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
  args: {
    eventId: v.id('events'),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
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
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
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

export const updateJudgingRules = mutation({
  args: {
    eventId: v.id('events'),
    judgingRules: v.object({
      publicWeight: v.number(),
      judgeWeight: v.number(),
      scoreRange: v.number(),
      lockAfterDeadline: v.boolean(),
      allowDraftSaving: v.boolean(),
    }),
    judgingDeadline: v.optional(v.string()),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error('Event not found');
    await requirePermission(ctx, user._id, event.orgId, 'manageJudges');

    await ctx.db.patch(args.eventId, {
      judgingRules: args.judgingRules,
      judgingDeadline: args.judgingDeadline,
      updatedAt: new Date().toISOString(),
    });
  },
});

export const updateJudgingGuidelines = mutation({
  args: {
    eventId: v.id('events'),
    judgingGuidelines: v.string(),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error('Event not found');
    await requirePermission(ctx, user._id, event.orgId, 'manageJudges');

    await ctx.db.patch(args.eventId, {
      judgingGuidelines: args.judgingGuidelines,
      updatedAt: new Date().toISOString(),
    });
  },
});
