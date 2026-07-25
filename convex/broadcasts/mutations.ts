import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser, requirePermission } from '../shared/helpers';

export const create = mutation({
  args: {
    eventId: v.id('events'),
    title: v.string(),
    description: v.optional(v.string()),
    source: v.union(v.literal('youtube'), v.literal('rtmp'), v.literal('upload')),
    youtubeVideoId: v.optional(v.string()),
    youtubeLiveUrl: v.optional(v.string()),
    youtubeChannelId: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    scheduledStartTime: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error('Event not found');

    await requirePermission(ctx, user._id, event.orgId, 'broadcast');

    return await ctx.db.insert('broadcasts', {
      eventId: args.eventId,
      orgId: event.orgId,
      title: args.title,
      description: args.description,
      status: 'scheduled',
      source: args.source,
      youtubeVideoId: args.youtubeVideoId,
      youtubeLiveUrl: args.youtubeLiveUrl,
      youtubeChannelId: args.youtubeChannelId,
      thumbnailUrl: args.thumbnailUrl,
      scheduledStartTime: args.scheduledStartTime,
      concurrentViewers: 0,
      peakViewerCount: 0,
      totalChatMessages: 0,
      totalReactions: 0,
      totalVotesDuringStream: 0,
      totalDonationsDuringStream: 0,
      revenueDuringStream: 0,
      isPinned: false,
      createdAt: new Date().toISOString(),
    });
  },
});

export const goLive = mutation({
  args: { broadcastId: v.id('broadcasts') },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const broadcast = await ctx.db.get(args.broadcastId);
    if (!broadcast) throw new Error('Broadcast not found');

    await requirePermission(ctx, user._id, broadcast.orgId, 'broadcast');

    await ctx.db.patch(args.broadcastId, {
      status: 'live',
      actualStartTime: new Date().toISOString(),
    });

    // Also set the event to live
    await ctx.db.patch(broadcast.eventId, { status: 'live' });
  },
});

export const endLive = mutation({
  args: { broadcastId: v.id('broadcasts') },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const broadcast = await ctx.db.get(args.broadcastId);
    if (!broadcast) throw new Error('Broadcast not found');

    await requirePermission(ctx, user._id, broadcast.orgId, 'broadcast');

    const now = new Date().toISOString();
    const duration = broadcast.actualStartTime
      ? Math.floor((new Date(now).getTime() - new Date(broadcast.actualStartTime).getTime()) / 1000)
      : 0;

    await ctx.db.patch(args.broadcastId, {
      status: 'ended',
      endedAt: now,
      duration,
    });
  },
});

export const updateViewerCount = mutation({
  args: {
    broadcastId: v.id('broadcasts'),
    count: v.number(),
  },
  handler: async (ctx, args) => {
    const broadcast = await ctx.db.get(args.broadcastId);
    if (!broadcast) return;

    await ctx.db.patch(args.broadcastId, {
      concurrentViewers: args.count,
      peakViewerCount: Math.max(broadcast.peakViewerCount, args.count),
    });
  },
});

export const pinMessage = mutation({
  args: {
    broadcastId: v.id('broadcasts'),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const broadcast = await ctx.db.get(args.broadcastId);
    if (!broadcast) throw new Error('Broadcast not found');

    await requirePermission(ctx, user._id, broadcast.orgId, 'broadcast');

    await ctx.db.patch(args.broadcastId, {
      isPinned: true,
      pinnedMessage: args.message,
    });
  },
});

export const unpinMessage = mutation({
  args: { broadcastId: v.id('broadcasts') },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const broadcast = await ctx.db.get(args.broadcastId);
    if (!broadcast) throw new Error('Broadcast not found');

    await requirePermission(ctx, user._id, broadcast.orgId, 'broadcast');

    await ctx.db.patch(args.broadcastId, {
      isPinned: false,
      pinnedMessage: undefined,
    });
  },
});
