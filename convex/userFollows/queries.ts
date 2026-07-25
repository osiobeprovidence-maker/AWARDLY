import { query } from '../_generated/server';
import { v } from 'convex/values';

export const isFollowing = query({
  args: {
    followerId: v.id('users'),
    followingId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query('userFollows')
      .withIndex('by_followerId_followingId', (q) =>
        q.eq('followerId', args.followerId).eq('followingId', args.followingId)
      )
      .unique();
    return result !== null;
  },
});

export const getFollowers = query({
  args: { userId: v.id('users'), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const follows = await ctx.db
      .query('userFollows')
      .withIndex('by_followingId', (q) => q.eq('followingId', args.userId))
      .order('desc')
      .take(args.limit ?? 50);

    return Promise.all(
      follows.map(async (f) => {
        const user = await ctx.db.get(f.followerId);
        return user ? {
          _id: user._id,
          name: user.name,
          avatarUrl: user.avatarUrl,
          headline: user.headline,
          username: user.username,
        } : null;
      })
    );
  },
});

export const getFollowing = query({
  args: { userId: v.id('users'), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const follows = await ctx.db
      .query('userFollows')
      .withIndex('by_followerId', (q) => q.eq('followerId', args.userId))
      .order('desc')
      .take(args.limit ?? 50);

    return Promise.all(
      follows.map(async (f) => {
        const user = await ctx.db.get(f.followingId);
        return user ? {
          _id: user._id,
          name: user.name,
          avatarUrl: user.avatarUrl,
          headline: user.headline,
          username: user.username,
        } : null;
      })
    );
  },
});
