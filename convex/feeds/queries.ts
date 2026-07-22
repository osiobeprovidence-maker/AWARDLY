import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getByOrg = query({
  args: {
    orgId: v.id('organizations'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const posts = await ctx.db
      .query('feedPosts')
      .withIndex('by_orgId_createdAt', (q) => q.eq('orgId', args.orgId))
      .order('desc')
      .take(limit);

    return Promise.all(
      posts.map(async (post) => {
        const author = await ctx.db.get(post.authorId);
        return { ...post, author: author ? { name: author.name, avatarUrl: author.avatarUrl } : null };
      })
    );
  },
});

export const getById = query({
  args: { postId: v.id('feedPosts') },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) return null;
    const author = await ctx.db.get(post.authorId);
    return { ...post, author: author ? { name: author.name, avatarUrl: author.avatarUrl } : null };
  },
});

export const getComments = query({
  args: { postId: v.id('feedPosts') },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query('comments')
      .withIndex('by_postId', (q) => q.eq('postId', args.postId))
      .filter((q) => q.eq(q.field('isDeleted'), false))
      .collect();

    return Promise.all(
      comments.map(async (c) => {
        const author = await ctx.db.get(c.authorId);
        return { ...c, author: author ? { name: author.name, avatarUrl: author.avatarUrl } : null };
      })
    );
  },
});

export const isLiked = query({
  args: {
    userId: v.id('users'),
    targetType: v.union(v.literal('post'), v.literal('comment'), v.literal('nominee')),
    targetId: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query('likes')
      .withIndex('by_userId_targetType_targetId', (q) =>
        q.eq('userId', args.userId).eq('targetType', args.targetType).eq('targetId', args.targetId)
      )
      .unique();
    return result !== null;
  },
});

export const isBookmarked = query({
  args: {
    userId: v.id('users'),
    targetType: v.union(v.literal('event'), v.literal('post'), v.literal('nominee')),
    targetId: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query('bookmarks')
      .withIndex('by_userId_targetType', (q) => q.eq('userId', args.userId).eq('targetType', args.targetType))
      .filter((q) => q.eq(q.field('targetId'), args.targetId))
      .unique();
    return result !== null;
  },
});
