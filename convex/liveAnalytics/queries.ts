import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getSnapshots = query({
  args: {
    broadcastId: v.id('broadcasts'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('liveAnalytics')
      .withIndex('by_broadcastId_timestamp', (q) => q.eq('broadcastId', args.broadcastId))
      .order('desc')
      .take(args.limit ?? 60);
  },
});

export const getSummary = query({
  args: { broadcastId: v.id('broadcasts') },
  handler: async (ctx, args) => {
    const broadcast = await ctx.db.get(args.broadcastId);
    if (!broadcast) return null;

    const snapshots = await ctx.db
      .query('liveAnalytics')
      .withIndex('by_broadcastId_timestamp', (q) => q.eq('broadcastId', args.broadcastId))
      .collect();

    if (snapshots.length === 0) {
      return {
        peakViewers: broadcast.peakViewerCount,
        avgViewers: 0,
        totalChatMessages: broadcast.totalChatMessages,
        totalReactions: broadcast.totalReactions,
        totalVotes: broadcast.totalVotesDuringStream,
        totalDonations: broadcast.totalDonationsDuringStream,
        revenue: broadcast.revenueDuringStream,
        duration: broadcast.duration ?? 0,
        avgChatPerMinute: 0,
        avgReactionsPerMinute: 0,
      };
    }

    const avgViewers = Math.round(snapshots.reduce((s, x) => s + x.concurrentViewers, 0) / snapshots.length);
    const avgChat = Math.round(snapshots.reduce((s, x) => s + x.chatMessagesPerMinute, 0) / snapshots.length * 10) / 10;
    const avgReactions = Math.round(snapshots.reduce((s, x) => s + x.reactionsPerMinute, 0) / snapshots.length * 10) / 10;

    return {
      peakViewers: broadcast.peakViewerCount,
      avgViewers,
      totalChatMessages: broadcast.totalChatMessages,
      totalReactions: broadcast.totalReactions,
      totalVotes: broadcast.totalVotesDuringStream,
      totalDonations: broadcast.totalDonationsDuringStream,
      revenue: broadcast.revenueDuringStream,
      duration: broadcast.duration ?? 0,
      avgChatPerMinute: avgChat,
      avgReactionsPerMinute: avgReactions,
    };
  },
});
