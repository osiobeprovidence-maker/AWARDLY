import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getVotesForNominee = query({
  args: { nomineeId: v.id('nominees') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('votes')
      .withIndex('by_nomineeId', (q) => q.eq('nomineeId', args.nomineeId))
      .collect();
  },
});

export const getVotesForEvent = query({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('votes')
      .withIndex('by_eventId', (q) => q.eq('eventId', args.eventId))
      .collect();
  },
});

export const getUserVotesForEvent = query({
  args: {
    userId: v.id('users'),
    eventId: v.id('events'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('votes')
      .withIndex('by_userId_eventId', (q) => q.eq('userId', args.userId).eq('eventId', args.eventId))
      .collect();
  },
});

export const getUserVotesForCategory = query({
  args: {
    userId: v.id('users'),
    eventId: v.id('events'),
    categoryId: v.id('categories'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('votes')
      .withIndex('by_userId_eventId_categoryId', (q) =>
        q.eq('userId', args.userId).eq('eventId', args.eventId).eq('categoryId', args.categoryId)
      )
      .collect();
  },
});

export const getLeaderboard = query({
  args: {
    eventId: v.id('events'),
    categoryId: v.id('categories'),
  },
  handler: async (ctx, args) => {
    const votes = await ctx.db
      .query('votes')
      .withIndex('by_categoryId', (q) => q.eq('categoryId', args.categoryId))
      .collect();

    // Aggregate votes by nomineeId
    const counts: Record<string, number> = {};
    for (const vote of votes) {
      const nomId = vote.nomineeId as string;
      counts[nomId] = (counts[nomId] || 0) + vote.quantity;
    }

    const leaderboard = await Promise.all(
      Object.entries(counts).map(async ([nomineeId, count]) => {
        const nominee = await ctx.db.get(nomineeId as any);
        return { nomineeId, nominee, voteCount: count };
      })
    );

    return leaderboard.sort((a, b) => b.voteCount - a.voteCount);
  },
});
