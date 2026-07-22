import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser, requirePermission, logAudit } from '../shared/helpers';

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    type: v.union(
      v.literal('company'), v.literal('government'), v.literal('nonprofit'),
      v.literal('university'), v.literal('community'), v.literal('media'),
      v.literal('individual'), v.literal('other'),
    ),
    logoUrl: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    primaryColor: v.string(),
    secondaryColor: v.string(),
    website: v.optional(v.string()),
    country: v.string(),
    headquarters: v.optional(v.string()),
    foundedYear: v.optional(v.number()),
    contactEmail: v.string(),
    phone: v.optional(v.string()),
    socialLinks: v.optional(v.object({
      facebook: v.optional(v.string()),
      twitter: v.optional(v.string()),
      instagram: v.optional(v.string()),
      linkedin: v.optional(v.string()),
      youtube: v.optional(v.string()),
      tiktok: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const now = new Date().toISOString();

    // Check slug uniqueness
    const existing = await ctx.db
      .query('organizations')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .unique();
    if (existing) {
      throw new Error('An organization with this slug already exists');
    }

    const orgId = await ctx.db.insert('organizations', {
      ...args,
      ownerId: user._id,
      isVerified: false,
      verificationStatus: 'none',
      followerCount: 0,
      memberCount: 1,
      eventCount: 0,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    });

    // Create owner membership
    await ctx.db.insert('organizationMembers', {
      orgId,
      userId: user._id,
      role: 'owner',
      joinedAt: now,
    });

    await logAudit(ctx, orgId, user._id, 'create', 'organization', orgId);

    return orgId;
  },
});

export const update = mutation({
  args: {
    orgId: v.id('organizations'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.optional(v.union(
      v.literal('company'), v.literal('government'), v.literal('nonprofit'),
      v.literal('university'), v.literal('community'), v.literal('media'),
      v.literal('individual'), v.literal('other'),
    )),
    website: v.optional(v.string()),
    country: v.optional(v.string()),
    headquarters: v.optional(v.string()),
    foundedYear: v.optional(v.number()),
    contactEmail: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    await requirePermission(ctx, user._id, args.orgId, 'manageOrg');

    const { orgId, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );

    await ctx.db.patch(orgId, { ...filtered, updatedAt: new Date().toISOString() });
    await logAudit(ctx, orgId, user._id, 'update', 'organization', orgId);

    return orgId;
  },
});

export const softDelete = mutation({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    await requirePermission(ctx, user._id, args.orgId, 'manageOrg');

    // Only owner can delete
    const membership = await ctx.db
      .query('organizationMembers')
      .withIndex('by_orgId_userId', (q) => q.eq('orgId', args.orgId).eq('userId', user._id))
      .unique();
    if (!membership || membership.role !== 'owner') {
      throw new Error('Only the owner can delete an organization');
    }

    await ctx.db.patch(args.orgId, { isDeleted: true, updatedAt: new Date().toISOString() });
    await logAudit(ctx, args.orgId, user._id, 'delete', 'organization', args.orgId);
  },
});

export const updateBranding = mutation({
  args: {
    orgId: v.id('organizations'),
    logoUrl: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    primaryColor: v.string(),
    secondaryColor: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    await requirePermission(ctx, user._id, args.orgId, 'manageBranding');

    await ctx.db.patch(args.orgId, {
      logoUrl: args.logoUrl,
      coverUrl: args.coverUrl,
      primaryColor: args.primaryColor,
      secondaryColor: args.secondaryColor,
      updatedAt: new Date().toISOString(),
    });
  },
});

export const updateSocialLinks = mutation({
  args: {
    orgId: v.id('organizations'),
    socialLinks: v.object({
      facebook: v.optional(v.string()),
      twitter: v.optional(v.string()),
      instagram: v.optional(v.string()),
      linkedin: v.optional(v.string()),
      youtube: v.optional(v.string()),
      tiktok: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    await requirePermission(ctx, user._id, args.orgId, 'manageOrg');

    await ctx.db.patch(args.orgId, {
      socialLinks: args.socialLinks,
      updatedAt: new Date().toISOString(),
    });
  },
});

export const incrementFollowerCount = mutation({
  args: {
    orgId: v.id('organizations'),
    delta: v.number(),
  },
  handler: async (ctx, args) => {
    const org = await ctx.db.get(args.orgId);
    if (!org) throw new Error('Organization not found');
    await ctx.db.patch(args.orgId, {
      followerCount: Math.max(0, org.followerCount + args.delta),
    });
  },
});

export const incrementEventCount = mutation({
  args: {
    orgId: v.id('organizations'),
    delta: v.number(),
  },
  handler: async (ctx, args) => {
    const org = await ctx.db.get(args.orgId);
    if (!org) throw new Error('Organization not found');
    await ctx.db.patch(args.orgId, {
      eventCount: Math.max(0, org.eventCount + args.delta),
    });
  },
});
