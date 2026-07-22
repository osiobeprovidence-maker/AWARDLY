import { QueryCtx, MutationCtx } from '../_generated/server';
import { Id } from '../_generated/dataModel';

/**
 * Get the current authenticated user from Convex by Firebase UID.
 * Throws if not authenticated or user not found.
 */
export async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error('Not authenticated');
  }

  const user = await ctx.db
    .query('users')
    .withIndex('by_firebaseUid', (q) => q.eq('firebaseUid', identity.subject))
    .unique();

  if (!user) {
    throw new Error('User not found in database');
  }

  return user;
}

/**
 * Get the current user or return null if not authenticated.
 */
export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  const user = await ctx.db
    .query('users')
    .withIndex('by_firebaseUid', (q) => q.eq('firebaseUid', identity.subject))
    .unique();

  return user ?? null;
}

/**
 * Get a user's membership in an organization.
 */
export async function getOrgMembership(
  ctx: QueryCtx | MutationCtx,
  userId: Id<'users'>,
  orgId: Id<'organizations'>
) {
  return await ctx.db
    .query('organizationMembers')
    .withIndex('by_orgId_userId', (q) => q.eq('orgId', orgId).eq('userId', userId))
    .unique();
}

/**
 * Check if a user has a specific permission in an organization.
 */
export async function checkPermission(
  ctx: QueryCtx | MutationCtx,
  userId: Id<'users'>,
  orgId: Id<'organizations'>,
  permission: string
): Promise<boolean> {
  const membership = await getOrgMembership(ctx, userId, orgId);
  if (!membership) return false;

  const ROLE_PERMISSIONS: Record<string, Record<string, boolean>> = {
    owner: {
      manageOrg: true, manageEvents: true, manageCategories: true, manageVoting: true,
      manageTeam: true, manageBilling: true, manageBranding: true, viewAnalytics: true,
      broadcast: true, moderateContent: true, manageJudges: true,
    },
    admin: {
      manageOrg: true, manageEvents: true, manageCategories: true, manageVoting: true,
      manageTeam: true, manageBilling: false, manageBranding: true, viewAnalytics: true,
      broadcast: true, moderateContent: true, manageJudges: true,
    },
    event_manager: {
      manageOrg: false, manageEvents: true, manageCategories: true, manageVoting: true,
      manageTeam: false, manageBilling: false, manageBranding: false, viewAnalytics: true,
      broadcast: false, moderateContent: false, manageJudges: false,
    },
    judge: {
      manageOrg: false, manageEvents: false, manageCategories: false, manageVoting: true,
      manageTeam: false, manageBilling: false, manageBranding: false, viewAnalytics: false,
      broadcast: false, moderateContent: false, manageJudges: false,
    },
    moderator: {
      manageOrg: false, manageEvents: false, manageCategories: false, manageVoting: false,
      manageTeam: false, manageBilling: false, manageBranding: false, viewAnalytics: false,
      broadcast: false, moderateContent: true, manageJudges: false,
    },
    finance: {
      manageOrg: false, manageEvents: false, manageCategories: false, manageVoting: false,
      manageTeam: false, manageBilling: true, manageBranding: false, viewAnalytics: true,
      broadcast: false, moderateContent: false, manageJudges: false,
    },
    content_editor: {
      manageOrg: false, manageEvents: false, manageCategories: false, manageVoting: false,
      manageTeam: false, manageBilling: false, manageBranding: true, viewAnalytics: false,
      broadcast: false, moderateContent: true, manageJudges: false,
    },
    viewer: {
      manageOrg: false, manageEvents: false, manageCategories: false, manageVoting: false,
      manageTeam: false, manageBilling: false, manageBranding: false, viewAnalytics: false,
      broadcast: false, moderateContent: false, manageJudges: false,
    },
  };

  return ROLE_PERMISSIONS[membership.role]?.[permission] ?? false;
}

/**
 * Assert that a user has a specific permission. Throws if not.
 */
export async function requirePermission(
  ctx: MutationCtx,
  userId: Id<'users'>,
  orgId: Id<'organizations'>,
  permission: string
): Promise<void> {
  const has = await checkPermission(ctx, userId, orgId, permission);
  if (!has) {
    throw new Error(`Permission denied: requires "${permission}"`);
  }
}

/**
 * Assert that a user is the owner of an organization.
 */
export async function requireOwner(
  ctx: MutationCtx,
  userId: Id<'users'>,
  orgId: Id<'organizations'>
): Promise<void> {
  const membership = await getOrgMembership(ctx, userId, orgId);
  if (!membership || membership.role !== 'owner') {
    throw new Error('Permission denied: requires owner role');
  }
}

/**
 * Log an audit event.
 */
export async function logAudit(
  ctx: MutationCtx,
  orgId: Id<'organizations'>,
  userId: Id<'users'>,
  action: string,
  targetType: string,
  targetId: string,
  metadata?: Record<string, string>
) {
  await ctx.db.insert('auditLogs', {
    orgId,
    userId,
    action,
    targetType,
    targetId,
    metadata,
    createdAt: new Date().toISOString(),
  });
}

/**
 * Create a notification for a user.
 */
export async function createNotification(
  ctx: MutationCtx,
  userId: Id<'users'>,
  type: 'vote' | 'comment' | 'mention' | 'org_invite' | 'event_reminder' |
        'broadcast_starting' | 'judge_invite' | 'admin_announcement' | 'follow' |
        'nomination' | 'verification',
  title: string,
  body: string,
  link?: string,
  orgId?: Id<'organizations'>,
  eventId?: Id<'events'>
) {
  await ctx.db.insert('notifications', {
    userId,
    type,
    title,
    body,
    link,
    orgId,
    eventId,
    isRead: false,
    createdAt: new Date().toISOString(),
  });
}
