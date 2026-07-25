import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser, requirePermission, logAudit, createNotification } from '../shared/helpers';

export const createPost = mutation({
  args: {
    orgId: v.id('organizations'),
    content: v.string(),
    visibility: v.union(
      v.literal('public'), v.literal('members_only'),
      v.literal('judges_only'), v.literal('staff_only'),
    ),
    postType: v.union(
      v.literal('text'), v.literal('image'), v.literal('video'),
      v.literal('poll'), v.literal('event_promotion'),
      v.literal('nominee_promotion'), v.literal('live_promotion'),
    ),
    mediaUrls: v.optional(v.array(v.string())),
    eventId: v.optional(v.id('events')),
    nomineeId: v.optional(v.id('nominees')),
    broadcastId: v.optional(v.id('broadcasts')),
    linkUrl: v.optional(v.string()),
    linkTitle: v.optional(v.string()),
    linkDescription: v.optional(v.string()),
    linkImage: v.optional(v.string()),
    scheduledAt: v.optional(v.string()),
    pollQuestion: v.optional(v.string()),
    pollOptions: v.optional(v.array(v.object({ id: v.string(), label: v.string() }))),
    pollEndsAt: v.optional(v.string()),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    await requirePermission(ctx, user._id, args.orgId, 'moderateContent');

    const now = new Date().toISOString();
    const status = args.scheduledAt ? 'scheduled' as const : 'published' as const;
    const publishedAt = status === 'published' ? now : undefined;

    const postId = await ctx.db.insert('feedPosts', {
      orgId: args.orgId,
      authorId: user._id,
      eventId: args.eventId,
      nomineeId: args.nomineeId,
      broadcastId: args.broadcastId,
      content: args.content,
      visibility: args.visibility,
      postType: args.postType,
      mediaUrls: args.mediaUrls,
      linkUrl: args.linkUrl,
      linkTitle: args.linkTitle,
      linkDescription: args.linkDescription,
      linkImage: args.linkImage,
      status,
      scheduledAt: args.scheduledAt,
      publishedAt,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      bookmarksCount: 0,
      viewsCount: 0,
      isPinned: false,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    });

    // Create poll if provided
    if (args.pollQuestion && args.pollOptions && args.pollOptions.length >= 2) {
      await ctx.db.insert('postPolls', {
        postId,
        question: args.pollQuestion,
        options: args.pollOptions.map(o => ({ ...o, votes: 0 })),
        totalVotes: 0,
        endsAt: args.pollEndsAt,
        isDeleted: false,
        createdAt: now,
      });
    }

    await logAudit(ctx, args.orgId, user._id, 'create', 'feedPost', postId, {
      postType: args.postType,
      visibility: args.visibility,
    });

    // Notify followers for published posts
    if (status === 'published' && args.visibility === 'public') {
      const followers = await ctx.db
        .query('followers')
        .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
        .collect();
      for (const f of followers) {
        if (f.userId !== user._id) {
          await createNotification(
            ctx, f.userId, 'nomination',
            `New post from ${(await ctx.db.get(args.orgId))?.name ?? 'Organization'}`,
            args.content.slice(0, 100),
            `/org/${(await ctx.db.get(args.orgId))?.slug}`,
            args.orgId,
          );
        }
      }
    }

    return postId;
  },
});

export const updatePost = mutation({
  args: {
    postId: v.id('feedPosts'),
    content: v.optional(v.string()),
    visibility: v.optional(v.union(
      v.literal('public'), v.literal('members_only'),
      v.literal('judges_only'), v.literal('staff_only'),
    )),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error('Post not found');
    await requirePermission(ctx, user._id, post.orgId, 'moderateContent');

    const updates: Record<string, any> = { updatedAt: new Date().toISOString() };
    if (args.content !== undefined) updates.content = args.content;
    if (args.visibility !== undefined) updates.visibility = args.visibility;

    await ctx.db.patch(args.postId, updates);
    return args.postId;
  },
});

export const deletePost = mutation({
  args: {
    postId: v.id('feedPosts'),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error('Post not found');
    await requirePermission(ctx, user._id, post.orgId, 'moderateContent');

    await ctx.db.patch(args.postId, { isDeleted: true, updatedAt: new Date().toISOString() });
    await logAudit(ctx, post.orgId, user._id, 'delete', 'feedPost', args.postId);
    return args.postId;
  },
});

