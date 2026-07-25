/**
 * Event Service
 * Wraps Convex queries/mutations for event operations.
 */
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

// ─── Queries ────────────────────────────────────────────────────────────────

export function useEventById(eventId: string | undefined) {
  return useQuery(api.events.queries.getById, eventId ? { eventId: eventId as any } : 'skip');
}

export function useEventBySlug(slug: string) {
  return useQuery(api.events.queries.getBySlug, { slug });
}

export function useEventsByOrg(orgId: string | undefined) {
  return useQuery(api.events.queries.getByOrg, orgId ? { orgId: orgId as any } : 'skip');
}

export function usePublishedEvents() {
  return useQuery(api.events.queries.getPublished);
}

export function useLiveEvents() {
  return useQuery(api.events.queries.getLive);
}

export function useEventWithOrg(eventId: string | undefined) {
  return useQuery(api.events.queries.getWithOrg, eventId ? { eventId: eventId as any } : 'skip');
}

// ─── Mutations ──────────────────────────────────────────────────────────────

export function useCreateEvent() {
  return useMutation(api.events.mutations.create);
}

export function useUpdateEvent() {
  return useMutation(api.events.mutations.update);
}

export function usePublishEvent() {
  return useMutation(api.events.mutations.publish);
}

export function useGoLiveEvent() {
  return useMutation(api.events.mutations.goLive);
}

export function useCloseEvent() {
  return useMutation(api.events.mutations.close);
}

export function useDeleteEvent() {
  return useMutation(api.events.mutations.softDelete);
}

export function useToggleVoting() {
  return useMutation(api.events.mutations.toggleVoting);
}

export function useIncrementEventViews() {
  return useMutation(api.events.mutations.incrementViewCount);
}
