import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser, createNotification, logAudit } from '../shared/helpers';

export const castVote = mutation({
  args: {
    eventId: v.id('events'),
    categoryId: v.id('categories'),
    nomineeId: v.id('nominees'),
    quantity: v.number(),
    isPaid: v.boolean(),
    paymentReference: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    // Validate event
    const event = await ctx.db.get(args.eventId);
    if (!event || event.isDeleted) throw new Error('Event not found');
    if (!event.isVotingActive) throw new Error('Voting is not active for this event');
    if (event.votingStart && new Date() < new Date(event.votingStart)) {
      throw new Error('Voting has not started yet');
    }
    if (event.votingEnd && new Date() > new Date(event.votingEnd)) {
      throw new Error('Voting has ended');
    }

    // Validate nominee
    const nominee = await ctx.db.get(args.nomineeId);
    if (!nominee || nominee.isDeleted) throw new Error('Nominee not found');
    if (nominee.eventId !== args.eventId) throw new Error('Nominee does not belong to this event');
    if (nominee.categoryId !== args.categoryId) throw new Error('Nominee does not belong to this category');

    // Check daily vote limit (anti-spam)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayVotes = await ctx.db
      .query('votes')
      .withIndex('by_userId_eventId', (q) => q.eq('userId', user._id).eq('eventId', args.eventId))
      .collect();

    const todayCount = todayVotes.filter((v) => new Date(v.createdAt) >= todayStart).length;
    if (todayCount >= 50) {
      throw new Error('Daily vote limit reached (50 votes per day)');
    }

    const now = new Date().toISOString();

    // Insert vote(s)
    for (let i = 0; i < args.quantity; i++) {
      await ctx.db.insert('votes', {
        userId: user._id,
        eventId: args.eventId,
        categoryId: args.categoryId,
        nomineeId: args.nomineeId,
        orgId: event.orgId,
        quantity: 1,
        isPaid: args.isPaid,
        paymentReference: args.paymentReference,
        createdAt: now,
      });
    }

    // Update nominee vote count
    await ctx.db.patch(args.nomineeId, {
      voteCount: nominee.voteCount + args.quantity,
    });

    // Update event total votes
    await ctx.db.patch(args.eventId, {
      totalVotes: event.totalVotes + args.quantity,
    });

    // Update category total votes
    const category = await ctx.db.get(args.categoryId);
    if (category) {
      await ctx.db.patch(args.categoryId, {
        totalVotes: category.totalVotes + args.quantity,
      });
    }

    // Notify nominee (if they have a user account - future)
    // For now, just log
    await logAudit(ctx, event.orgId, user._id, 'vote', 'nominee', args.nomineeId, {
      quantity: String(args.quantity),
      categoryId: args.categoryId,
    });

    return { success: true, totalVotesCast: args.quantity };
  },
});

export const refundVotes = mutation({
  args: {
    eventId: v.id('events'),
    categoryId: v.id('categories'),
    nomineeId: v.id('nominees'),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error('Event not found');

    // Only admins and owners can refund
    const membership = await ctx.db
      .query('organizationMembers')
      .withIndex('by_orgId_userId', (q) => q.eq('orgId', event.orgId).eq('userId', user._id))
      .unique();

    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      throw new Error('Only admins can refund votes');
    }

    const votes = await ctx.db
      .query('votes')
      .withIndex('by_categoryId', (q) => q.eq('categoryId', args.categoryId))
      .filter((q) => q.eq(q.field('nomineeId'), args.nomineeId))
      .collect();

    let totalRefunded = 0;
    for (const vote of votes) {
      await ctx.db.delete(vote._id);
      totalRefunded += vote.quantity;
    }

    const nominee = await ctx.db.get(args.nomineeId);
    if (nominee) {
      await ctx.db.patch(args.nomineeId, { voteCount: Math.max(0, nominee.voteCount - totalRefunded) });
    }

    await ctx.db.patch(args.eventId, {
      totalVotes: Math.max(0, event.totalVotes - totalRefunded),
    });

    await logAudit(ctx, event.orgId, user._id, 'refund_votes', 'nominee', args.nomineeId, {
      reason: args.reason,
      amount: String(totalRefunded),
    });

    return { refunded: totalRefunded };
  },
});
