import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getUserPortfolio = query({
  args: {
    userId: v.id('users'),
    publicOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db
      .query('portfolioItems')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .order('asc');

    let items = await q.collect();
    items = items.filter((i) => !i.isDeleted);
    if (args.publicOnly) {
      items = items.filter((i) => i.isPublic);
    }
    return items;
  },
});
