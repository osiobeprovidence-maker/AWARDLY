import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getByOrg = query({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('mediaFolders')
      .withIndex('by_orgId_isDeleted', (q) => q.eq('orgId', args.orgId).eq('isDeleted', false))
      .collect();
  },
});

export const getByParent = query({
  args: {
    orgId: v.id('organizations'),
    parentId: v.optional(v.id('mediaFolders')),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('mediaFolders')
      .withIndex('by_orgId_parentId', (q) =>
        q.eq('orgId', args.orgId).eq('parentId', args.parentId ?? undefined)
      )
      .filter((q) => q.eq(q.field('isDeleted'), false))
      .collect();
  },
});

export const getTrash = query({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('mediaFolders')
      .withIndex('by_orgId_isDeleted', (q) => q.eq('orgId', args.orgId).eq('isDeleted', true))
      .collect();
  },
});

export const search = query({
  args: {
    orgId: v.id('organizations'),
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const q = args.query.toLowerCase();
    const folders = await ctx.db
      .query('mediaFolders')
      .withIndex('by_orgId_isDeleted', (q) => q.eq('orgId', args.orgId).eq('isDeleted', false))
      .collect();

    return folders.filter((f) => f.name.toLowerCase().includes(q));
  },
});

export const getPaginated = query({
  args: {
    orgId: v.id('organizations'),
    parentId: v.optional(v.id('mediaFolders')),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 30;

    let q = ctx.db
      .query('mediaFolders')
      .withIndex('by_orgId_parentId', (p) =>
        p.eq('orgId', args.orgId).eq('parentId', args.parentId ?? undefined)
      )
      .filter((p) => p.eq(p.field('isDeleted'), false))
      .order('desc');

    if (args.cursor) {
      q = q.filter((p) => p.lt(p.field('createdAt'), args.cursor!));
    }

    const results = await q.take(limit + 1);
    const hasMore = results.length > limit;
    const items = hasMore ? results.slice(0, limit) : results;

    return {
      items,
      nextCursor: hasMore ? items[items.length - 1]?.createdAt : undefined,
      hasMore,
    };
  },
});
