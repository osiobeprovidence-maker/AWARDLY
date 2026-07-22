import { query } from '../_generated/server';
import { v } from 'convex/values';
import { getCurrentUser } from '../shared/helpers';

export const getByPost = query({
  args: {
    postId: v.id('feedPosts'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    const comments = await ctx.db
      .query('comments')
      .withIndex('by_postId', (q) => q.eq('postId', args.postId))
      .filter((q) => q.eq(q.field('isDeleted'), false))
      .filter((q) => q.eq(q.field('parentCommentId'), undefined))
      .order('desc')
      .take(limit);

    const user = await getCurrentUser(ctx);

    const enriched = await Promise.all(
      comments.map(async (comment) => {
        const author = await ctx.db.get(comment.authorId);
        const hasLiked = user
          ? !!(await ctx.db
              .query('likes')
              .withIndex('by_userId_targetType_targetId', (q) =>
                q
                  .eq('userId', user._id)
                  .eq('targetType', 'comment')
                  .eq('targetId', comment._id)
              )
              .unique())
          : false;

        const replyCount = (
          await ctx.db
            .query('comments')
            .withIndex('by_parentCommentId', (q) =>
              q.eq('parentCommentId', comment._id)
            )
            .filter((q) => q.eq(q.field('isDeleted'), false))
            .collect()
        ).length;

        return {
          ...comment,
          author: author
            ? { _id: author._id, name: author.name, avatarUrl: author.avatarUrl }
            : null,
          hasLiked,
          replyCount,
        };
      })
    );

    return enriched;
  },
});

export const getReplies = query({
  args: {
    parentCommentId: v.id('comments'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;

    const replies = await ctx.db
      .query('comments')
      .withIndex('by_parentCommentId', (q) =>
        q.eq('parentCommentId', args.parentCommentId)
      )
      .filter((q) => q.eq(q.field('isDeleted'), false))
      .order('asc')
      .take(limit);

    const user = await getCurrentUser(ctx);

    return Promise.all(
      replies.map(async (reply) => {
        const author = await ctx.db.get(reply.authorId);
        const hasLiked = user
          ? !!(await ctx.db
              .query('likes')
              .withIndex('by_userId_targetType_targetId', (q) =>
                q
                  .eq('userId', user._id)
                  .eq('targetType', 'comment')
                  .eq('targetId', reply._id)
              )
              .unique())
          : false;

        return {
          ...reply,
          author: author
            ? { _id: author._id, name: author.name, avatarUrl: author.avatarUrl }
            : null,
          hasLiked,
        };
      })
    );
  },
});

export const getById = query({
  args: { commentId: v.id('comments') },
  handler: async (ctx, args) => {
    const comment = await ctx.db.get(args.commentId);
    if (!comment || comment.isDeleted) return null;

    const author = await ctx.db.get(comment.authorId);
    return {
      ...comment,
      author: author
        ? { _id: author._id, name: author.name, avatarUrl: author.avatarUrl }
        : null,
    };
  },
});

export const getRecentByUser = query({
  args: {
    userId: v.id('users'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;

    return await ctx.db
      .query('comments')
      .withIndex('by_authorId', (q) => q.eq('authorId', args.userId))
      .filter((q) => q.eq(q.field('isDeleted'), false))
      .order('desc')
      .take(limit);
  },
});
