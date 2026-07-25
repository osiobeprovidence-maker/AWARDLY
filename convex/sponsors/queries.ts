import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getByOrg = query({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('sponsors')
      .withIndex('by_orgId_isDeleted', (q) =>
        q.eq('orgId', args.orgId).eq('isDeleted', false)
      )
      .order('asc')
      .collect();
  },
});

export const getActiveByOrg = query({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('sponsors')
      .withIndex('by_orgId_isActive', (q) =>
        q.eq('orgId', args.orgId).eq('isActive', true)
      )
      .filter((q) => q.eq(q.field('isDeleted'), false))
      .order('asc')
      .collect();
  },
});

export const getById = query({
  args: { sponsorId: v.id('sponsors') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.sponsorId);
  },
});