export const archivePost = mutation({
  args: {
    postId: v.id('feedPosts'),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error('Post not found');
    await requirePermission(ctx, user._id, post.orgId, 'moderateContent');

    await ctx.db.patch(args.postId, { status: 'archived', updatedAt: new Date().toISOString() });
    return args.postId;
  },
});

export const togglePin = mutation({
  args: {
    postId: v.id('feedPosts'),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error('Post not found');
    await requirePermission(ctx, user._id, post.orgId, 'moderateContent');

    await ctx.db.patch(args.postId, { isPinned: !post.isPinned, updatedAt: new Date().toISOString() });
    return !post.isPinned;
  },
});

export const publishNow = mutation({
  args: {
    postId: v.id('feedPosts'),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error('Post not found');
    await requirePermission(ctx, user._id, post.orgId, 'moderateContent');

    const now = new Date().toISOString();
    await ctx.db.patch(args.postId, {
      status: 'published',
      publishedAt: now,
      updatedAt: now,
    });
    return args.postId;
  },
});

export const toggleLike = mutation({
  args: {
    targetType: v.union(v.literal('post'), v.literal('comment'), v.literal('nominee')),
    targetId: v.string(),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);

    const existing = await ctx.db
      .query('likes')
      .withIndex('by_userId_targetType_targetId', (q) =>
        q.eq('userId', user._id).eq('targetType', args.targetType).eq('targetId', args.targetId)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      if (args.targetType === 'post') {
        const post = await ctx.db.get(args.targetId as any) as any;
        if (post && typeof post.likesCount === 'number') {
          await ctx.db.patch(args.targetId as any, { likesCount: Math.max(0, post.likesCount - 1) });
        }
      } else if (args.targetType === 'comment') {
        const comment = await ctx.db.get(args.targetId as any) as any;
        if (comment && typeof comment.likesCount === 'number') {
          await ctx.db.patch(args.targetId as any, { likesCount: Math.max(0, comment.likesCount - 1) });
        }
      }
      return false;
    } else {
      await ctx.db.insert('likes', {
        userId: user._id,
        targetType: args.targetType,
        targetId: args.targetId,
        createdAt: new Date().toISOString(),
      });
      if (args.targetType === 'post') {
        const post = await ctx.db.get(args.targetId as any) as any;
        if (post && typeof post.likesCount === 'number') {
          await ctx.db.patch(args.targetId as any, { likesCount: post.likesCount + 1 });
          if (post.authorId !== user._id) {
            await createNotification(
              ctx, post.authorId, 'like',
              `${user.name} liked your post`,
              post.content.slice(0, 100),
              `/feed`,
              post.orgId,
            );
          }
        }
      } else if (args.targetType === 'comment') {
        const comment = await ctx.db.get(args.targetId as any) as any;
        if (comment && typeof comment.likesCount === 'number') {
          await ctx.db.patch(args.targetId as any, { likesCount: comment.likesCount + 1 });
        }
      }
      return true;
    }
  },
});

export const toggleBookmark = mutation({
  args: {
    targetType: v.union(v.literal('event'), v.literal('post'), v.literal('nominee')),
    targetId: v.string(),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);

    const existing = await ctx.db
      .query('bookmarks')
      .withIndex('by_userId_targetType', (q) => q.eq('userId', user._id).eq('targetType', args.targetType))
      .filter((q) => q.eq(q.field('targetId'), args.targetId))
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      if (args.targetType === 'post') {
        const post = await ctx.db.get(args.targetId as any);
        if (post) {
          await ctx.db.patch(args.targetId as any, { bookmarksCount: Math.max(0, (post as any).bookmarksCount - 1) });
        }
      }
      return false;
    } else {
      await ctx.db.insert('bookmarks', {
        userId: user._id,
        targetType: args.targetType,
        targetId: args.targetId,
        createdAt: new Date().toISOString(),
      });
      if (args.targetType === 'post') {
        const post = await ctx.db.get(args.targetId as any);
        if (post) {
          await ctx.db.patch(args.targetId as any, { bookmarksCount: (post as any).bookmarksCount + 1 });
        }
      }
      return true;
    }
  },
});

export const incrementShare = mutation({
  args: { postId: v.id('feedPosts') },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error('Post not found');
    await ctx.db.patch(args.postId, { sharesCount: post.sharesCount + 1 });
    return post.sharesCount + 1;
  },
});

export const incrementView = mutation({
  args: { postId: v.id('feedPosts') },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error('Post not found');
    await ctx.db.patch(args.postId, { viewsCount: post.viewsCount + 1 });
  },
});

// ─── Comments ──────────────────────────────────────────────────────────

