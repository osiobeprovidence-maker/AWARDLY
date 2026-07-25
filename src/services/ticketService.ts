import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

export function useCeremonyByEvent(eventId: Id<'events'> | undefined) {
  return useQuery(
    api.ticketing.mutations.getCeremonyByEvent,
    eventId ? { eventId } : 'skip'
  );
}

export function useTicketingByEvent(eventId: Id<'events'> | undefined) {
  return useQuery(
    api.ticketing.mutations.getTicketingByEvent,
    eventId ? { eventId } : 'skip'
  );
}

export function useCeremonyOverview(eventId: Id<'events'> | undefined) {
  return useQuery(
    api.ticketing.mutations.getCeremonyOverview,
    eventId ? { eventId } : 'skip'
  );
}

export function useUpdateCeremony() {
  return useMutation(api.ticketing.mutations.updateCeremony);
}

export function useConnectTicketEvent() {
  return useMutation(api.ticketing.mutations.connectTicketEvent);
}

export function useDisconnectTicketEvent() {
  return useMutation(api.ticketing.mutations.disconnectTicketEvent);
}

export function useUpdateTicketStatus() {
  return useMutation(api.ticketing.mutations.updateTicketStatus);
}
