import { query } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser, checkPermission } from '../shared/helpers';

export const getLog = query({
  args: {
    orgId: v.id('organizations'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const hasPermission = await checkPermission(ctx, user._id, args.orgId, 'moderateContent');
    if (!hasPermission) return [];

    return await ctx.db
      .query('moderations')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .order('desc')
      .take(args.limit ?? 50);
  },
});

export const isUserBanned = query({
  args: {
    orgId: v.id('organizations'),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const ban = await ctx.db
      .query('bannedUsers')
      .withIndex('by_orgId_userId', (q) => q.eq('orgId', args.orgId).eq('userId', args.userId))
      .unique();
    return !!ban;
  },
});

export const isPostLocked = query({
  args: { postId: v.id('feedPosts') },
  handler: async (ctx, args) => {
    const lock = await ctx.db
      .query('postLocks')
      .withIndex('by_postId', (q) => q.eq('postId', args.postId))
      .unique();
    return lock ? { lockedBy: lock.lockedBy, reason: lock.reason } : null;
  },
});

export const getBannedUsers = query({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const hasPermission = await checkPermission(ctx, user._id, args.orgId, 'moderateContent');
    if (!hasPermission) return [];

    const bans = await ctx.db
      .query('bannedUsers')
      .withIndex('by_orgId_userId', (q) => q.eq('orgId', args.orgId))
      .collect();

    return Promise.all(
      bans.map(async (ban) => {
        const bannedUser = await ctx.db.get(ban.userId);
        const bannedBy = await ctx.db.get(ban.bannedById);
        return {
          ...ban,
          user: bannedUser ? { name: bannedUser.name, avatarUrl: bannedUser.avatarUrl } : null,
          bannedBy: bannedBy ? { name: bannedBy.name } : null,
        };
      })
    );
  },
});
