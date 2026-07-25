import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getByOrg = query({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    const txs = await ctx.db
      .query('transactions')
      .withIndex('by_orgId_createdAt', (q) => q.eq('orgId', args.orgId))
      .order('desc')
      .collect();
    return txs;
  },
});

export const getEarnings = query({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    const txs = await ctx.db
      .query('transactions')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .collect();

    const completed = txs.filter((t) => t.status === 'completed');

    const earned = completed
      .filter((t) => ['ticket_sale', 'voting_revenue', 'award_entry'].includes(t.type))
      .reduce((sum, t) => sum + t.amount, 0);

    const withdrawn = completed
      .filter((t) => ['withdrawal', 'payout'].includes(t.type))
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const pending = txs
      .filter((t) => t.status === 'pending')
      .reduce((sum, t) => sum + t.amount, 0);

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    const thisMonthStr = thisMonth.toISOString();

    const thisMonthEarnings = completed
      .filter((t) => ['ticket_sale', 'voting_revenue', 'award_entry'].includes(t.type) && t.createdAt >= thisMonthStr)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      availableBalance: earned - withdrawn,
      pendingBalance: pending,
      lifetimeEarnings: earned,
      thisMonthEarnings,
    };
  },
});
