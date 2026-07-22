/**
 * Organization Service
 * Wraps Convex queries/mutations for organization operations.
 * Pages should import from here, not directly from Convex.
 */
import { useQuery, useMutation } from 'convex/react';

// ─── Queries ────────────────────────────────────────────────────────────────

export function useOrgBySlug(slug: string) {
  return useQuery('organizations:getBySlug', { slug });
}

export function useOrgById(orgId: string | undefined) {
  return useQuery('organizations:getById', orgId ? { orgId: orgId as any } : 'skip');
}

export function useOrgsByOwner(ownerId: string | undefined) {
  return useQuery('organizations:getByOwner', ownerId ? { ownerId: ownerId as any } : 'skip');
}

export function useOrgSearch(query: string) {
  return useQuery('organizations:search', { query });
}

export function useOrgPublicProfile(slug: string) {
  return useQuery('organizations:getPublicProfile', { slug });
}

// ─── Mutations ──────────────────────────────────────────────────────────────

export function useCreateOrg() {
  return useMutation('organizations:create');
}

export function useUpdateOrg() {
  return useMutation('organizations:update');
}

export function useUpdateOrgBranding() {
  return useMutation('organizations:updateBranding');
}

export function useUpdateOrgSocialLinks() {
  return useMutation('organizations:updateSocialLinks');
}

export function useDeleteOrg() {
  return useMutation('organizations:softDelete');
}
