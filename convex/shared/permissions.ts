import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// ─── Role Permissions Matrix ────────────────────────────────────────────────
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

export function hasPermission(role: string, permission: string): boolean {
  return ROLE_PERMISSIONS[role]?.[permission] ?? false;
}

export function getRolePermissions(role: string): Record<string, boolean> {
  return ROLE_PERMISSIONS[role] ?? ROLE_PERMISSIONS.viewer;
}

export const ALL_ROLES = Object.keys(ROLE_PERMISSIONS);

export const ROLE_LABELS: Record<string, string> = {
  owner: 'Owner',
  admin: 'Administrator',
  event_manager: 'Event Manager',
  judge: 'Judge',
  moderator: 'Moderator',
  finance: 'Finance',
  content_editor: 'Content Editor',
  viewer: 'Viewer',
};
