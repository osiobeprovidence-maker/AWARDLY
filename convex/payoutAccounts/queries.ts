import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getByOrg = query({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    const accounts = await ctx.db
      .query('payoutAccounts')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .collect();
    return accounts.filter((a) => !a.isDeleted);
  },
});

export const getDefault = query({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    const accounts = await ctx.db
      .query('payoutAccounts')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .collect();
    return accounts.find((a) => a.isDefault && !a.isDeleted) ?? null;
  },
});
