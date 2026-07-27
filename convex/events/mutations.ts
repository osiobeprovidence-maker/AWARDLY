import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser, requirePermission, logAudit } from '../shared/helpers';

type EventStatus =
  | 'draft' | 'ready_for_review' | 'published'
  | 'live' | 'voting_ended' | 'winners_announced'
  | 'closed' | 'archived';

const VALID_TRANSITIONS: Record<EventStatus, EventStatus[]> = {
  draft:             ['ready_for_review', 'published', 'archived'],
  ready_for_review:  ['draft', 'published', 'archived'],
  published:         ['live', 'draft', 'archived'],
  live:              ['voting_ended'],
  voting_ended:      ['winners_announced', 'archived'],
  winners_announced: ['archived'],
  closed:            ['archived'],
  archived:          ['draft'],
};

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

    const allowed = VALID_TRANSITIONS[event.status as EventStatus];
    if (!allowed || !allowed.includes('published')) {
      throw new Error(`Cannot publish from "${event.status}" status`);
    }

    await ctx.db.patch(args.eventId, {
      status: 'published',
      updatedAt: new Date().toISOString(),
    });

    await logAudit(ctx, event.orgId, user._id, 'publish', 'event', args.eventId, {
      from: event.status,
      to: 'published',
    });
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

    const allowed = VALID_TRANSITIONS[event.status as EventStatus];
    if (!allowed || !allowed.includes('live')) {
      throw new Error(`Cannot go live from "${event.status}" status`);
    }

    await ctx.db.patch(args.eventId, {
      status: 'live',
      isVotingActive: true,
      updatedAt: new Date().toISOString(),
    });

    await logAudit(ctx, event.orgId, user._id, 'go_live', 'event', args.eventId, {
      from: event.status,
      to: 'live',
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

    const allowed = VALID_TRANSITIONS[event.status as EventStatus];
    if (!allowed || !allowed.includes('closed')) {
      throw new Error(`Cannot close from "${event.status}" status`);
    }

    await ctx.db.patch(args.eventId, {
      status: 'closed',
      isVotingActive: false,
      updatedAt: new Date().toISOString(),
    });

    await logAudit(ctx, event.orgId, user._id, 'close', 'event', args.eventId, {
      from: event.status,
      to: 'closed',
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

    const deletableStatuses: EventStatus[] = ['draft', 'ready_for_review', 'archived'];
    if (!deletableStatuses.includes(event.status as EventStatus)) {
      throw new Error(
        `Cannot delete event in "${event.status}" status. Archive it first.`
      );
    }

    await ctx.db.patch(args.eventId, {
      isDeleted: true,
      updatedAt: new Date().toISOString(),
    });

    await logAudit(ctx, event.orgId, user._id, 'delete', 'event', args.eventId);
  },
});

export const deleteEvent = mutation({
  args: {
    eventId: v.id('events'),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error('Event not found');

    await requirePermission(ctx, user._id, event.orgId, 'manageEvents');

    const eid = args.eventId;

    // ── 1. Ticketing ───────────────────────────────────────────────────────
    for (const doc of await ctx.db.query('checkinLogs').withIndex('by_eventId', q => q.eq('eventId', eid)).collect()) {
      await ctx.db.delete(doc._id);
    }
    for (const doc of await ctx.db.query('ticketDiscounts').withIndex('by_eventId', q => q.eq('eventId', eid)).collect()) {
      await ctx.db.delete(doc._id);
    }
    for (const doc of await ctx.db.query('ticketOrders').withIndex('by_eventId', q => q.eq('eventId', eid)).collect()) {
      await ctx.db.delete(doc._id);
    }
    for (const doc of await ctx.db.query('ticketTypes').withIndex('by_eventId', q => q.eq('eventId', eid)).collect()) {
      await ctx.db.delete(doc._id);
    }

    // ── 2. Live / Broadcasts ──────────────────────────────────────────────
    const broadcasts = await ctx.db.query('broadcasts').withIndex('by_eventId', q => q.eq('eventId', eid)).collect();
    for (const bc of broadcasts) {
      for (const r of await ctx.db.query('liveReactions').withIndex('by_broadcastId', q => q.eq('broadcastId', bc._id)).collect()) {
        await ctx.db.delete(r._id);
      }
      for (const m of await ctx.db.query('liveChat').withIndex('by_broadcastId', q => q.eq('broadcastId', bc._id)).collect()) {
        await ctx.db.delete(m._id);
      }
      for (const a of await ctx.db.query('liveAnalytics').withIndex('by_broadcastId', q => q.eq('broadcastId', bc._id)).collect()) {
        await ctx.db.delete(a._id);
      }
      await ctx.db.delete(bc._id);
    }
    for (const doc of await ctx.db.query('liveAnalytics').withIndex('by_eventId', q => q.eq('eventId', eid)).collect()) {
      await ctx.db.delete(doc._id);
    }

    // ── 3. Judging ────────────────────────────────────────────────────────
    for (const doc of await ctx.db.query('judgeScores').withIndex('by_eventId', q => q.eq('eventId', eid)).collect()) {
      await ctx.db.delete(doc._id);
    }
    for (const doc of await ctx.db.query('judges').withIndex('by_eventId', q => q.eq('eventId', eid)).collect()) {
      await ctx.db.delete(doc._id);
    }

    // ── 4. Voting ─────────────────────────────────────────────────────────
    for (const doc of await ctx.db.query('votes').withIndex('by_eventId', q => q.eq('eventId', eid)).collect()) {
      await ctx.db.delete(doc._id);
    }

    // ── 5. Nominations & Nominees ─────────────────────────────────────────
    for (const doc of await ctx.db.query('nominations').withIndex('by_eventId', q => q.eq('eventId', eid)).collect()) {
      await ctx.db.delete(doc._id);
    }
    const nomineeIds: string[] = [];
    for (const doc of await ctx.db.query('nominees').withIndex('by_eventId', q => q.eq('eventId', eid)).collect()) {
      nomineeIds.push(doc._id);
      await ctx.db.delete(doc._id);
    }

    // ── 6. Categories ─────────────────────────────────────────────────────
    for (const doc of await ctx.db.query('categories').withIndex('by_eventId', q => q.eq('eventId', eid)).collect()) {
      await ctx.db.delete(doc._id);
    }

    // ── 7. Feed Posts (and nested comments / polls) ───────────────────────
    for (const post of await ctx.db.query('feedPosts').withIndex('by_eventId', q => q.eq('eventId', eid)).collect()) {
      for (const c of await ctx.db.query('comments').withIndex('by_postId', q => q.eq('postId', post._id)).collect()) {
        await ctx.db.delete(c._id);
      }
      for (const poll of await ctx.db.query('postPolls').withIndex('by_postId', q => q.eq('postId', post._id)).collect()) {
        for (const pv of await ctx.db.query('postPollVotes').withIndex('by_pollId', q => q.eq('pollId', poll._id)).collect()) {
          await ctx.db.delete(pv._id);
        }
        await ctx.db.delete(poll._id);
      }
      await ctx.db.delete(post._id);
    }

    // ── 8. Analytics ──────────────────────────────────────────────────────
    for (const doc of await ctx.db.query('analyticsEvents').withIndex('by_eventId', q => q.eq('eventId', eid)).collect()) {
      await ctx.db.delete(doc._id);
    }

    // ── 9. Notifications (no eventId index – full scan with filter) ───────
    for (const doc of await ctx.db.query('notifications').collect()) {
      if (doc.eventId === eid) {
        await ctx.db.delete(doc._id);
      }
    }

    // ── 10. Bookmarks (targetType = 'event', targetId = string) ──────────
    for (const doc of await ctx.db.query('bookmarks').collect()) {
      if (doc.targetType === 'event' && doc.targetId === eid) {
        await ctx.db.delete(doc._id);
      }
    }

    // ── 11. Likes on deleted nominees ─────────────────────────────────────
    for (const nid of nomineeIds) {
      for (const doc of await ctx.db.query('likes').withIndex('by_targetType_targetId', q => q.eq('targetType', 'nominee').eq('targetId', nid)).collect()) {
        await ctx.db.delete(doc._id);
      }
    }

    // ── 12. Decrement org eventCount & delete the event ───────────────────
    const org = await ctx.db.get(event.orgId);
    if (org) {
      await ctx.db.patch(event.orgId, {
        eventCount: Math.max(0, org.eventCount - 1),
        updatedAt: new Date().toISOString(),
      });
    }

    await ctx.db.delete(eid);

    await logAudit(ctx, event.orgId, user._id, 'hard_delete', 'event', eid);

    return { success: true, message: 'Event deleted successfully' };
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

export const transitionStatus = mutation({
  args: {
    eventId: v.id('events'),
    toStatus: v.union(
      v.literal('draft'), v.literal('ready_for_review'), v.literal('published'),
      v.literal('live'), v.literal('voting_ended'), v.literal('winners_announced'),
      v.literal('closed'), v.literal('archived'),
    ),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error('Event not found');

    await requirePermission(ctx, user._id, event.orgId, 'manageEvents');

    const allowed = VALID_TRANSITIONS[event.status as EventStatus];
    if (!allowed || !allowed.includes(args.toStatus)) {
      throw new Error(
        `Cannot transition from "${event.status}" to "${args.toStatus}"`
      );
    }

    const now = new Date().toISOString();
    const patches: Record<string, any> = { status: args.toStatus, updatedAt: now };

    if (args.toStatus === 'live') {
      patches.isVotingActive = true;
    } else if (args.toStatus === 'voting_ended' || args.toStatus === 'closed') {
      patches.isVotingActive = false;
    } else if (args.toStatus === 'archived') {
      patches.isVotingActive = false;
    }

    await ctx.db.patch(args.eventId, patches);

    await logAudit(ctx, event.orgId, user._id, `transition:${args.toStatus}`, 'event', args.eventId, {
      from: event.status,
      to: args.toStatus,
    });
  },
});

export const duplicateEvent = mutation({
  args: {
    eventId: v.id('events'),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error('Event not found');

    await requirePermission(ctx, user._id, event.orgId, 'manageEvents');

    const now = new Date().toISOString();
    const { _id, _creationTime, createdAt, updatedAt, ...rest } = event;

    const newSlug = `${event.slug}-copy-${Date.now()}`;

    const newEventId = await ctx.db.insert('events', {
      ...rest,
      slug: newSlug,
      title: `${event.title} (Copy)`,
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

    await ctx.db.patch(event.orgId, {
      eventCount: (await ctx.db.get(event.orgId))!.eventCount + 1,
      updatedAt: now,
    });

    await logAudit(ctx, event.orgId, user._id, 'duplicate', 'event', newEventId, {
      sourceEventId: args.eventId,
    });

    return newEventId;
  },
});
