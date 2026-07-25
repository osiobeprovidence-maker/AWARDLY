import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser, requirePermission, logAudit } from '../shared/helpers';

export const create = mutation({
  args: {
    orgId: v.id('organizations'),
    eventId: v.optional(v.id('events')),
    type: v.union(
      v.literal('ticket_sale'), v.literal('voting_revenue'),
      v.literal('award_entry'), v.literal('withdrawal'),
      v.literal('refund'), v.literal('platform_fee'),
      v.literal('payout'),
    ),
    amount: v.number(),
    currency: v.string(),
    status: v.union(v.literal('pending'), v.literal('completed'), v.literal('failed'), v.literal('cancelled')),
    description: v.string(),
    reference: v.optional(v.string()),
    payoutAccountId: v.optional(v.id('payoutAccounts')),
    metadata: v.optional(v.record(v.string(), v.string())),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    await requirePermission(ctx, user._id, args.orgId, 'manageOrg');

    const now = new Date().toISOString();
    const txId = await ctx.db.insert('transactions', {
      ...args,
      createdAt: now,
    });

    await logAudit(ctx, args.orgId, user._id, 'create', 'transaction', txId);
    return txId;
  },
});

export const requestPayout = mutation({
  args: {
    orgId: v.id('organizations'),
    payoutAccountId: v.id('payoutAccounts'),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    await requirePermission(ctx, user._id, args.orgId, 'manageOrg');

    const account = await ctx.db.get(args.payoutAccountId);
    if (!account || account.orgId !== args.orgId || account.isDeleted) {
      throw new Error('Invalid payout account');
    }

    // Check available balance
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

    const available = earned - withdrawn;
    if (args.amount > available) {
      throw new Error(`Insufficient balance. Available: ${available}`);
    }

    const now = new Date().toISOString();
    const txId = await ctx.db.insert('transactions', {
      orgId: args.orgId,
      type: 'payout',
      amount: -args.amount,
      currency: account.currency,
      status: 'pending',
      description: `Payout to ${account.bankName} ****${account.accountNumber.slice(-4)}`,
      payoutAccountId: args.payoutAccountId,
      createdAt: now,
    });

    await logAudit(ctx, args.orgId, user._id, 'request_payout', 'transaction', txId);
    return txId;
  },
});
