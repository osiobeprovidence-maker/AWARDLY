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
    ticketingMethod: v.optional(v.union(v.literal('native'), v.literal('external'))),
    externalTicketing: v.optional(v.object({
      platformName: v.optional(v.string()),
      purchaseUrl: v.optional(v.string()),
      apiEndpoint: v.optional(v.string()),
    })),
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
    ticketingMethod: v.optional(v.union(v.literal('native'), v.literal('external'))),
    externalTicketing: v.optional(v.object({
      platformName: v.optional(v.string()),
      purchaseUrl: v.optional(v.string()),
      apiEndpoint: v.optional(v.string()),
    })),
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

    async function deleteByIndex<Table extends string>(
      table: Table,
      indexName: string,
      key: string,
      value: any,
    ) {
      const docs = await (ctx.db as any)
        .query(table)
        .withIndex(indexName, (q: any) => q.eq(key, value))
        .collect();
      for (const doc of docs) {
        await ctx.db.delete(doc._id);
      }
    }

    // ── 1. Ticketing ───────────────────────────────────────────────────────
    await deleteByIndex('checkinLogs', 'by_eventId', 'eventId', eid);
    await deleteByIndex('ticketDiscounts', 'by_eventId', 'eventId', eid);
    await deleteByIndex('ticketOrders', 'by_eventId', 'eventId', eid);
    await deleteByIndex('ticketTypes', 'by_eventId', 'eventId', eid);

    // ── 2. Broadcasts + children (liveChat, liveReactions, liveAnalytics) ──
    const broadcasts = await ctx.db
      .query('broadcasts')
      .withIndex('by_eventId', (q) => q.eq('eventId', eid))
      .collect();
    for (const bc of broadcasts) {
      await deleteByIndex('liveReactions', 'by_broadcastId', 'broadcastId', bc._id);
      await deleteByIndex('liveChat', 'by_broadcastId', 'broadcastId', bc._id);
      await deleteByIndex('liveAnalytics', 'by_broadcastId', 'broadcastId', bc._id);
      await ctx.db.delete(bc._id);
    }

    // ── 3. Judging ────────────────────────────────────────────────────────
    await deleteByIndex('judgeScores', 'by_eventId', 'eventId', eid);
    await deleteByIndex('judges', 'by_eventId', 'eventId', eid);

    // ── 4. Voting ─────────────────────────────────────────────────────────
    await deleteByIndex('votes', 'by_eventId', 'eventId', eid);

    // ── 5. Nominations & Nominees ─────────────────────────────────────────
    await deleteByIndex('nominations', 'by_eventId', 'eventId', eid);

    const nomineeDocs = await ctx.db
      .query('nominees')
      .withIndex('by_eventId', (q) => q.eq('eventId', eid))
      .collect();
    const nomineeIds = nomineeDocs.map((d) => d._id);
    for (const doc of nomineeDocs) {
      await ctx.db.delete(doc._id);
    }

    // ── 6. Categories ─────────────────────────────────────────────────────
    await deleteByIndex('categories', 'by_eventId', 'eventId', eid);

    // ── 7. Feed Posts + nested comments / polls ───────────────────────────
    const posts = await ctx.db
      .query('feedPosts')
      .withIndex('by_eventId', (q) => q.eq('eventId', eid))
      .collect();
    for (const post of posts) {
      await deleteByIndex('comments', 'by_postId', 'postId', post._id);
      const polls = await ctx.db
        .query('postPolls')
        .withIndex('by_postId', (q) => q.eq('postId', post._id))
        .collect();
      for (const poll of polls) {
        await deleteByIndex('postPollVotes', 'by_pollId', 'pollId', poll._id);
        await ctx.db.delete(poll._id);
      }
      await ctx.db.delete(post._id);
    }

    // ── 8. Analytics ──────────────────────────────────────────────────────
    await deleteByIndex('analyticsEvents', 'by_eventId', 'eventId', eid);

    // ── 9. Notifications (full scan – no eventId index) ───────────────────
    const allNotifications = await ctx.db.query('notifications').collect();
    for (const doc of allNotifications) {
      if (doc.eventId && doc.eventId === eid) {
        await ctx.db.delete(doc._id);
      }
    }

    // ── 10. Bookmarks (full scan – no targetId index) ─────────────────────
    const allBookmarks = await ctx.db.query('bookmarks').collect();
    for (const doc of allBookmarks) {
      if (doc.targetType === 'event' && doc.targetId === eid) {
        await ctx.db.delete(doc._id);
      }
    }

    // ── 11. Likes on deleted nominees ─────────────────────────────────────
    for (const nid of nomineeIds) {
      const likeDocs = await ctx.db
        .query('likes')
        .withIndex('by_targetType_targetId', (q) =>
          q.eq('targetType', 'nominee').eq('targetId', nid as any)
        )
        .collect();
      for (const doc of likeDocs) {
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
    try {
      const user = await getAuthenticatedUser(ctx, args.firebaseUid);

      const event = await ctx.db.get(args.eventId);
      if (!event) {
        throw new Error('Event not found.');
      }

      if (event.isDeleted) {
        throw new Error('Cannot change status of a deleted event.');
      }

      await requirePermission(ctx, user._id, event.orgId, 'manageEvents');

      const VALID_STATUSES: EventStatus[] = [
        'draft', 'ready_for_review', 'published',
        'live', 'voting_ended', 'winners_announced',
        'closed', 'archived',
      ];
      if (!VALID_STATUSES.includes(args.toStatus)) {
        throw new Error(`Invalid status "${args.toStatus}".`);
      }

      const allowed = VALID_TRANSITIONS[event.status as EventStatus];
      if (!allowed) {
        throw new Error(
          `Event has unknown status "${event.status}". Cannot transition.`
        );
      }
      if (!allowed.includes(args.toStatus)) {
        throw new Error(
          `Cannot transition from "${event.status}" to "${args.toStatus}". Allowed: ${allowed.join(', ')}`
        );
      }

      const now = new Date().toISOString();
      const patches: Record<string, string | boolean> = {
        status: args.toStatus,
        updatedAt: now,
      };

      if (args.toStatus === 'live') {
        patches.isVotingActive = true;
      } else if (
        args.toStatus === 'voting_ended' ||
        args.toStatus === 'closed' ||
        args.toStatus === 'archived'
      ) {
        patches.isVotingActive = false;
      }

      await ctx.db.patch(args.eventId, patches);

      await logAudit(
        ctx,
        event.orgId,
        user._id,
        `transition:${args.toStatus}`,
        'event',
        args.eventId,
        { from: event.status, to: args.toStatus }
      );

      return {
        success: true,
        previousStatus: event.status,
        currentStatus: args.toStatus,
      };
    } catch (err: any) {
      console.error('[transitionStatus] Error:', err?.message ?? err);
      throw new Error(err?.message || 'Failed to transition event status.');
    }
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
