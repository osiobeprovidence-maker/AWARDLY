/**
 * Feed Service
 * Wraps Convex queries/mutations for feed/social operations.
 */
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

// ─── Queries ────────────────────────────────────────────────────────────────

export function useOrgFeed(orgId: string | undefined, limit?: number) {
  return useQuery(
    api.feeds.queries.getByOrg,
    orgId ? { orgId: orgId as any, limit } : 'skip'
  );
}

export function useFeedPost(postId: string | undefined) {
  return useQuery(api.feeds.queries.getById, postId ? { postId: postId as any } : 'skip');
}

export function usePostComments(postId: string | undefined) {
  return useQuery(api.feeds.queries.getComments, postId ? { postId: postId as any } : 'skip');
}

export function useIsLiked(userId: string | undefined, targetType: string, targetId: string | undefined) {
  return useQuery(
    api.feeds.queries.isLiked,
    userId && targetId ? { userId: userId as any, targetType: targetType as any, targetId } : 'skip'
  );
}

export function useIsBookmarked(userId: string | undefined, targetType: string, targetId: string | undefined) {
  return useQuery(
    api.feeds.queries.isBookmarked,
    userId && targetId ? { userId: userId as any, targetType: targetType as any, targetId } : 'skip'
  );
}

// ─── Mutations ──────────────────────────────────────────────────────────────

export function useCreatePost() {
  return useMutation(api.feeds.mutations.createPost);
}

export function useDeletePost() {
  return useMutation(api.feeds.mutations.deletePost);
}

export function useAddComment() {
  return useMutation(api.feeds.mutations.addComment);
}

export function useToggleLike() {
  return useMutation(api.feeds.mutations.toggleLike);
}

export function useToggleBookmark() {
  return useMutation(api.feeds.mutations.toggleBookmark);
}

export function useTogglePin() {
  return useMutation(api.feeds.mutations.togglePin);
}
