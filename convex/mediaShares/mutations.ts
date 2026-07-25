import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser, requirePermission } from '../shared/helpers';

function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 24; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const create = mutation({
  args: {
    fileId: v.id('mediaFiles'),
    allowDownload: v.optional(v.boolean()),
    expiresInDays: v.optional(v.number()),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const file = await ctx.db.get(args.fileId);
    if (!file) throw new Error('File not found');

    await requirePermission(ctx, user._id, file.orgId, 'manageMedia');

    // Check for existing active share for this file
    const existing = await ctx.db
      .query('mediaShares')
      .withIndex('by_fileId', (q) => q.eq('fileId', args.fileId))
      .filter((q) => q.eq(q.field('isRevoked'), false))
      .first();

    if (existing) return existing.token;

    const token = generateToken();
    const now = new Date().toISOString();
    const expiresAt = args.expiresInDays
      ? new Date(Date.now() + args.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
      : undefined;

    await ctx.db.insert('mediaShares', {
      orgId: file.orgId,
      fileId: args.fileId,
      createdBy: user._id,
      token,
      allowDownload: args.allowDownload ?? false,
      expiresAt,
      accessCount: 0,
      isRevoked: false,
      createdAt: now,
    });

    return token;
  },
});

export const revoke = mutation({
  args: {
    shareId: v.id('mediaShares'),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const share = await ctx.db.get(args.shareId);
    if (!share) throw new Error('Share link not found');

    await requirePermission(ctx, user._id, share.orgId, 'manageMedia');

    await ctx.db.patch(args.shareId, { isRevoked: true });
  },
});

export const incrementAccess = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const share = await ctx.db
      .query('mediaShares')
      .withIndex('by_token', (q) => q.eq('token', args.token))
      .unique();

    if (!share || share.isRevoked) throw new Error('Share link invalid');
    if (share.expiresAt && new Date(share.expiresAt) < new Date()) throw new Error('Share link expired');

    await ctx.db.patch(share._id, { accessCount: share.accessCount + 1 });
  },
});
