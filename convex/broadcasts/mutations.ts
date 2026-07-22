import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser, requirePermission } from '../shared/helpers';

export const create = mutation({
  args: {
    eventId: v.id('events'),
    title: v.string(),
    description: v.optional(v.string()),
    youtubeVideoId: v.optional(v.string()),
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
      youtubeVideoId: args.youtubeVideoId,
      viewerCount: 0,
      peakViewerCount: 0,
      createdAt: new Date().toISOString(),
    });
  },
});

export const startLive = mutation({
  args: {
    broadcastId: v.id('broadcasts'),
    muxStreamId: v.optional(v.string()),
    muxPlaybackId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const broadcast = await ctx.db.get(args.broadcastId);
    if (!broadcast) throw new Error('Broadcast not found');

    await requirePermission(ctx, user._id, broadcast.orgId, 'broadcast');

    await ctx.db.patch(args.broadcastId, {
      status: 'live',
      muxStreamId: args.muxStreamId,
      muxPlaybackId: args.muxPlaybackId,
      startedAt: new Date().toISOString(),
    });
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
    const duration = broadcast.startedAt
      ? Math.floor((new Date(now).getTime() - new Date(broadcast.startedAt).getTime()) / 1000)
      : 0;

    await ctx.db.patch(args.broadcastId, {
      status: 'ended',
      endedAt: now,
      duration,
    });
  },
});

export const incrementViewerCount = mutation({
  args: {
    broadcastId: v.id('broadcasts'),
    delta: v.number(),
  },
  handler: async (ctx, args) => {
    const broadcast = await ctx.db.get(args.broadcastId);
    if (!broadcast) return;

    const newCount = Math.max(0, broadcast.viewerCount + args.delta);
    await ctx.db.patch(args.broadcastId, {
      viewerCount: newCount,
      peakViewerCount: Math.max(broadcast.peakViewerCount, newCount),
    });
  },
});
