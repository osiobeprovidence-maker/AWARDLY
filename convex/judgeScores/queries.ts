import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getByJudge = query({
  args: { judgeId: v.id('judges') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('judgeScores')
      .withIndex('by_judgeId', (q) => q.eq('judgeId', args.judgeId))
      .order('desc')
      .collect();
  },
});

export const getByJudgeAndCategory = query({
  args: { judgeId: v.id('judges'), categoryId: v.id('categories') },
  handler: async (ctx, args) => {
    const scores = await ctx.db
      .query('judgeScores')
      .withIndex('by_judgeId_categoryId', (q) => q.eq('judgeId', args.judgeId).eq('categoryId', args.categoryId))
      .collect();

    const result = [];
    for (const score of scores) {
      const nominee = await ctx.db.get(score.nomineeId);
      result.push({
        ...score,
        nominee: nominee ? { name: nominee.name, imageUrl: nominee.imageUrl } : null,
      });
    }
    return result;
  },
});

export const getScorecard = query({
  args: { judgeId: v.id('judges'), nomineeId: v.id('nominees') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('judgeScores')
      .withIndex('by_judgeId_nomineeId', (q) => q.eq('judgeId', args.judgeId).eq('nomineeId', args.nomineeId))
      .unique();
  },
});

export const getByNominee = query({
  args: { nomineeId: v.id('nominees') },
  handler: async (ctx, args) => {
    const scores = await ctx.db
      .query('judgeScores')
      .withIndex('by_nomineeId', (q) => q.eq('nomineeId', args.nomineeId))
      .collect();

    const result = [];
    for (const score of scores) {
      const judge = await ctx.db.get(score.judgeId);
      const user = judge ? await ctx.db.get(judge.userId) : null;
      result.push({
        ...score,
        judgeName: user?.name ?? 'Unknown',
      });
    }
    return result;
  },
});

export const getByCategory = query({
  args: { categoryId: v.id('categories') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('judgeScores')
      .withIndex('by_categoryId', (q) => q.eq('categoryId', args.categoryId))
      .collect();
  },
});
