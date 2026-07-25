import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser } from '../shared/helpers';

export const send = mutation({
  args: {
    broadcastId: v.id('broadcasts'),
    eventId: v.id('events'),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const broadcast = await ctx.db.get(args.broadcastId);
    if (!broadcast) throw new Error('Broadcast not found');
    if (broadcast.status !== 'live') throw new Error('Broadcast is not live');

    const msg = args.message.trim();
    if (!msg || msg.length > 500) throw new Error('Message must be 1-500 characters');

    const messageId = await ctx.db.insert('liveChat', {
      broadcastId: args.broadcastId,
      eventId: args.eventId,
      orgId: broadcast.orgId,
      userId: user._id,
      message: msg,
      isDeleted: false,
      createdAt: new Date().toISOString(),
    });

    // Increment chat count on broadcast
    await ctx.db.patch(args.broadcastId, {
      totalChatMessages: broadcast.totalChatMessages + 1,
    });

    return messageId;
  },
});

export const deleteMessage = mutation({
  args: { messageId: v.id('liveChat') },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error('Message not found');

    // Only the message author or org admin can delete
    if (message.userId !== user._id) {
      const membership = await ctx.db
        .query('organizationMembers')
        .withIndex('by_orgId_userId', (q) => q.eq('orgId', message.orgId).eq('userId', user._id))
        .unique();
      if (!membership || !['owner', 'admin', 'moderator'].includes(membership.role)) {
        throw new Error('Not authorized to delete this message');
      }
    }

    await ctx.db.patch(args.messageId, { isDeleted: true });
  },
});

export const incrementReactionCount = mutation({
  args: { broadcastId: v.id('broadcasts') },
  handler: async (ctx, args) => {
    const broadcast = await ctx.db.get(args.broadcastId);
    if (!broadcast) return;
    await ctx.db.patch(args.broadcastId, {
      totalReactions: broadcast.totalReactions + 1,
    });
  },
});
