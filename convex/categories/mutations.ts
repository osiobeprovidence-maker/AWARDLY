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
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { firebaseUid, ...insertData } = args;
    const user = await getAuthenticatedUser(ctx, firebaseUid);
    await requirePermission(ctx, user._id, args.orgId, 'manageCategories');

    const catId = await ctx.db.insert('categories', {
      ...insertData,
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
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { firebaseUid, ...updates } = args;
    const user = await getAuthenticatedUser(ctx, firebaseUid);
    const cat = await ctx.db.get(args.categoryId);
    if (!cat) throw new Error('Category not found');

    await requirePermission(ctx, user._id, cat.orgId, 'manageCategories');

    const filtered = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(args.categoryId, filtered);
  },
});

export const softDelete = mutation({
  args: {
    categoryId: v.id('categories'),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
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

export const updateBranding = mutation({
  args: {
    categoryId: v.id('categories'),
    branding: v.object({
      primaryColor: v.string(),
      secondaryColor: v.string(),
      accentColor: v.string(),
      categoryIcon: v.string(),
      font: v.string(),
      bannerImage: v.optional(v.string()),
      sponsorLogo: v.optional(v.string()),
      tagline: v.optional(v.string()),
      description: v.optional(v.string()),
    }),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const cat = await ctx.db.get(args.categoryId);
    if (!cat) throw new Error('Category not found');

    await requirePermission(ctx, user._id, cat.orgId, 'manageCategories');

    await ctx.db.patch(args.categoryId, { branding: args.branding });
  },
});

export const updateJudgingCriteria = mutation({
  args: {
    categoryId: v.id('categories'),
    judgingCriteria: v.array(v.object({
      id: v.string(),
      label: v.string(),
      description: v.optional(v.string()),
      maxScore: v.number(),
      weight: v.number(),
    })),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const cat = await ctx.db.get(args.categoryId);
    if (!cat) throw new Error('Category not found');

    await requirePermission(ctx, user._id, cat.orgId, 'manageCategories');

    await ctx.db.patch(args.categoryId, { judgingCriteria: args.judgingCriteria });
  },
});
