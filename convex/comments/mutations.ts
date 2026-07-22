import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser } from '../shared/helpers';

export const create = mutation({
  args: {
    postId: v.id('feedPosts'),
    content: v.string(),
    parentCommentId: v.optional(v.id('comments')),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (!args.content.trim()) {
      throw new Error('Comment cannot be empty');
    }

    if (args.content.length > 2000) {
      throw new Error('Comment exceeds 2000 character limit');
    }

    if (args.parentCommentId) {
      const parent = await ctx.db.get(args.parentCommentId);
      if (!parent || parent.isDeleted) {
        throw new Error('Parent comment not found');
      }
      if (parent.postId !== args.postId) {
        throw new Error('Parent comment does not belong to this post');
      }
    }

    const postId = await ctx.db.insert('comments', {
      postId: args.postId,
      authorId: user._id,
      content: args.content.trim(),
      parentCommentId: args.parentCommentId,
      likesCount: 0,
      isDeleted: false,
      createdAt: new Date().toISOString(),
    });

    await ctx.db.patch(args.postId, {
      commentsCount: (await ctx.db.get(args.postId))!.commentsCount + 1,
    });

    return postId;
  },
});

export const edit = mutation({
  args: {
    commentId: v.id('comments'),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const comment = await ctx.db.get(args.commentId);
    if (!comment || comment.isDeleted) {
      throw new Error('Comment not found');
    }

    if (comment.authorId !== user._id) {
      throw new Error('You can only edit your own comments');
    }

    if (!args.content.trim()) {
      throw new Error('Comment cannot be empty');
    }

    if (args.content.length > 2000) {
      throw new Error('Comment exceeds 2000 character limit');
    }

    await ctx.db.patch(args.commentId, {
      content: args.content.trim(),
    });
  },
});

export const remove = mutation({
  args: { commentId: v.id('comments') },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const comment = await ctx.db.get(args.commentId);
    if (!comment || comment.isDeleted) {
      throw new Error('Comment not found');
    }

    if (comment.authorId !== user._id) {
      throw new Error('You can only delete your own comments');
    }

    await ctx.db.patch(args.commentId, { isDeleted: true });

    await ctx.db.patch(comment.postId, {
      commentsCount: Math.max(
        0,
        (await ctx.db.get(comment.postId))!.commentsCount - 1
      ),
    });
  },
});

export const reply = mutation({
  args: {
    postId: v.id('feedPosts'),
    parentCommentId: v.id('comments'),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (!args.content.trim()) {
      throw new Error('Reply cannot be empty');
    }

    const parent = await ctx.db.get(args.parentCommentId);
    if (!parent || parent.isDeleted) {
      throw new Error('Parent comment not found');
    }

    if (parent.postId !== args.postId) {
      throw new Error('Parent comment does not belong to this post');
    }

    const replyId = await ctx.db.insert('comments', {
      postId: args.postId,
      authorId: user._id,
      content: args.content.trim(),
      parentCommentId: args.parentCommentId,
      likesCount: 0,
      isDeleted: false,
      createdAt: new Date().toISOString(),
    });

    await ctx.db.patch(args.postId, {
      commentsCount: (await ctx.db.get(args.postId))!.commentsCount + 1,
    });

    return replyId;
  },
});
