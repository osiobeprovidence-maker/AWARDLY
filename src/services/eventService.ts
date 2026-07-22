/**
 * Event Service
 * Wraps Convex queries/mutations for event operations.
 */
import { useQuery, useMutation } from 'convex/react';

// ─── Queries ────────────────────────────────────────────────────────────────

export function useEventById(eventId: string | undefined) {
  return useQuery('events:getById', eventId ? { eventId: eventId as any } : 'skip');
}

export function useEventBySlug(slug: string) {
  return useQuery('events:getBySlug', { slug });
}

export function useEventsByOrg(orgId: string | undefined) {
  return useQuery('events:getByOrg', orgId ? { orgId: orgId as any } : 'skip');
}

export function usePublishedEvents() {
  return useQuery('events:getPublished');
}

export function useLiveEvents() {
  return useQuery('events:getLive');
}

export function useEventWithOrg(eventId: string | undefined) {
  return useQuery('events:getWithOrg', eventId ? { eventId: eventId as any } : 'skip');
}

// ─── Mutations ──────────────────────────────────────────────────────────────

export function useCreateEvent() {
  return useMutation('events:create');
}

export function useUpdateEvent() {
  return useMutation('events:update');
}

export function usePublishEvent() {
  return useMutation('events:publish');
}

export function useGoLiveEvent() {
  return useMutation('events:goLive');
}

export function useCloseEvent() {
  return useMutation('events:close');
}

export function useDeleteEvent() {
  return useMutation('events:softDelete');
}

export function useToggleVoting() {
  return useMutation('events:toggleVoting');
}

export function useIncrementEventViews() {
  return useMutation('events:incrementViewCount');
}
