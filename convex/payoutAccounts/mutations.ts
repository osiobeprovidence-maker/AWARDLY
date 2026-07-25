import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser, requirePermission, logAudit } from '../shared/helpers';

export const create = mutation({
  args: {
    orgId: v.id('organizations'),
    bankName: v.string(),
    accountNumber: v.string(),
    accountName: v.string(),
    bankCode: v.optional(v.string()),
    currency: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    await requirePermission(ctx, user._id, args.orgId, 'manageOrg');

    const now = new Date().toISOString();

    // If this is the first account, make it default
    const existing = await ctx.db
      .query('payoutAccounts')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .collect();
    const isDefault = existing.length === 0;

    const accountId = await ctx.db.insert('payoutAccounts', {
      orgId: args.orgId,
      bankName: args.bankName,
      accountNumber: args.accountNumber,
      accountName: args.accountName,
      bankCode: args.bankCode,
      currency: args.currency,
      isDefault,
      isVerified: false,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    });

    await logAudit(ctx, args.orgId, user._id, 'create', 'payoutAccount', accountId);
    return accountId;
  },
});

export const update = mutation({
  args: {
    accountId: v.id('payoutAccounts'),
    bankName: v.optional(v.string()),
    accountNumber: v.optional(v.string()),
    accountName: v.optional(v.string()),
    bankCode: v.optional(v.string()),
    currency: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const account = await ctx.db.get(args.accountId);
    if (!account) throw new Error('Payout account not found');
    await requirePermission(ctx, user._id, account.orgId, 'manageOrg');

    const { accountId, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );

    await ctx.db.patch(accountId, { ...filtered, updatedAt: new Date().toISOString() });
    await logAudit(ctx, account.orgId, user._id, 'update', 'payoutAccount', accountId);
  },
});

export const remove = mutation({
  args: { accountId: v.id('payoutAccounts') },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const account = await ctx.db.get(args.accountId);
    if (!account) throw new Error('Payout account not found');
    await requirePermission(ctx, user._id, account.orgId, 'manageOrg');

    await ctx.db.patch(args.accountId, { isDeleted: true, updatedAt: new Date().toISOString() });
    await logAudit(ctx, account.orgId, user._id, 'delete', 'payoutAccount', args.accountId);
  },
});

export const setDefault = mutation({
  args: { accountId: v.id('payoutAccounts') },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const account = await ctx.db.get(args.accountId);
    if (!account) throw new Error('Payout account not found');
    await requirePermission(ctx, user._id, account.orgId, 'manageOrg');

    // Unset all other defaults for this org
    const others = await ctx.db
      .query('payoutAccounts')
      .withIndex('by_orgId', (q) => q.eq('orgId', account.orgId))
      .collect();

    for (const other of others) {
      if (other.isDefault && other._id !== args.accountId) {
        await ctx.db.patch(other._id, { isDefault: false });
      }
    }

    await ctx.db.patch(args.accountId, { isDefault: true, updatedAt: new Date().toISOString() });
  },
});
