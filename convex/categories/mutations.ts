import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser, requirePermission } from '../shared/helpers';

export const create = mutation({
  args: {
    eventId: v.id('events'),
    orgId: v.id('organizations'),
    name: v.string(),
    description: v.optional(v.string()),
    rulesSource: v.union(v.literal('global'), v.literal('custom')),
    customRules: v.optional(v.object({
      title: v.string(), description: v.string(), eligibility: v.string(),
      dailyLimit: v.number(), isPaid: v.boolean(), verificationRequired: v.boolean(),
      duplicatePolicy: v.string(), fraudPrevention: v.string(), startDate: v.string(),
      endDate: v.string(), terms: v.string(), notes: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    await requirePermission(ctx, user._id, args.orgId, 'manageCategories');

    const catId = await ctx.db.insert('categories', {
      ...args,
      nomineeCount: 0,
      totalVotes: 0,
      isDeleted: false,
      createdAt: new Date().toISOString(),
    });

    // Update event category count
    const event = await ctx.db.get(args.eventId);
    if (event) {
      await ctx.db.patch(args.eventId, { categoryCount: event.categoryCount + 1 });
    }

    return catId;
  },
});

export const update = mutation({
  args: {
    categoryId: v.id('categories'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    rulesSource: v.optional(v.union(v.literal('global'), v.literal('custom'))),
    customRules: v.optional(v.object({
      title: v.string(), description: v.string(), eligibility: v.string(),
      dailyLimit: v.number(), isPaid: v.boolean(), verificationRequired: v.boolean(),
      duplicatePolicy: v.string(), fraudPrevention: v.string(), startDate: v.string(),
      endDate: v.string(), terms: v.string(), notes: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const cat = await ctx.db.get(args.categoryId);
    if (!cat) throw new Error('Category not found');

    await requirePermission(ctx, user._id, cat.orgId, 'manageCategories');

    const { categoryId, ...updates } = args;
    const filtered = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(categoryId, filtered);
  },
});

export const softDelete = mutation({
  args: { categoryId: v.id('categories') },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const cat = await ctx.db.get(args.categoryId);
    if (!cat) throw new Error('Category not found');

    await requirePermission(ctx, user._id, cat.orgId, 'manageCategories');

    await ctx.db.patch(args.categoryId, { isDeleted: true });

    const event = await ctx.db.get(cat.eventId);
    if (event) {
      await ctx.db.patch(cat.eventId, { categoryCount: Math.max(0, event.categoryCount - 1) });
    }
  },
});
