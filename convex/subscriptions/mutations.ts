import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser, requirePermission, logAudit } from '../shared/helpers';

export const upsert = mutation({
  args: {
    orgId: v.id('organizations'),
    plan: v.union(v.literal('starter'), v.literal('professional'), v.literal('enterprise')),
    status: v.union(v.literal('active'), v.literal('cancelled'), v.literal('past_due'), v.literal('trialing')),
    monthlyPrice: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    await requirePermission(ctx, user._id, args.orgId, 'manageOrg');

    const now = new Date().toISOString();
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    const planLimits = {
      starter: { storage: 1073741824, events: 3, teamMembers: 3 },
      professional: { storage: 10737418240, events: 25, teamMembers: 15 },
      enterprise: { storage: 107374182400, events: 999, teamMembers: 999 },
    };

    const limits = planLimits[args.plan];

    const existing = await ctx.db
      .query('subscriptions')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        plan: args.plan,
        status: args.status,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd.toISOString(),
        monthlyPrice: args.monthlyPrice,
        storageLimit: limits.storage,
        eventLimit: limits.events,
        teamMemberLimit: limits.teamMembers,
        updatedAt: now,
      });
      await logAudit(ctx, args.orgId, user._id, 'update', 'subscription', existing._id);
      return existing._id;
    } else {
      const subId = await ctx.db.insert('subscriptions', {
        orgId: args.orgId,
        plan: args.plan,
        status: args.status,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd.toISOString(),
        monthlyPrice: args.monthlyPrice,
        currency: 'NGN',
        storageLimit: limits.storage,
        eventLimit: limits.events,
        teamMemberLimit: limits.teamMembers,
        createdAt: now,
        updatedAt: now,
      });
      await logAudit(ctx, args.orgId, user._id, 'create', 'subscription', subId);
      return subId;
    }
  },
});

export const cancel = mutation({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    await requirePermission(ctx, user._id, args.orgId, 'manageOrg');

    const existing = await ctx.db
      .query('subscriptions')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .unique();

    if (!existing) throw new Error('No active subscription');

    await ctx.db.patch(existing._id, {
      status: 'cancelled',
      updatedAt: new Date().toISOString(),
    });
    await logAudit(ctx, args.orgId, user._id, 'cancel', 'subscription', existing._id);
  },
});