export const addComment = mutation({
  args: {
    postId: v.id('feedPosts'),
    content: v.string(),
    mediaUrl: v.optional(v.string()),
    parentCommentId: v.optional(v.id('comments')),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);

    const commentId = await ctx.db.insert('comments', {
      postId: args.postId,
      authorId: user._id,
      content: args.content,
      mediaUrl: args.mediaUrl,
      parentCommentId: args.parentCommentId,
      likesCount: 0,
      isPinned: false,
      isHidden: false,
      isFeatured: false,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const post = await ctx.db.get(args.postId);
    if (post) {
      await ctx.db.patch(args.postId, { commentsCount: post.commentsCount + 1 });
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

export const updateComment = mutation({
  args: {
    commentId: v.id('comments'),
    content: v.string(),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const comment = await ctx.db.get(args.commentId);
    if (!comment) throw new Error('Comment not found');
    if (comment.authorId !== user._id) throw new Error('Not your comment');

    await ctx.db.patch(args.commentId, {
      content: args.content,
      updatedAt: new Date().toISOString(),
    });
    return args.commentId;
  },
});

export const deleteComment = mutation({
  args: {
    commentId: v.id('comments'),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const comment = await ctx.db.get(args.commentId);
    if (!comment) throw new Error('Comment not found');
    if (comment.authorId !== user._id) throw new Error('Not your comment');

    await ctx.db.patch(args.commentId, { isDeleted: true, updatedAt: new Date().toISOString() });
    const post = await ctx.db.get(comment.postId);
    if (post) {
      await ctx.db.patch(comment.postId, { commentsCount: Math.max(0, post.commentsCount - 1) });
    }
    return args.commentId;
  },
});

export const togglePinComment = mutation({
  args: {
    commentId: v.id('comments'),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const comment = await ctx.db.get(args.commentId);
    if (!comment) throw new Error('Comment not found');
    const post = await ctx.db.get(comment.postId);
    if (!post) throw new Error('Post not found');
    await requirePermission(ctx, user._id, post.orgId, 'moderateContent');

    await ctx.db.patch(args.commentId, { isPinned: !comment.isPinned });
    return !comment.isPinned;
  },
});

// ─── Polls ─────────────────────────────────────────────────────────────

export const createPoll = mutation({
  args: {
    postId: v.id('feedPosts'),
    question: v.string(),
    options: v.array(v.object({ id: v.string(), label: v.string() })),
    endsAt: v.optional(v.string()),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error('Post not found');
    await requirePermission(ctx, user._id, post.orgId, 'moderateContent');

    const existing = await ctx.db
      .query('postPolls')
      .withIndex('by_postId', (q) => q.eq('postId', args.postId))
      .unique();
    if (existing) throw new Error('Poll already exists for this post');

    const pollId = await ctx.db.insert('postPolls', {
      postId: args.postId,
      question: args.question,
      options: args.options.map(o => ({ ...o, votes: 0 })),
      totalVotes: 0,
      endsAt: args.endsAt,
      isDeleted: false,
      createdAt: new Date().toISOString(),
    });
    return pollId;
  },
});

export const votePoll = mutation({
  args: {
    pollId: v.id('postPolls'),
    optionId: v.string(),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const poll = await ctx.db.get(args.pollId);
    if (!poll) throw new Error('Poll not found');
    if (poll.isDeleted) throw new Error('Poll is closed');

    // Check if already voted
    const existingVote = await ctx.db
      .query('postPollVotes')
      .withIndex('by_pollId_userId', (q) => q.eq('pollId', args.pollId).eq('userId', user._id))
      .unique();
    if (existingVote) throw new Error('You have already voted on this poll');

    // Check poll hasn't ended
    if (poll.endsAt && new Date(poll.endsAt) < new Date()) {
      throw new Error('This poll has ended');
    }

    // Validate option
    const option = poll.options.find(o => o.id === args.optionId);
    if (!option) throw new Error('Invalid option');

    await ctx.db.insert('postPollVotes', {
      pollId: args.pollId,
      postId: poll.postId,
      userId: user._id,
      optionId: args.optionId,
      createdAt: new Date().toISOString(),
    });

    // Update vote count
    const updatedOptions = poll.options.map(o =>
      o.id === args.optionId ? { ...o, votes: o.votes + 1 } : o
    );
    await ctx.db.patch(args.pollId, {
      options: updatedOptions,
      totalVotes: poll.totalVotes + 1,
    });

    return true;
  },
});
