import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getByOrg = query({
  args: {
    orgId: v.id('organizations'),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
    filter: v.optional(v.union(
      v.literal('all'), v.literal('image'), v.literal('video'),
      v.literal('poll'), v.literal('event_promotion'),
      v.literal('pinned'), v.literal('archived'),
    )),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;

    let q = ctx.db
      .query('feedPosts')
      .withIndex('by_orgId_createdAt', (q) => q.eq('orgId', args.orgId))
      .order('desc');

    if (args.cursor) {
      q = q.filter((q) => q.lt(q.field('createdAt'), args.cursor!));
    }

    const posts = await q.take(limit * 3);

    let filtered = posts.filter((p: any) => !p.isDeleted);

    if (args.filter && args.filter !== 'all') {
      if (args.filter === 'pinned') {
        filtered = filtered.filter((p: any) => p.isPinned);
      } else if (args.filter === 'archived') {
        filtered = filtered.filter((p: any) => p.status === 'archived');
      } else {
        filtered = filtered.filter((p: any) => p.postType === args.filter && p.status === 'published');
      }
    } else {
      filtered = filtered.filter((p: any) => p.status === 'published');
    }

    // Pinned first, then by date
    filtered.sort((a: any, b: any) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

    const result = filtered.slice(0, limit);
    const hasMore = filtered.length > limit;
    const nextCursor = result.length > 0 ? result[result.length - 1].createdAt : null;

    return {
      posts: result.map((post: any) => ({ ...post, _id: post._id })),
      nextCursor,
      hasMore,
    };
  },
});

export const getPublicByOrg = query({
  args: {
    orgId: v.id('organizations'),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    let q = ctx.db
      .query('feedPosts')
      .withIndex('by_orgId_createdAt', (q) => q.eq('orgId', args.orgId))
      .order('desc');

    const posts = await q.take(limit * 3);

    const filtered = posts
      .filter((p: any) => !p.isDeleted && p.status === 'published' && p.visibility === 'public')
      .sort((a: any, b: any) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0;
      })
      .slice(0, limit);

    return Promise.all(
      filtered.map(async (post: any) => {
        const author = await ctx.db.get(post.authorId) as any;
        const org = await ctx.db.get(post.orgId) as any;
        const poll = await ctx.db
          .query('postPolls')
          .withIndex('by_postId', (q) => q.eq('postId', post._id))
          .unique();
        return {
          ...post,
          author: author ? { name: author.name, avatarUrl: author.avatarUrl } : null,
          org: org ? { name: org.name, logoUrl: org.logoUrl, isVerified: org.isVerified } : null,
          poll: poll && !poll.isDeleted ? poll : null,
        };
      })
    );
  },
});

export const getDrafts = query({
  args: {
    orgId: v.id('organizations'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    const posts = await ctx.db
      .query('feedPosts')
      .withIndex('by_orgId_status', (q) => q.eq('orgId', args.orgId).eq('status', 'draft'))
      .order('desc')
      .take(limit);
    return posts.filter((p: any) => !p.isDeleted);
  },
});

export const getScheduled = query({
  args: {
    orgId: v.id('organizations'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    const posts = await ctx.db
      .query('feedPosts')
      .withIndex('by_orgId_status', (q) => q.eq('orgId', args.orgId).eq('status', 'scheduled'))
      .order('desc')
      .take(limit);
    return posts.filter((p: any) => !p.isDeleted);
  },
});

export const getById = query({
  args: { postId: v.id('feedPosts') },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post || post.isDeleted) return null;
    const author = await ctx.db.get(post.authorId) as any;
    const org = await ctx.db.get(post.orgId) as any;
    const poll = await ctx.db
      .query('postPolls')
      .withIndex('by_postId', (q) => q.eq('postId', post._id))
      .unique();
    return {
      ...post,
      author: author ? { name: author.name, avatarUrl: author.avatarUrl } : null,
      org: org ? { name: org.name, logoUrl: org.logoUrl, isVerified: org.isVerified, slug: org.slug } : null,
      poll: poll && !poll.isDeleted ? poll : null,
    };
  },
});

export const getComments = query({
  args: { postId: v.id('feedPosts') },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query('comments')
      .withIndex('by_postId', (q) => q.eq('postId', args.postId))
      .filter((q) => q.and(
        q.eq(q.field('isDeleted'), false),
        q.eq(q.field('isHidden'), false),
      ))
      .order('asc')
      .collect();

    const hydrated = await Promise.all(
      comments.map(async (c) => {
        const author = await ctx.db.get(c.authorId);
        return { ...c, author: author ? { name: author.name, avatarUrl: author.avatarUrl } : null };
      })
    );

    // Build nested tree
    const rootComments = hydrated.filter((c: any) => !c.parentCommentId);
    const childMap = new Map<string, any[]>();
    for (const c of hydrated) {
      if (c.parentCommentId) {
        const children = childMap.get(c.parentCommentId) ?? [];
        children.push(c);
        childMap.set(c.parentCommentId, children);
      }
    }

    const attachChildren = (comment: any): any => ({
      ...comment,
      replies: (childMap.get(comment._id) ?? []).map(attachChildren),
    });

    return rootComments.map(attachChildren);
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

export const getPollByPost = query({
  args: { postId: v.id('feedPosts') },
  handler: async (ctx, args) => {
    const poll = await ctx.db
      .query('postPolls')
      .withIndex('by_postId', (q) => q.eq('postId', args.postId))
      .unique();
    if (!poll || poll.isDeleted) return null;
    return poll;
  },
});

export const hasVoted = query({
  args: {
    pollId: v.id('postPolls'),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const vote = await ctx.db
      .query('postPollVotes')
      .withIndex('by_pollId_userId', (q) => q.eq('pollId', args.pollId).eq('userId', args.userId))
      .unique();
    return vote ? vote.optionId : null;
  },
});

export const getMyBookmarks = query({
  args: {
    userId: v.id('users'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const bookmarks = await ctx.db
      .query('bookmarks')
      .withIndex('by_userId_targetType', (q) => q.eq('userId', args.userId).eq('targetType', 'post'))
      .order('desc')
      .take(limit);

    return Promise.all(
      bookmarks.map(async (b) => {
        const post = await ctx.db.get(b.targetId as any) as any;
        if (!post || post.isDeleted) return null;
        const author = await ctx.db.get(post.authorId) as any;
        const org = await ctx.db.get(post.orgId) as any;
        return {
          ...b,
          post: {
            ...post,
            author: author ? { name: author.name, avatarUrl: author.avatarUrl } : null,
            org: org ? { name: org.name, logoUrl: org.logoUrl } : null,
          },
        };
      })
    );
  },
});

export const getByAuthor = query({
  args: {
    authorId: v.id('users'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const posts = await ctx.db
      .query('feedPosts')
      .withIndex('by_authorId', (q) => q.eq('authorId', args.authorId))
      .order('desc')
      .take(limit);

    return posts
      .filter((p: any) => !p.isDeleted && p.status === 'published');
  },
});

export const search = query({
  args: {
    orgId: v.id('organizations'),
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const q = args.query.toLowerCase();
    const posts = await ctx.db
      .query('feedPosts')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .order('desc')
      .take(100);

    return posts
      .filter((p: any) => !p.isDeleted && p.status === 'published' && p.content.toLowerCase().includes(q))
      .slice(0, 20);
  },
});
