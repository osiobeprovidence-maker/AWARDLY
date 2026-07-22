import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser, requirePermission } from '../shared/helpers';

export const create = mutation({
  args: {
    categoryId: v.id('categories'),
    eventId: v.id('events'),
    orgId: v.id('organizations'),
    name: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    await requirePermission(ctx, user._id, args.orgId, 'manageCategories');

    const nomId = await ctx.db.insert('nominees', {
      ...args,
      voteCount: 0,
      isDeleted: false,
      createdAt: new Date().toISOString(),
    });

    // Update category nominee count
    const cat = await ctx.db.get(args.categoryId);
    if (cat) {
      await ctx.db.patch(args.categoryId, { nomineeCount: cat.nomineeCount + 1 });
    }

    // Update event nominee count
    const event = await ctx.db.get(args.eventId);
    if (event) {
      await ctx.db.patch(args.eventId, { nomineeCount: event.nomineeCount + 1 });
    }

    return nomId;
  },
});

export const update = mutation({
  args: {
    nomineeId: v.id('nominees'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const nom = await ctx.db.get(args.nomineeId);
    if (!nom) throw new Error('Nominee not found');

    await requirePermission(ctx, user._id, nom.orgId, 'manageCategories');

    const { nomineeId, ...updates } = args;
    const filtered = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(nomineeId, filtered);
  },
});

export const softDelete = mutation({
  args: { nomineeId: v.id('nominees') },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const nom = await ctx.db.get(args.nomineeId);
    if (!nom) throw new Error('Nominee not found');

    await requirePermission(ctx, user._id, nom.orgId, 'manageCategories');

    await ctx.db.patch(args.nomineeId, { isDeleted: true });

    const cat = await ctx.db.get(nom.categoryId);
    if (cat) {
      await ctx.db.patch(nom.categoryId, { nomineeCount: Math.max(0, cat.nomineeCount - 1) });
    }

    const event = await ctx.db.get(nom.eventId);
    if (event) {
      await ctx.db.patch(nom.eventId, { nomineeCount: Math.max(0, event.nomineeCount - 1) });
    }
  },
});
