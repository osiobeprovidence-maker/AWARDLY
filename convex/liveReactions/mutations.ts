import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser } from '../shared/helpers';

export const send = mutation({
  args: {
    broadcastId: v.id('broadcasts'),
    eventId: v.id('events'),
    emoji: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const broadcast = await ctx.db.get(args.broadcastId);
    if (!broadcast) throw new Error('Broadcast not found');
    if (broadcast.status !== 'live') throw new Error('Broadcast is not live');

    const validEmojis = ['❤️', '👏', '🔥', '🎉', '😂', '😮', '💯', '🏆'];
    if (!validEmojis.includes(args.emoji)) throw new Error('Invalid emoji');

    const reactionId = await ctx.db.insert('liveReactions', {
      broadcastId: args.broadcastId,
      eventId: args.eventId,
      userId: user._id,
      emoji: args.emoji,
      createdAt: new Date().toISOString(),
    });

    await ctx.db.patch(args.broadcastId, {
      totalReactions: broadcast.totalReactions + 1,
    });

    return reactionId;
  },
});
