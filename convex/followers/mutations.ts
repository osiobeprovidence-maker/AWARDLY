import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser, createNotification } from '../shared/helpers';

export const follow = mutation({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const existing = await ctx.db
      .query('followers')
      .withIndex('by_userId_orgId', (q) => q.eq('userId', user._id).eq('orgId', args.orgId))
      .unique();

    if (existing) {
      throw new Error('Already following this organization');
    }

    await ctx.db.insert('followers', {
      userId: user._id,
      orgId: args.orgId,
      createdAt: new Date().toISOString(),
    });

    // Increment follower count
    const org = await ctx.db.get(args.orgId);
    if (org) {
      await ctx.db.patch(args.orgId, { followerCount: org.followerCount + 1 });
    }

    // Notify the org owner
    await createNotification(
      ctx, org!.ownerId, 'follow',
      `${user.name} is now following ${org!.name}`,
      undefined,
      undefined,
      args.orgId,
    );
  },
});

export const unfollow = mutation({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const existing = await ctx.db
      .query('followers')
      .withIndex('by_userId_orgId', (q) => q.eq('userId', user._id).eq('orgId', args.orgId))
      .unique();

    if (!existing) {
      throw new Error('Not following this organization');
    }

    await ctx.db.delete(existing._id);

    const org = await ctx.db.get(args.orgId);
    if (org) {
      await ctx.db.patch(args.orgId, { followerCount: Math.max(0, org.followerCount - 1) });
    }
  },
});
