/**
 * Vote Service
 * Wraps Convex queries/mutations for voting operations.
 */
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

// ─── Queries ────────────────────────────────────────────────────────────────

export function useVotesForNominee(nomineeId: string | undefined) {
  return useQuery(api.votes.queries.getVotesForNominee, nomineeId ? { nomineeId: nomineeId as any } : 'skip');
}

export function useVotesForEvent(eventId: string | undefined) {
  return useQuery(api.votes.queries.getVotesForEvent, eventId ? { eventId: eventId as any } : 'skip');
}

export function useUserVotesForEvent(userId: string | undefined, eventId: string | undefined) {
  return useQuery(
    api.votes.queries.getUserVotesForEvent,
    userId && eventId ? { userId: userId as any, eventId: eventId as any } : 'skip'
  );
}

export function useLeaderboard(eventId: string | undefined, categoryId: string | undefined) {
  return useQuery(
    api.votes.queries.getLeaderboard,
    eventId && categoryId ? { eventId: eventId as any, categoryId: categoryId as any } : 'skip'
  );
}

// ─── Mutations ──────────────────────────────────────────────────────────────

export function useCastVote() {
  return useMutation(api.votes.mutations.castVote);
}

export function useRefundVotes() {
  return useMutation(api.votes.mutations.refundVotes);
}
