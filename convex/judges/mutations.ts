import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser, requirePermission, createNotification, logAudit } from '../shared/helpers';

export const invite = mutation({
  args: {
    orgId: v.id('organizations'),
    eventId: v.id('events'),
    email: v.string(),
    categoryIds: v.array(v.id('categories')),
    deadline: v.optional(v.string()),
    notes: v.optional(v.string()),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    await requirePermission(ctx, user._id, args.orgId, 'manageJudges');

    const targetUser = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .unique();
    if (!targetUser) throw new Error('User not found. They must have an Awwardly account.');

    const existing = await ctx.db
      .query('judges')
      .withIndex('by_userId_eventId', (q) => q.eq('userId', targetUser._id).eq('eventId', args.eventId))
      .unique();
    if (existing) throw new Error('This user is already a judge for this event.');

    const membership = await ctx.db
      .query('organizationMembers')
      .withIndex('by_orgId_userId', (q) => q.eq('orgId', args.orgId).eq('userId', targetUser._id))
      .unique();
    if (!membership) {
      await ctx.db.insert('organizationMembers', {
        orgId: args.orgId,
        userId: targetUser._id,
        role: 'judge',
        invitedBy: user._id,
        joinedAt: new Date().toISOString(),
      });
    }

    const now = new Date().toISOString();
    const judgeId = await ctx.db.insert('judges', {
      userId: targetUser._id,
      eventId: args.eventId,
      orgId: args.orgId,
      categoryIds: args.categoryIds,
      status: 'invited',
      deadline: args.deadline,
      notes: args.notes,
      invitedAt: now,
    });

    const event = await ctx.db.get(args.eventId);
    await createNotification(
      ctx,
      targetUser._id,
      'judge_invite',
      'Judge Invitation',
      `You have been invited to judge ${event?.title ?? 'an event'}.`,
      `/judge`,
      args.orgId,
      args.eventId,
    );

    await logAudit(ctx, args.orgId, user._id, 'invite_judge', 'judge', judgeId);
    return judgeId;
  },
});

export const accept = mutation({
  args: {
    judgeId: v.id('judges'),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const judge = await ctx.db.get(args.judgeId);
    if (!judge) throw new Error('Judge assignment not found');
    if (judge.userId !== user._id) throw new Error('Not authorized');

    await ctx.db.patch(args.judgeId, { status: 'accepted' });
    return args.judgeId;
  },
});

export const decline = mutation({
  args: {
    judgeId: v.id('judges'),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const judge = await ctx.db.get(args.judgeId);
    if (!judge) throw new Error('Judge assignment not found');
    if (judge.userId !== user._id) throw new Error('Not authorized');

    await ctx.db.patch(args.judgeId, { status: 'declined' });
    return args.judgeId;
  },
});

export const assignCategories = mutation({
  args: {
    judgeId: v.id('judges'),
    categoryIds: v.array(v.id('categories')),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const judge = await ctx.db.get(args.judgeId);
    if (!judge) throw new Error('Judge assignment not found');
    await requirePermission(ctx, user._id, judge.orgId, 'manageJudges');

    await ctx.db.patch(args.judgeId, { categoryIds: args.categoryIds });
  },
});

export const updateDeadline = mutation({
  args: {
    judgeId: v.id('judges'),
    deadline: v.string(),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const judge = await ctx.db.get(args.judgeId);
    if (!judge) throw new Error('Judge assignment not found');
    await requirePermission(ctx, user._id, judge.orgId, 'manageJudges');

    await ctx.db.patch(args.judgeId, { deadline: args.deadline });
  },
});

export const remove = mutation({
  args: {
    judgeId: v.id('judges'),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const judge = await ctx.db.get(args.judgeId);
    if (!judge) throw new Error('Judge assignment not found');
    await requirePermission(ctx, user._id, judge.orgId, 'manageJudges');

    await ctx.db.delete(args.judgeId);
    await logAudit(ctx, judge.orgId, user._id, 'remove_judge', 'judge', args.judgeId);
  },
});
