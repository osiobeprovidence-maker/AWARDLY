import { query } from '../_generated/server';
import { v } from 'convex/values';

export const isFollowing = query({
  args: {
    userId: v.id('users'),
    orgId: v.id('organizations'),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query('followers')
      .withIndex('by_userId_orgId', (q) => q.eq('userId', args.userId).eq('orgId', args.orgId))
      .unique();
    return result !== null;
  },
});

export const getFollowers = query({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    const followers = await ctx.db
      .query('followers')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .collect();

    const withUsers = await Promise.all(
      followers.map(async (f) => {
        const user = await ctx.db.get(f.userId);
        return { ...f, user: user ? { name: user.name, avatarUrl: user.avatarUrl } : null };
      })
    );

    return withUsers;
  },
});

export const getFollowing = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const following = await ctx.db
      .query('followers')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .collect();

    const withOrgs = await Promise.all(
      following.map(async (f) => {
        const org = await ctx.db.get(f.orgId);
        return { ...f, org };
      })
    );

    return withOrgs;
  },
});
