import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser, requirePermission, logAudit } from '../shared/helpers';

export const hideComment = mutation({
  args: {
    commentId: v.id('comments'),
    reason: v.optional(v.string()),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const comment = await ctx.db.get(args.commentId);
    if (!comment) throw new Error('Comment not found');
    const post = await ctx.db.get(comment.postId);
    if (!post) throw new Error('Post not found');
    await requirePermission(ctx, user._id, post.orgId, 'moderateContent');

    await ctx.db.patch(args.commentId, { isHidden: true, updatedAt: new Date().toISOString() });
    await ctx.db.insert('moderations', {
      orgId: post.orgId,
      targetType: 'comment',
      targetId: args.commentId,
      action: 'hide',
      moderatorId: user._id,
      reason: args.reason,
      createdAt: new Date().toISOString(),
    });
    await logAudit(ctx, post.orgId, user._id, 'hide', 'comment', args.commentId, { reason: args.reason ?? '' });
    return true;
  },
});

export const unhideComment = mutation({
  args: { commentId: v.id('comments'), firebaseUid: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const comment = await ctx.db.get(args.commentId);
    if (!comment) throw new Error('Comment not found');
    const post = await ctx.db.get(comment.postId);
    if (!post) throw new Error('Post not found');
    await requirePermission(ctx, user._id, post.orgId, 'moderateContent');

    await ctx.db.patch(args.commentId, { isHidden: false, updatedAt: new Date().toISOString() });
    await ctx.db.insert('moderations', {
      orgId: post.orgId,
      targetType: 'comment',
      targetId: args.commentId,
      action: 'unhide',
      moderatorId: user._id,
      createdAt: new Date().toISOString(),
    });
    return true;
  },
});

export const featureComment = mutation({
  args: { commentId: v.id('comments'), firebaseUid: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const comment = await ctx.db.get(args.commentId);
    if (!comment) throw new Error('Comment not found');
    const post = await ctx.db.get(comment.postId);
    if (!post) throw new Error('Post not found');
    await requirePermission(ctx, user._id, post.orgId, 'moderateContent');

    await ctx.db.patch(args.commentId, { isFeatured: !comment.isFeatured, updatedAt: new Date().toISOString() });
    await ctx.db.insert('moderations', {
      orgId: post.orgId,
      targetType: 'comment',
      targetId: args.commentId,
      action: comment.isFeatured ? 'unfeature' : 'feature',
      moderatorId: user._id,
      createdAt: new Date().toISOString(),
    });
    return !comment.isFeatured;
  },
});

export const lockPost = mutation({
  args: {
    postId: v.id('feedPosts'),
    reason: v.optional(v.string()),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error('Post not found');
    await requirePermission(ctx, user._id, post.orgId, 'moderateContent');

    const existing = await ctx.db
      .query('postLocks')
      .withIndex('by_postId', (q) => q.eq('postId', args.postId))
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      await ctx.db.insert('moderations', {
        orgId: post.orgId,
        targetType: 'post',
        targetId: args.postId,
        action: 'unlock',
        moderatorId: user._id,
        createdAt: new Date().toISOString(),
      });
      return false;
    } else {
      await ctx.db.insert('postLocks', {
        postId: args.postId,
        lockedBy: user._id,
        reason: args.reason,
        createdAt: new Date().toISOString(),
      });
      await ctx.db.insert('moderations', {
        orgId: post.orgId,
        targetType: 'post',
        targetId: args.postId,
        action: 'lock',
        moderatorId: user._id,
        reason: args.reason,
        createdAt: new Date().toISOString(),
      });
      return true;
    }
  },
});

export const banUser = mutation({
  args: {
    orgId: v.id('organizations'),
    userId: v.id('users'),
    reason: v.optional(v.string()),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    await requirePermission(ctx, user._id, args.orgId, 'moderateContent');

    if (args.userId === user._id) throw new Error('Cannot ban yourself');

    const existing = await ctx.db
      .query('bannedUsers')
      .withIndex('by_orgId_userId', (q) => q.eq('orgId', args.orgId).eq('userId', args.userId))
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      await ctx.db.insert('moderations', {
        orgId: args.orgId,
        targetType: 'user',
        targetId: args.userId,
        action: 'unban',
        moderatorId: user._id,
        createdAt: new Date().toISOString(),
      });
      return false;
    } else {
      await ctx.db.insert('bannedUsers', {
        orgId: args.orgId,
        userId: args.userId,
        reason: args.reason,
        bannedById: user._id,
        createdAt: new Date().toISOString(),
      });
      await ctx.db.insert('moderations', {
        orgId: args.orgId,
        targetType: 'user',
        targetId: args.userId,
        action: 'ban',
        moderatorId: user._id,
        reason: args.reason,
        createdAt: new Date().toISOString(),
      });
      return true;
    }
  },
});
