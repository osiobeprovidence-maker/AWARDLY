import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser, requirePermission, logAudit } from '../shared/helpers';

export const create = mutation({
  args: {
    orgId: v.id('organizations'),
    name: v.string(),
    logoUrl: v.optional(v.string()),
    website: v.optional(v.string()),
    level: v.union(
      v.literal('strategic'), v.literal('gold'),
      v.literal('silver'), v.literal('bronze'),
    ),
    displayOrder: v.number(),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    await requirePermission(ctx, user._id, args.orgId, 'manageOrg');

    const now = new Date().toISOString();
    const sponsorId = await ctx.db.insert('sponsors', {
      orgId: args.orgId,
      name: args.name,
      logoUrl: args.logoUrl,
      website: args.website,
      level: args.level,
      displayOrder: args.displayOrder,
      isActive: true,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    });

    await logAudit(ctx, args.orgId, user._id, 'create', 'sponsor', sponsorId, {
      name: args.name,
      level: args.level,
    });

    return sponsorId;
  },
});

export const update = mutation({
  args: {
    sponsorId: v.id('sponsors'),
    name: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    website: v.optional(v.string()),
    level: v.optional(v.union(
      v.literal('strategic'), v.literal('gold'),
      v.literal('silver'), v.literal('bronze'),
    )),
    displayOrder: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const sponsor = await ctx.db.get(args.sponsorId);
    if (!sponsor) throw new Error('Sponsor not found');
    await requirePermission(ctx, user._id, sponsor.orgId, 'manageOrg');

    const updates: Record<string, any> = { updatedAt: new Date().toISOString() };
    if (args.name !== undefined) updates.name = args.name;
    if (args.logoUrl !== undefined) updates.logoUrl = args.logoUrl;
    if (args.website !== undefined) updates.website = args.website;
    if (args.level !== undefined) updates.level = args.level;
    if (args.displayOrder !== undefined) updates.displayOrder = args.displayOrder;
    if (args.isActive !== undefined) updates.isActive = args.isActive;

    await ctx.db.patch(args.sponsorId, updates);

    await logAudit(ctx, sponsor.orgId, user._id, 'update', 'sponsor', args.sponsorId, {
      name: args.name ?? sponsor.name,
    });

    return args.sponsorId;
  },
});

export const remove = mutation({
  args: {
    sponsorId: v.id('sponsors'),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const sponsor = await ctx.db.get(args.sponsorId);
    if (!sponsor) throw new Error('Sponsor not found');
    await requirePermission(ctx, user._id, sponsor.orgId, 'manageOrg');

    await ctx.db.patch(args.sponsorId, {
      isDeleted: true,
      updatedAt: new Date().toISOString(),
    });

    await logAudit(ctx, sponsor.orgId, user._id, 'delete', 'sponsor', args.sponsorId);
    return args.sponsorId;
  },
});

export const reorder = mutation({
  args: {
    orgId: v.id('organizations'),
    orderedIds: v.array(v.id('sponsors')),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    await requirePermission(ctx, user._id, args.orgId, 'manageOrg');

    for (let i = 0; i < args.orderedIds.length; i++) {
      await ctx.db.patch(args.orderedIds[i], {
        displayOrder: i,
        updatedAt: new Date().toISOString(),
      });
    }

    return true;
  },
});
