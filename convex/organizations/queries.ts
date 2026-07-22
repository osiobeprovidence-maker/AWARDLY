import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('organizations')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .filter((q) => q.eq(q.field('isDeleted'), false))
      .unique();
  },
});

export const getById = query({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orgId);
  },
});

export const getByOwner = query({
  args: { ownerId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('organizations')
      .withIndex('by_ownerId', (q) => q.eq('ownerId', args.ownerId))
      .filter((q) => q.eq(q.field('isDeleted'), false))
      .collect();
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const q = args.query.toLowerCase();
    const all = await ctx.db
      .query('organizations')
      .withIndex('by_isDeleted', (q) => q.eq('isDeleted', false))
      .collect();
    return all
      .filter((o) => o.name.toLowerCase().includes(q) || o.description.toLowerCase().includes(q))
      .slice(0, 20);
  },
});

export const getPublicProfile = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const org = await ctx.db
      .query('organizations')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .filter((q) => q.eq(q.field('isDeleted'), false))
      .unique();
    if (!org) return null;

    const owner = await ctx.db.get(org.ownerId);

    return {
      ...org,
      ownerName: owner?.name ?? 'Unknown',
    };
  },
});
