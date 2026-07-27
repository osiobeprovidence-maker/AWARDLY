import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getByOrg = query({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('organizationWebsites')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .unique();
  },
});

export const getPublicBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const org = await ctx.db
      .query('organizations')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .unique();
    if (!org || org.isDeleted) return null;

    const website = await ctx.db
      .query('organizationWebsites')
      .withIndex('by_orgId', (q) => q.eq('orgId', org._id))
      .unique();

    return { org, website };
  },
});

export const getPageByOrgAndPageId = query({
  args: { orgId: v.id('organizations'), pageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('websitePages')
      .withIndex('by_orgId_pageId', (q) => q.eq('orgId', args.orgId).eq('pageId', args.pageId))
      .unique();
  },
});

export const getPagesByOrg = query({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('websitePages')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .collect();
  },
});
