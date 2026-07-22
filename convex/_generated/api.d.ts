/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as analytics_mutations from "../analytics/mutations.js";
import type * as analytics_queries from "../analytics/queries.js";
import type * as bookmarks_mutations from "../bookmarks/mutations.js";
import type * as bookmarks_queries from "../bookmarks/queries.js";
import type * as broadcasts_mutations from "../broadcasts/mutations.js";
import type * as broadcasts_queries from "../broadcasts/queries.js";
import type * as categories_mutations from "../categories/mutations.js";
import type * as categories_queries from "../categories/queries.js";
import type * as comments_mutations from "../comments/mutations.js";
import type * as comments_queries from "../comments/queries.js";
import type * as events_mutations from "../events/mutations.js";
import type * as events_queries from "../events/queries.js";
import type * as feeds_mutations from "../feeds/mutations.js";
import type * as feeds_queries from "../feeds/queries.js";
import type * as followers_mutations from "../followers/mutations.js";
import type * as followers_queries from "../followers/queries.js";
import type * as http from "../http.js";
import type * as likes_mutations from "../likes/mutations.js";
import type * as likes_queries from "../likes/queries.js";
import type * as nominees_mutations from "../nominees/mutations.js";
import type * as nominees_queries from "../nominees/queries.js";
import type * as notifications_mutations from "../notifications/mutations.js";
import type * as notifications_queries from "../notifications/queries.js";
import type * as organizationMembers_mutations from "../organizationMembers/mutations.js";
import type * as organizationMembers_queries from "../organizationMembers/queries.js";
import type * as organizations_mutations from "../organizations/mutations.js";
import type * as organizations_queries from "../organizations/queries.js";
import type * as shared_helpers from "../shared/helpers.js";
import type * as shared_permissions from "../shared/permissions.js";
import type * as storage_mutations from "../storage/mutations.js";
import type * as storage_queries from "../storage/queries.js";
import type * as users_mutations from "../users/mutations.js";
import type * as users_queries from "../users/queries.js";
import type * as votes_mutations from "../votes/mutations.js";
import type * as votes_queries from "../votes/queries.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "analytics/mutations": typeof analytics_mutations;
  "analytics/queries": typeof analytics_queries;
  "bookmarks/mutations": typeof bookmarks_mutations;
  "bookmarks/queries": typeof bookmarks_queries;
  "broadcasts/mutations": typeof broadcasts_mutations;
  "broadcasts/queries": typeof broadcasts_queries;
  "categories/mutations": typeof categories_mutations;
  "categories/queries": typeof categories_queries;
  "comments/mutations": typeof comments_mutations;
  "comments/queries": typeof comments_queries;
  "events/mutations": typeof events_mutations;
  "events/queries": typeof events_queries;
  "feeds/mutations": typeof feeds_mutations;
  "feeds/queries": typeof feeds_queries;
  "followers/mutations": typeof followers_mutations;
  "followers/queries": typeof followers_queries;
  http: typeof http;
  "likes/mutations": typeof likes_mutations;
  "likes/queries": typeof likes_queries;
  "nominees/mutations": typeof nominees_mutations;
  "nominees/queries": typeof nominees_queries;
  "notifications/mutations": typeof notifications_mutations;
  "notifications/queries": typeof notifications_queries;
  "organizationMembers/mutations": typeof organizationMembers_mutations;
  "organizationMembers/queries": typeof organizationMembers_queries;
  "organizations/mutations": typeof organizations_mutations;
  "organizations/queries": typeof organizations_queries;
  "shared/helpers": typeof shared_helpers;
  "shared/permissions": typeof shared_permissions;
  "storage/mutations": typeof storage_mutations;
  "storage/queries": typeof storage_queries;
  "users/mutations": typeof users_mutations;
  "users/queries": typeof users_queries;
  "votes/mutations": typeof votes_mutations;
  "votes/queries": typeof votes_queries;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
