import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser } from '../shared/helpers';

async function requirePlatformAdmin(ctx: any, firebaseUid?: string) {
  const user = await getAuthenticatedUser(ctx, firebaseUid);
  if (user.role !== 'platform_admin' && user.role !== 'admin') {
    throw new Error('Access denied: platform admin required');
  }
  return user;
}

export const suspendOrg = mutation({
  args: { firebaseUid: v.optional(v.string()), orgId: v.id('organizations'), reason: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const admin = await requirePlatformAdmin(ctx, args.firebaseUid);
    const org = await ctx.db.get(args.orgId);
    if (!org) throw new Error('Organization not found');

    await ctx.db.patch(args.orgId, { isDeleted: true, updatedAt: new Date().toISOString() });

    const events = await ctx.db.query('events').withIndex('by_orgId', (q) => q.eq('orgId', args.orgId)).collect();
    for (const event of events) {
      await ctx.db.patch(event._id, { isDeleted: true, updatedAt: new Date().toISOString() });
    }

    const members = await ctx.db.query('organizationMembers').withIndex('by_orgId', (q) => q.eq('orgId', args.orgId)).collect();
    for (const member of members) {
      await ctx.db.delete(member._id);
    }

    await ctx.db.insert('auditLogs', {
      orgId: args.orgId,
      userId: admin._id,
      action: 'platform.org.suspended',
      targetType: 'organization',
      targetId: args.orgId,
      metadata: { adminName: admin.name, reason: args.reason || 'No reason provided' },
      createdAt: new Date().toISOString(),
    });

    return { success: true };
  },
});

export const unsuspendOrg = mutation({
  args: { firebaseUid: v.optional(v.string()), orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    const admin = await requirePlatformAdmin(ctx, args.firebaseUid);
    const org = await ctx.db.get(args.orgId);
    if (!org) throw new Error('Organization not found');

    await ctx.db.patch(args.orgId, { isDeleted: false, updatedAt: new Date().toISOString() });

    const events = await ctx.db.query('events').withIndex('by_orgId', (q) => q.eq('orgId', args.orgId)).collect();
    for (const event of events) {
      await ctx.db.patch(event._id, { isDeleted: false, updatedAt: new Date().toISOString() });
    }

    await ctx.db.insert('auditLogs', {
      orgId: args.orgId,
      userId: admin._id,
      action: 'platform.org.unsuspended',
      targetType: 'organization',
      targetId: args.orgId,
      metadata: { adminName: admin.name },
      createdAt: new Date().toISOString(),
    });

    return { success: true };
  },
});

export const verifyOrg = mutation({
  args: { firebaseUid: v.optional(v.string()), orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    const admin = await requirePlatformAdmin(ctx, args.firebaseUid);
    await ctx.db.patch(args.orgId, {
      isVerified: true,
      verificationStatus: 'verified',
      updatedAt: new Date().toISOString(),
    });
    await ctx.db.insert('auditLogs', {
      orgId: args.orgId,
      userId: admin._id,
      action: 'platform.org.verified',
      targetType: 'organization',
      targetId: args.orgId,
      metadata: { adminName: admin.name },
      createdAt: new Date().toISOString(),
    });
    return { success: true };
  },
});

export const unverifyOrg = mutation({
  args: { firebaseUid: v.optional(v.string()), orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    const admin = await requirePlatformAdmin(ctx, args.firebaseUid);
    await ctx.db.patch(args.orgId, {
      isVerified: false,
      verificationStatus: 'none',
      updatedAt: new Date().toISOString(),
    });
    await ctx.db.insert('auditLogs', {
      orgId: args.orgId,
      userId: admin._id,
      action: 'platform.org.unverified',
      targetType: 'organization',
      targetId: args.orgId,
      metadata: { adminName: admin.name },
      createdAt: new Date().toISOString(),
    });
    return { success: true };
  },
});

