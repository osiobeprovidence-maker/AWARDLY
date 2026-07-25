import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser, requirePermission } from '../shared/helpers';

export const recordSnapshot = mutation({
  args: {
    broadcastId: v.id('broadcasts'),
    concurrentViewers: v.number(),
    chatMessagesPerMinute: v.number(),
    reactionsPerMinute: v.number(),
    votesPerMinute: v.number(),
    donationsPerMinute: v.number(),
  },
  handler: async (ctx, args) => {
    const broadcast = await ctx.db.get(args.broadcastId);
    if (!broadcast) return;

    await ctx.db.insert('liveAnalytics', {
      broadcastId: args.broadcastId,
      eventId: broadcast.eventId,
      orgId: broadcast.orgId,
      timestamp: new Date().toISOString(),
      concurrentViewers: args.concurrentViewers,
      chatMessagesPerMinute: args.chatMessagesPerMinute,
      reactionsPerMinute: args.reactionsPerMinute,
      votesPerMinute: args.votesPerMinute,
      donationsPerMinute: args.donationsPerMinute,
    });
  },
});

export const incrementStreamVotes = mutation({
  args: { broadcastId: v.id('broadcasts'), amount: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const broadcast = await ctx.db.get(args.broadcastId);
    if (!broadcast) return;
    await ctx.db.patch(args.broadcastId, {
      totalVotesDuringStream: broadcast.totalVotesDuringStream + (args.amount ?? 1),
    });
  },
});

export const incrementStreamDonations = mutation({
  args: { broadcastId: v.id('broadcasts'), amount: v.number() },
  handler: async (ctx, args) => {
    const broadcast = await ctx.db.get(args.broadcastId);
    if (!broadcast) return;
    await ctx.db.patch(args.broadcastId, {
      totalDonationsDuringStream: broadcast.totalDonationsDuringStream + 1,
      revenueDuringStream: broadcast.revenueDuringStream + args.amount,
    });
  },
});
