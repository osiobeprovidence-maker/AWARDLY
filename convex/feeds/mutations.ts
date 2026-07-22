import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser, createNotification } from '../shared/helpers';

export const createPost = mutation({
  args: {
    orgId: v.id('organizations'),
    content: v.string(),
    mediaUrls: v.optional(v.array(v.string())),
    mediaType: v.optional(v.union(v.literal('image'), v.literal('video'), v.literal('poll'))),
    eventId: v.optional(v.id('events')),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const now = new Date().toISOString();

    return await ctx.db.insert('feedPosts', {
      orgId: args.orgId,
      authorId: user._id,
      eventId: args.eventId,
      content: args.content,
      mediaUrls: args.mediaUrls,
      mediaType: args.mediaType,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      bookmarksCount: 0,
      isPinned: false,
      isDeleted: false,
      createdAt: now,
    });
  },
});

export const deletePost = mutation({
  args: { postId: v.id('feedPosts') },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error('Post not found');
    if (post.authorId !== user._id) throw new Error('Not your post');

    await ctx.db.patch(args.postId, { isDeleted: true });
  },
});

export const addComment = mutation({
  args: {
    postId: v.id('feedPosts'),
    content: v.string(),
    parentCommentId: v.optional(v.id('comments')),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const commentId = await ctx.db.insert('comments', {
      postId: args.postId,
      authorId: user._id,
      content: args.content,
      parentCommentId: args.parentCommentId,
      likesCount: 0,
      isDeleted: false,
      createdAt: new Date().toISOString(),
    });

    // Increment post comments count
    const post = await ctx.db.get(args.postId);
    if (post) {
      await ctx.db.patch(args.postId, { commentsCount: post.commentsCount + 1 });

      // Notify post author
      if (post.authorId !== user._id) {
        await createNotification(
          ctx, post.authorId, 'comment',
          `${user.name} commented on your post`,
          args.content.slice(0, 100),
          `/feed`,
          post.orgId,
        );
      }
    }

    return commentId;
  },
});

export const toggleLike = mutation({
  args: {
    targetType: v.union(v.literal('post'), v.literal('comment'), v.literal('nominee')),
    targetId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const existing = await ctx.db
      .query('likes')
      .withIndex('by_userId_targetType_targetId', (q) =>
        q.eq('userId', user._id).eq('targetType', args.targetType).eq('targetId', args.targetId)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      // Decrement count on target
      if (args.targetType === 'post') {
        const post = await ctx.db.get(args.targetId as any);
        if (post) await ctx.db.patch(args.targetId as any, { likesCount: Math.max(0, post.likesCount - 1) });
      }
      return false;
    } else {
      await ctx.db.insert('likes', {
        userId: user._id,
        targetType: args.targetType,
        targetId: args.targetId,
        createdAt: new Date().toISOString(),
      });
      // Increment count on target
      if (args.targetType === 'post') {
        const post = await ctx.db.get(args.targetId as any);
        if (post) await ctx.db.patch(args.targetId as any, { likesCount: post.likesCount + 1 });
      }
      return true;
    }
  },
});

export const toggleBookmark = mutation({
  args: {
    targetType: v.union(v.literal('event'), v.literal('post'), v.literal('nominee')),
    targetId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const existing = await ctx.db
      .query('bookmarks')
      .withIndex('by_userId_targetType', (q) => q.eq('userId', user._id).eq('targetType', args.targetType))
      .filter((q) => q.eq(q.field('targetId'), args.targetId))
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return false;
    } else {
      await ctx.db.insert('bookmarks', {
        userId: user._id,
        targetType: args.targetType,
        targetId: args.targetId,
        createdAt: new Date().toISOString(),
      });
      return true;
    }
  },
});

export const togglePin = mutation({
  args: { postId: v.id('feedPosts') },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error('Post not found');

    await ctx.db.patch(args.postId, { isPinned: !post.isPinned });
  },
});