export const updateOrgPlan = mutation({
  args: {
    firebaseUid: v.optional(v.string()),
    orgId: v.id('organizations'),
    plan: v.union(v.literal('starter'), v.literal('professional'), v.literal('enterprise')),
  },
  handler: async (ctx, args) => {
    const admin = await requirePlatformAdmin(ctx, args.firebaseUid);
    const now = new Date().toISOString();
    const existingSub = await ctx.db
      .query('subscriptions')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .unique();

    if (existingSub) {
      await ctx.db.patch(existingSub._id, {
        plan: args.plan,
        status: 'active',
        monthlyPrice: args.plan === 'starter' ? 5000 : args.plan === 'professional' ? 15000 : 50000,
        storageLimit: args.plan === 'starter' ? 5 : args.plan === 'professional' ? 50 : 500,
        eventLimit: args.plan === 'starter' ? 3 : args.plan === 'professional' ? 20 : -1,
        teamMemberLimit: args.plan === 'starter' ? 3 : args.plan === 'professional' ? 15 : -1,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert('subscriptions', {
        orgId: args.orgId,
        plan: args.plan,
        status: 'active',
        currentPeriodStart: now,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        monthlyPrice: args.plan === 'starter' ? 5000 : args.plan === 'professional' ? 15000 : 50000,
        currency: 'NGN',
        storageLimit: args.plan === 'starter' ? 5 : args.plan === 'professional' ? 50 : 500,
        eventLimit: args.plan === 'starter' ? 3 : args.plan === 'professional' ? 20 : -1,
        teamMemberLimit: args.plan === 'starter' ? 3 : args.plan === 'professional' ? 15 : -1,
        createdAt: now,
        updatedAt: now,
      });
    }

    await ctx.db.insert('auditLogs', {
      orgId: args.orgId,
      userId: admin._id,
      action: 'platform.org.plan_updated',
      targetType: 'organization',
      targetId: args.orgId,
      metadata: { adminName: admin.name, plan: args.plan },
      createdAt: now,
    });

    return { success: true };
  },
});

export const suspendUser = mutation({
  args: { firebaseUid: v.optional(v.string()), targetUserId: v.id('users'), reason: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const admin = await requirePlatformAdmin(ctx, args.firebaseUid);
    const target = await ctx.db.get(args.targetUserId);
    if (!target) throw new Error('User not found');
    if (target.role === 'platform_admin') throw new Error('Cannot suspend a platform admin');

    await ctx.db.patch(args.targetUserId, { role: 'user' });

    const memberships = await ctx.db.query('organizationMembers').withIndex('by_userId', (q) => q.eq('userId', args.targetUserId)).collect();
    for (const m of memberships) {
      await ctx.db.delete(m._id);
    }

    const primaryOrg = await ctx.db.query('organizations').withIndex('by_ownerId', (q) => q.eq('ownerId', args.targetUserId)).first();
    if (primaryOrg) {
      await ctx.db.insert('auditLogs', {
        orgId: primaryOrg._id,
        userId: admin._id,
        action: 'platform.user.suspended',
        targetType: 'user',
        targetId: args.targetUserId,
        metadata: { adminName: admin.name, userName: target.name, reason: args.reason || '' },
        createdAt: new Date().toISOString(),
      });
    }

    return { success: true };
  },
});

export const featureEvent = mutation({
  args: { firebaseUid: v.optional(v.string()), eventId: v.id('events') },
  handler: async (ctx, args) => {
    const admin = await requirePlatformAdmin(ctx, args.firebaseUid);
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error('Event not found');

    await ctx.db.patch(args.eventId, { updatedAt: new Date().toISOString() });

    await ctx.db.insert('auditLogs', {
      orgId: event.orgId,
      userId: admin._id,
      action: 'platform.event.featured',
      targetType: 'event',
      targetId: args.eventId,
      metadata: { adminName: admin.name, eventTitle: event.title },
      createdAt: new Date().toISOString(),
    });

    return { success: true };
  },
});

export const deleteEvent = mutation({
  args: { firebaseUid: v.optional(v.string()), eventId: v.id('events') },
  handler: async (ctx, args) => {
    const admin = await requirePlatformAdmin(ctx, args.firebaseUid);
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error('Event not found');

    await ctx.db.patch(args.eventId, { isDeleted: true, updatedAt: new Date().toISOString() });

    await ctx.db.insert('auditLogs', {
      orgId: event.orgId,
      userId: admin._id,
      action: 'platform.event.deleted',
      targetType: 'event',
      targetId: args.eventId,
      metadata: { adminName: admin.name, eventTitle: event.title },
      createdAt: new Date().toISOString(),
    });

    return { success: true };
  },
});

export const approveVerification = mutation({
  args: { firebaseUid: v.optional(v.string()), requestId: v.id('verificationRequests') },
  handler: async (ctx, args) => {
    const admin = await requirePlatformAdmin(ctx, args.firebaseUid);
    const request = await ctx.db.get(args.requestId);
    if (!request) throw new Error('Verification request not found');

    await ctx.db.patch(args.requestId, {
      status: 'approved',
      reviewedBy: admin._id,
      reviewedAt: new Date().toISOString(),
    });

    await ctx.db.patch(request.orgId, {
      isVerified: true,
      verificationStatus: 'verified',
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  },
});

export const rejectVerification = mutation({
  args: { firebaseUid: v.optional(v.string()), requestId: v.id('verificationRequests'), notes: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const admin = await requirePlatformAdmin(ctx, args.firebaseUid);
    const request = await ctx.db.get(args.requestId);
    if (!request) throw new Error('Verification request not found');

    await ctx.db.patch(args.requestId, {
      status: 'rejected',
      reviewedBy: admin._id,
      reviewedAt: new Date().toISOString(),
      notes: args.notes,
    });

    return { success: true };
  },
});

export const sendPlatformNotification = mutation({
  args: {
    firebaseUid: v.optional(v.string()),
    userId: v.id('users'),
    title: v.string(),
    body: v.string(),
    link: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requirePlatformAdmin(ctx, args.firebaseUid);
    await ctx.db.insert('notifications', {
      userId: args.userId,
      type: 'admin_announcement',
      title: args.title,
      body: args.body,
      link: args.link,
      isRead: false,
      createdAt: new Date().toISOString(),
    });
    return { success: true };
  },
});

export const bulkApproveNominations = mutation({
  args: {
    firebaseUid: v.optional(v.string()),
    nominationIds: v.array(v.id('nominations')),
  },
  handler: async (ctx, args) => {
    const admin = await requirePlatformAdmin(ctx, args.firebaseUid);
    const now = new Date().toISOString();
    let count = 0;
    for (const id of args.nominationIds) {
      const nom = await ctx.db.get(id);
      if (nom && nom.status === 'pending') {
        await ctx.db.patch(id, { status: 'approved', reviewedBy: admin._id, reviewedAt: now, updatedAt: now });
        count++;
      }
    }
    return { success: true, approved: count };
  },
});

export const bulkRejectNominations = mutation({
  args: {
    firebaseUid: v.optional(v.string()),
    nominationIds: v.array(v.id('nominations')),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const admin = await requirePlatformAdmin(ctx, args.firebaseUid);
    const now = new Date().toISOString();
    let count = 0;
    for (const id of args.nominationIds) {
      const nom = await ctx.db.get(id);
      if (nom && nom.status === 'pending') {
        await ctx.db.patch(id, {
          status: 'rejected',
          reviewedBy: admin._id,
          reviewedAt: now,
          reviewNotes: args.reason,
          updatedAt: now,
        });
        count++;
      }
    }
    return { success: true, rejected: count };
  },
});

export const blockVote = mutation({
  args: { firebaseUid: v.optional(v.string()), voteId: v.id('votes') },
  handler: async (ctx, args) => {
    const admin = await requirePlatformAdmin(ctx, args.firebaseUid);
    const vote = await ctx.db.get(args.voteId);
    if (!vote) throw new Error('Vote not found');

    await ctx.db.delete(args.voteId);

    const nominee = await ctx.db.get(vote.nomineeId);
    if (nominee) {
      await ctx.db.patch(vote.nomineeId, { voteCount: Math.max(0, nominee.voteCount - vote.quantity) });
    }

    const event = await ctx.db.get(vote.eventId);
    if (event) {
      await ctx.db.patch(vote.eventId, { totalVotes: Math.max(0, event.totalVotes - vote.quantity) });
    }

    await ctx.db.insert('auditLogs', {
      orgId: vote.orgId,
      userId: admin._id,
      action: 'platform.vote.blocked',
      targetType: 'vote',
      targetId: args.voteId,
      metadata: { adminName: admin.name, nomineeId: vote.nomineeId, quantity: String(vote.quantity) },
      createdAt: new Date().toISOString(),
    });

    return { success: true };
  },
});

export const processPayout = mutation({
  args: { firebaseUid: v.optional(v.string()), transactionId: v.id('transactions') },
  handler: async (ctx, args) => {
    const admin = await requirePlatformAdmin(ctx, args.firebaseUid);
    const tx = await ctx.db.get(args.transactionId);
    if (!tx) throw new Error('Transaction not found');
    if (tx.type !== 'withdrawal' && tx.type !== 'payout') throw new Error('Not a payout transaction');
    if (tx.status !== 'pending') throw new Error('Transaction is not pending');

    await ctx.db.patch(args.transactionId, { status: 'completed' });

    await ctx.db.insert('auditLogs', {
      orgId: tx.orgId,
      userId: admin._id,
      action: 'platform.payout.approved',
      targetType: 'transaction',
      targetId: args.transactionId,
      metadata: { adminName: admin.name, amount: String(tx.amount) },
      createdAt: new Date().toISOString(),
    });

    return { success: true };
  },
});

export const rejectPayout = mutation({
  args: { firebaseUid: v.optional(v.string()), transactionId: v.id('transactions'), reason: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const admin = await requirePlatformAdmin(ctx, args.firebaseUid);
    const tx = await ctx.db.get(args.transactionId);
    if (!tx) throw new Error('Transaction not found');
    if (tx.status !== 'pending') throw new Error('Transaction is not pending');

    await ctx.db.patch(args.transactionId, { status: 'cancelled' });

    await ctx.db.insert('auditLogs', {
      orgId: tx.orgId,
      userId: admin._id,
      action: 'platform.payout.rejected',
      targetType: 'transaction',
      targetId: args.transactionId,
      metadata: { adminName: admin.name, reason: args.reason || '' },
      createdAt: new Date().toISOString(),
    });

    return { success: true };
  },
});
