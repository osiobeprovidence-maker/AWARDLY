import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    if (!args.storageId) return null;

    const url = await ctx.storage.getUrl(args.storageId as any);
    console.log('Resolved URL:', url);
    return url;
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
