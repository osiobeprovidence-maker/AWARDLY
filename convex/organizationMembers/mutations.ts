import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser, requirePermission, createNotification, logAudit } from '../shared/helpers';

export const invite = mutation({
  args: {
    orgId: v.id('organizations'),
    email: v.string(),
    role: v.union(
      v.literal('admin'), v.literal('event_manager'), v.literal('judge'),
      v.literal('moderator'), v.literal('finance'), v.literal('content_editor'), v.literal('viewer'),
    ),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    await requirePermission(ctx, user._id, args.orgId, 'manageTeam');

    // Find the user by email
    const targetUser = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .unique();

    if (!targetUser) {
      throw new Error('No user found with that email address');
    }

    // Check if already a member
    const existing = await ctx.db
      .query('organizationMembers')
      .withIndex('by_orgId_userId', (q) => q.eq('orgId', args.orgId).eq('userId', targetUser._id))
      .unique();

    if (existing) {
      throw new Error('This user is already a member of this organization');
    }

    const org = await ctx.db.get(args.orgId);

    const memberShipId = await ctx.db.insert('organizationMembers', {
      orgId: args.orgId,
      userId: targetUser._id,
      role: args.role,
      invitedBy: user._id,
      joinedAt: new Date().toISOString(),
    });

    // Update org member count
    await ctx.db.patch(args.orgId, {
      memberCount: (org?.memberCount ?? 0) + 1,
      updatedAt: new Date().toISOString(),
    });

    // Notify the invited user
    await createNotification(
      ctx, targetUser._id, 'org_invite',
      `You've been invited to ${org?.name ?? 'an organization'}`,
      `${user.name} invited you as ${args.role.replace('_', ' ')}`,
      `/dashboard`,
      args.orgId,
    );

    await logAudit(ctx, args.orgId, user._id, 'invite_member', 'member', memberShipId, {
      targetUserId: targetUser._id,
      role: args.role,
    });

    return memberShipId;
  },
});

export const changeRole = mutation({
  args: {
    memberId: v.id('organizationMembers'),
    role: v.union(
      v.literal('owner'), v.literal('admin'), v.literal('event_manager'),
      v.literal('judge'), v.literal('moderator'), v.literal('finance'),
      v.literal('content_editor'), v.literal('viewer'),
    ),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const membership = await ctx.db.get(args.memberId);
    if (!membership) throw new Error('Membership not found');

    await requirePermission(ctx, user._id, membership.orgId, 'manageTeam');

    // Only owners can assign owner role
    if (args.role === 'owner') {
      const callerMembership = await ctx.db
        .query('organizationMembers')
        .withIndex('by_orgId_userId', (q) => q.eq('orgId', membership.orgId).eq('userId', user._id))
        .unique();
      if (!callerMembership || callerMembership.role !== 'owner') {
        throw new Error('Only the owner can transfer ownership');
      }
    }

    await ctx.db.patch(args.memberId, { role: args.role });
  },
});

export const remove = mutation({
  args: { memberId: v.id('organizationMembers') },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const membership = await ctx.db.get(args.memberId);
    if (!membership) throw new Error('Membership not found');

    // Can't remove the owner
    if (membership.role === 'owner') {
      throw new Error('Cannot remove the owner');
    }

    // Users can remove themselves, or admins+ can remove others
    if (membership.userId !== user._id) {
      await requirePermission(ctx, user._id, membership.orgId, 'manageTeam');
    }

    const org = await ctx.db.get(membership.orgId);
    await ctx.db.delete(args.memberId);

    // Update org member count
    await ctx.db.patch(membership.orgId, {
      memberCount: Math.max(0, (org?.memberCount ?? 1) - 1),
      updatedAt: new Date().toISOString(),
    });
  },
});
