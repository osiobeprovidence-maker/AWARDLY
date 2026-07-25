import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getByOrg = query({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('mediaFiles')
      .withIndex('by_orgId_isDeleted', (q) => q.eq('orgId', args.orgId).eq('isDeleted', false))
      .order('desc')
      .collect();
  },
});

export const getByFolder = query({
  args: {
    orgId: v.id('organizations'),
    folderId: v.optional(v.id('mediaFolders')),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('mediaFiles')
      .withIndex('by_orgId_folderId', (q) =>
        q.eq('orgId', args.orgId).eq('folderId', args.folderId ?? undefined)
      )
      .filter((q) => q.eq(q.field('isDeleted'), false))
      .order('desc')
      .collect();
  },
});

export const getTrash = query({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    const files = await ctx.db
      .query('mediaFiles')
      .withIndex('by_orgId_isDeleted', (q) => q.eq('orgId', args.orgId).eq('isDeleted', true))
      .order('desc')
      .collect();

    // Filter to only show files deleted within 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    return files.filter((f) => f.deletedAt && f.deletedAt > thirtyDaysAgo);
  },
});

export const getStorageUsage = query({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    const files = await ctx.db
      .query('mediaFiles')
      .withIndex('by_orgId_isDeleted', (q) => q.eq('orgId', args.orgId).eq('isDeleted', false))
      .collect();

    const folders = await ctx.db
      .query('mediaFolders')
      .withIndex('by_orgId_isDeleted', (q) => q.eq('orgId', args.orgId).eq('isDeleted', false))
      .collect();

    const totalSize = files.reduce((sum, f) => sum + f.fileSize, 0);
    const fileCount = files.length;
    const folderCount = folders.length;

    const subscription = await ctx.db
      .query('subscriptions')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .unique();

    const plan = subscription?.plan ?? 'starter';
    let storageLimit: number;
    switch (plan) {
      case 'starter': storageLimit = 1024 * 1024 * 1024; break;
      case 'professional': storageLimit = 100 * 1024 * 1024 * 1024; break;
      case 'enterprise': storageLimit = 1024 * 1024 * 1024 * 1024; break;
      default: storageLimit = 1024 * 1024 * 1024;
    }

    return {
      totalSize,
      fileCount,
      folderCount,
      storageLimit,
      plan,
      percentage: Math.round((totalSize / storageLimit) * 100),
      isFull: totalSize >= storageLimit,
    };
  },
});

export const search = query({
  args: {
    orgId: v.id('organizations'),
    query: v.string(),
    fileType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let results = await ctx.db
      .query('mediaFiles')
      .withIndex('by_orgId_isDeleted', (q) => q.eq('orgId', args.orgId).eq('isDeleted', false))
      .collect();

    if (args.query) {
      const q = args.query.toLowerCase();
      results = results.filter((f) => f.name.toLowerCase().includes(q));
    }

    if (args.fileType) {
      results = results.filter((f) => f.fileType === args.fileType);
    }

    return results;
  },
});

export const getFavorites = query({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    const files = await ctx.db
      .query('mediaFiles')
      .withIndex('by_orgId_isDeleted', (q) => q.eq('orgId', args.orgId).eq('isDeleted', false))
      .collect();

    return files.filter((f) => f.isFavorite);
  },
});

export const getPaginated = query({
  args: {
    orgId: v.id('organizations'),
    folderId: v.optional(v.id('mediaFolders')),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 30;

    let q = ctx.db
      .query('mediaFiles')
      .withIndex('by_orgId_folderId', (p) =>
        p.eq('orgId', args.orgId).eq('folderId', args.folderId ?? undefined)
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
