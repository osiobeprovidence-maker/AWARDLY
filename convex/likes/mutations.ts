import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser } from '../shared/helpers';

export const toggle = mutation({
  args: {
    targetType: v.union(v.literal('post'), v.literal('comment'), v.literal('nominee')),
    targetId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const existing = await ctx.db
      .query('likes')
      .withIndex('by_userId_targetType_targetId', (q) =>
        q
          .eq('userId', user._id)
          .eq('targetType', args.targetType)
          .eq('targetId', args.targetId)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);

      if (args.targetType === 'post') {
        const post = await ctx.db.get(args.targetId as any);
        if (post) {
          await ctx.db.patch(args.targetId as any, {
            likesCount: Math.max(0, (post as any).likesCount - 1),
          });
        }
      } else if (args.targetType === 'comment') {
        const comment = await ctx.db.get(args.targetId as any);
        if (comment) {
          await ctx.db.patch(args.targetId as any, {
            likesCount: Math.max(0, (comment as any).likesCount - 1),
          });
        }
      }

      return false;
    }

    await ctx.db.insert('likes', {
      userId: user._id,
      targetType: args.targetType,
      targetId: args.targetId,
      createdAt: new Date().toISOString(),
    });

    if (args.targetType === 'post') {
      const post = await ctx.db.get(args.targetId as any);
      if (post) {
        await ctx.db.patch(args.targetId as any, {
          likesCount: (post as any).likesCount + 1,
        });
      }
    } else if (args.targetType === 'comment') {
      const comment = await ctx.db.get(args.targetId as any);
      if (comment) {
        await ctx.db.patch(args.targetId as any, {
          likesCount: (comment as any).likesCount + 1,
        });
      }
    }

    return true;
  },
});

export const remove = mutation({
  args: {
    targetType: v.union(v.literal('post'), v.literal('comment'), v.literal('nominee')),
    targetId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const existing = await ctx.db
      .query('likes')
      .withIndex('by_userId_targetType_targetId', (q) =>
        q
          .eq('userId', user._id)
          .eq('targetType', args.targetType)
          .eq('targetId', args.targetId)
      )
      .unique();

    if (!existing) {
      throw new Error('Like not found');
    }

    await ctx.db.delete(existing._id);

    if (args.targetType === 'post') {
      const post = await ctx.db.get(args.targetId as any);
      if (post) {
        await ctx.db.patch(args.targetId as any, {
          likesCount: Math.max(0, (post as any).likesCount - 1),
        });
      }
    } else if (args.targetType === 'comment') {
      const comment = await ctx.db.get(args.targetId as any);
      if (comment) {
        await ctx.db.patch(args.targetId as any, {
          likesCount: Math.max(0, (comment as any).likesCount - 1),
        });
      }
    }
  },
});
