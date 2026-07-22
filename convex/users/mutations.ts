import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser } from '../shared/helpers';

export const syncUser = mutation({
  args: {
    firebaseUid: v.string(),
    email: v.string(),
    name: v.string(),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('users')
      .withIndex('by_firebaseUid', (q) => q.eq('firebaseUid', args.firebaseUid))
      .unique();

    if (existing) {
      const updates: Record<string, string> = { lastLoginAt: new Date().toISOString() };
      if (args.name && args.name !== existing.name) updates.name = args.name;
      if (args.avatarUrl && args.avatarUrl !== existing.avatarUrl) updates.avatarUrl = args.avatarUrl;
      await ctx.db.patch(existing._id, updates);
      return existing._id;
    }

    return await ctx.db.insert('users', {
      firebaseUid: args.firebaseUid,
      email: args.email,
      name: args.name,
      avatarUrl: args.avatarUrl,
      role: 'user',
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
  },
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const updates: Record<string, string> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.avatarUrl !== undefined) updates.avatarUrl = args.avatarUrl;
    await ctx.db.patch(user._id, updates);
    return user._id;
  },
});

export const updateRole = mutation({
  args: {
    userId: v.id('users'),
    role: v.union(v.literal('user'), v.literal('admin'), v.literal('platform_admin')),
  },
  handler: async (ctx, args) => {
    const caller = await getAuthenticatedUser(ctx);
    if (caller.role !== 'platform_admin') {
      throw new Error('Only platform admins can change user roles');
    }
    await ctx.db.patch(args.userId, { role: args.role });
    return args.userId;
  },
});
