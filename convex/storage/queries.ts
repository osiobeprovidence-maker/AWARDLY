import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    if (!args.storageId) return null;
    return await ctx.storage.getUrl(args.storageId as any);
  },
});

export const getUrls = query({
  args: { storageIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    const urls: Record<string, string | null> = {};
    for (const id of args.storageIds) {
      urls[id] = await ctx.storage.getUrl(id as any);
    }
    return urls;
  },
});
