import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser } from '../shared/helpers';

export const toggleFollow = mutation({
  args: {
    followingId: v.id('users'),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    if (user._id === args.followingId) throw new Error('Cannot follow yourself');

    const existing = await ctx.db
      .query('userFollows')
      .withIndex('by_followerId_followingId', (q) =>
        q.eq('followerId', user._id).eq('followingId', args.followingId)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      const target = await ctx.db.get(args.followingId);
      if (target) {
        await ctx.db.patch(args.followingId, {
          followerCount: Math.max(0, (target.followerCount ?? 0) - 1),
        });
      }
      const me = await ctx.db.get(user._id);
      if (me) {
        await ctx.db.patch(user._id, {
          followingCount: Math.max(0, (me.followingCount ?? 0) - 1),
        });
      }
      return false;
    } else {
      await ctx.db.insert('userFollows', {
        followerId: user._id,
        followingId: args.followingId,
        createdAt: new Date().toISOString(),
      });
      const target = await ctx.db.get(args.followingId);
      if (target) {
        await ctx.db.patch(args.followingId, {
          followerCount: (target.followerCount ?? 0) + 1,
        });
        await ctx.db.insert('notifications', {
          userId: args.followingId,
          type: 'follow',
          title: `${user.name} started following you`,
          body: '',
          link: `/profile`,
          isRead: false,
          createdAt: new Date().toISOString(),
        });
      }
      const me = await ctx.db.get(user._id);
      if (me) {
        await ctx.db.patch(user._id, {
          followingCount: (me.followingCount ?? 0) + 1,
        });
      }
      return true;
    }
  },
});
