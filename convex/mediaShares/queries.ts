import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getByFile = query({
  args: { fileId: v.id('mediaFiles') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('mediaShares')
      .withIndex('by_fileId', (q) => q.eq('fileId', args.fileId))
      .collect();
  },
});

export const getByOrg = query({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('mediaShares')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .filter((q) => q.eq(q.field('isRevoked'), false))
      .order('desc')
      .collect();
  },
});

export const getByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const share = await ctx.db
      .query('mediaShares')
      .withIndex('by_token', (q) => q.eq('token', args.token))
      .unique();

    if (!share || share.isRevoked) return null;
    if (share.expiresAt && new Date(share.expiresAt) < new Date()) return null;

    const file = await ctx.db.get(share.fileId);
    if (!file || file.isDeleted) return null;

    // Get the display URL
    const url = await ctx.storage.getUrl(file.storageId);

    return {
      ...file,
      displayUrl: url ?? file.displayUrl,
      allowDownload: share.allowDownload,
      shareToken: share.token,
      shareAccessCount: share.accessCount,
    };
  },
});
