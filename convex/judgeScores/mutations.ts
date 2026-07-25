import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser } from '../shared/helpers';

export const submitScore = mutation({
  args: {
    judgeId: v.id('judges'),
    nomineeId: v.id('nominees'),
    categoryId: v.id('categories'),
    criteriaScores: v.array(v.object({
      criteriaId: v.string(),
      label: v.string(),
      score: v.number(),
      maxScore: v.number(),
    })),
    totalScore: v.number(),
    maxTotalScore: v.number(),
    comment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const judge = await ctx.db.get(args.judgeId);
    if (!judge) throw new Error('Judge assignment not found');
    if (judge.userId !== user._id) throw new Error('Not authorized');
    if (judge.status !== 'accepted') throw new Error('Judge invitation not accepted');

    const event = await ctx.db.get(judge.eventId);
    if (!event) throw new Error('Event not found');

    // Check if judging is locked
    if (event.judgingRules?.lockAfterDeadline && event.judgingDeadline) {
      if (new Date() > new Date(event.judgingDeadline)) {
        throw new Error('Judging deadline has passed');
      }
    }

    const now = new Date().toISOString();

    // Check for existing scorecard
    const existing = await ctx.db
      .query('judgeScores')
      .withIndex('by_judgeId_nomineeId', (q) => q.eq('judgeId', args.judgeId).eq('nomineeId', args.nomineeId))
      .unique();

    if (existing) {
      // Check if locked
      if (existing.status === 'locked') {
        throw new Error('This score has been locked and cannot be modified');
      }
      await ctx.db.patch(existing._id, {
        criteriaScores: args.criteriaScores,
        totalScore: args.totalScore,
        maxTotalScore: args.maxTotalScore,
        comment: args.comment,
        status: 'submitted',
        submittedAt: now,
        updatedAt: now,
      });
      return existing._id;
    }

    const scoreId = await ctx.db.insert('judgeScores', {
      judgeId: args.judgeId,
      userId: user._id,
      eventId: judge.eventId,
      orgId: judge.orgId,
      categoryId: args.categoryId,
      nomineeId: args.nomineeId,
      criteriaScores: args.criteriaScores,
      totalScore: args.totalScore,
      maxTotalScore: args.maxTotalScore,
      comment: args.comment,
      status: 'submitted',
      submittedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    return scoreId;
  },
});

export const saveDraft = mutation({
  args: {
    judgeId: v.id('judges'),
    nomineeId: v.id('nominees'),
    categoryId: v.id('categories'),
    criteriaScores: v.array(v.object({
      criteriaId: v.string(),
      label: v.string(),
      score: v.number(),
      maxScore: v.number(),
    })),
    totalScore: v.number(),
    maxTotalScore: v.number(),
    comment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const judge = await ctx.db.get(args.judgeId);
    if (!judge) throw new Error('Judge assignment not found');
    if (judge.userId !== user._id) throw new Error('Not authorized');

    const event = await ctx.db.get(judge.eventId);
    if (!event?.judgingRules?.allowDraftSaving) {
      throw new Error('Draft saving is not enabled for this event');
    }

    const now = new Date().toISOString();

    const existing = await ctx.db
      .query('judgeScores')
      .withIndex('by_judgeId_nomineeId', (q) => q.eq('judgeId', args.judgeId).eq('nomineeId', args.nomineeId))
      .unique();

    if (existing) {
      if (existing.status === 'locked') throw new Error('Score is locked');
      await ctx.db.patch(existing._id, {
        criteriaScores: args.criteriaScores,
        totalScore: args.totalScore,
        maxTotalScore: args.maxTotalScore,
        comment: args.comment,
        updatedAt: now,
      });
      return existing._id;
    }

    const scoreId = await ctx.db.insert('judgeScores', {
      judgeId: args.judgeId,
      userId: user._id,
      eventId: judge.eventId,
      orgId: judge.orgId,
      categoryId: args.categoryId,
      nomineeId: args.nomineeId,
      criteriaScores: args.criteriaScores,
      totalScore: args.totalScore,
      maxTotalScore: args.maxTotalScore,
      comment: args.comment,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    });

    return scoreId;
  },
});

export const lockScores = mutation({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error('Event not found');

    const scores = await ctx.db
      .query('judgeScores')
      .withIndex('by_eventId', (q) => q.eq('eventId', args.eventId))
      .collect();

    for (const score of scores) {
      if (score.status !== 'locked') {
        await ctx.db.patch(score._id, { status: 'locked' });
      }
    }
  },
});
