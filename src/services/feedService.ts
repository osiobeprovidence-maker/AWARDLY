/**
 * Feed Service
 * Wraps Convex queries/mutations for feed/social operations.
 */
import { useQuery, useMutation } from 'convex/react';

// ─── Queries ────────────────────────────────────────────────────────────────

export function useOrgFeed(orgId: string | undefined, limit?: number) {
  return useQuery(
    'feeds:getByOrg',
    orgId ? { orgId: orgId as any, limit } : 'skip'
  );
}

export function useFeedPost(postId: string | undefined) {
  return useQuery('feeds:getById', postId ? { postId: postId as any } : 'skip');
}

export function usePostComments(postId: string | undefined) {
  return useQuery('feeds:getComments', postId ? { postId: postId as any } : 'skip');
}

export function useIsLiked(userId: string | undefined, targetType: string, targetId: string | undefined) {
  return useQuery(
    'feeds:isLiked',
    userId && targetId ? { userId: userId as any, targetType: targetType as any, targetId } : 'skip'
  );
}

export function useIsBookmarked(userId: string | undefined, targetType: string, targetId: string | undefined) {
  return useQuery(
    'feeds:isBookmarked',
    userId && targetId ? { userId: userId as any, targetType: targetType as any, targetId } : 'skip'
  );
}

// ─── Mutations ──────────────────────────────────────────────────────────────

export function useCreatePost() {
  return useMutation('feeds:createPost');
}

export function useDeletePost() {
  return useMutation('feeds:deletePost');
}

export function useAddComment() {
  return useMutation('feeds:addComment');
}

export function useToggleLike() {
  return useMutation('feeds:toggleLike');
}

export function useToggleBookmark() {
  return useMutation('feeds:toggleBookmark');
}

export function useTogglePin() {
  return useMutation('feeds:togglePin');
}
