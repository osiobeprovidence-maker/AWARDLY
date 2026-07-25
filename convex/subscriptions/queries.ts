import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getByOrg = query({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('subscriptions')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .unique();
  },
});
