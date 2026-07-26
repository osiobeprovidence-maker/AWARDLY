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
import type * as crons from "../crons.js";
import type * as events_mutations from "../events/mutations.js";
import type * as events_queries from "../events/queries.js";
import type * as feeds_mutations from "../feeds/mutations.js";
import type * as feeds_queries from "../feeds/queries.js";
import type * as feeds_scheduled from "../feeds/scheduled.js";
import type * as followers_mutations from "../followers/mutations.js";
import type * as followers_queries from "../followers/queries.js";
import type * as http from "../http.js";
import type * as judgeScores_mutations from "../judgeScores/mutations.js";
import type * as judgeScores_queries from "../judgeScores/queries.js";
import type * as judges_mutations from "../judges/mutations.js";
import type * as judges_queries from "../judges/queries.js";
import type * as likes_mutations from "../likes/mutations.js";
import type * as likes_queries from "../likes/queries.js";
import type * as liveAnalytics_mutations from "../liveAnalytics/mutations.js";
import type * as liveAnalytics_queries from "../liveAnalytics/queries.js";
import type * as liveChat_mutations from "../liveChat/mutations.js";
import type * as liveChat_queries from "../liveChat/queries.js";
import type * as liveReactions_mutations from "../liveReactions/mutations.js";
import type * as liveReactions_queries from "../liveReactions/queries.js";
import type * as mediaFiles_mutations from "../mediaFiles/mutations.js";
import type * as mediaFiles_queries from "../mediaFiles/queries.js";
import type * as mediaFolders_mutations from "../mediaFolders/mutations.js";
import type * as mediaFolders_queries from "../mediaFolders/queries.js";
import type * as mediaShares_mutations from "../mediaShares/mutations.js";
import type * as mediaShares_queries from "../mediaShares/queries.js";
import type * as moderations_mutations from "../moderations/mutations.js";
import type * as moderations_queries from "../moderations/queries.js";
import type * as nominations_mutations from "../nominations/mutations.js";
import type * as nominations_queries from "../nominations/queries.js";
import type * as nominees_mutations from "../nominees/mutations.js";
import type * as nominees_queries from "../nominees/queries.js";
import type * as notifications_mutations from "../notifications/mutations.js";
import type * as notifications_queries from "../notifications/queries.js";
import type * as organizationMembers_mutations from "../organizationMembers/mutations.js";
import type * as organizationMembers_queries from "../organizationMembers/queries.js";
import type * as organizations_mutations from "../organizations/mutations.js";
import type * as organizations_queries from "../organizations/queries.js";
import type * as payoutAccounts_mutations from "../payoutAccounts/mutations.js";
import type * as payoutAccounts_queries from "../payoutAccounts/queries.js";
import type * as portfolio_mutations from "../portfolio/mutations.js";
import type * as portfolio_queries from "../portfolio/queries.js";
import type * as seed from "../seed.js";
import type * as shared_helpers from "../shared/helpers.js";
import type * as shared_permissions from "../shared/permissions.js";
import type * as sponsors_mutations from "../sponsors/mutations.js";
import type * as sponsors_queries from "../sponsors/queries.js";
import type * as storage_mutations from "../storage/mutations.js";
import type * as storage_queries from "../storage/queries.js";
import type * as subscriptions_mutations from "../subscriptions/mutations.js";
import type * as subscriptions_queries from "../subscriptions/queries.js";
import type * as ticketing_mutations from "../ticketing/mutations.js";
import type * as transactions_mutations from "../transactions/mutations.js";
import type * as transactions_queries from "../transactions/queries.js";
import type * as userFollows_mutations from "../userFollows/mutations.js";
import type * as userFollows_queries from "../userFollows/queries.js";
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
  crons: typeof crons;
  "events/mutations": typeof events_mutations;
  "events/queries": typeof events_queries;
  "feeds/mutations": typeof feeds_mutations;
  "feeds/queries": typeof feeds_queries;
  "feeds/scheduled": typeof feeds_scheduled;
  "followers/mutations": typeof followers_mutations;
  "followers/queries": typeof followers_queries;
  http: typeof http;
  "judgeScores/mutations": typeof judgeScores_mutations;
  "judgeScores/queries": typeof judgeScores_queries;
  "judges/mutations": typeof judges_mutations;
  "judges/queries": typeof judges_queries;
  "likes/mutations": typeof likes_mutations;
  "likes/queries": typeof likes_queries;
  "liveAnalytics/mutations": typeof liveAnalytics_mutations;
  "liveAnalytics/queries": typeof liveAnalytics_queries;
  "liveChat/mutations": typeof liveChat_mutations;
  "liveChat/queries": typeof liveChat_queries;
  "liveReactions/mutations": typeof liveReactions_mutations;
  "liveReactions/queries": typeof liveReactions_queries;
  "mediaFiles/mutations": typeof mediaFiles_mutations;
  "mediaFiles/queries": typeof mediaFiles_queries;
  "mediaFolders/mutations": typeof mediaFolders_mutations;
  "mediaFolders/queries": typeof mediaFolders_queries;
  "mediaShares/mutations": typeof mediaShares_mutations;
  "mediaShares/queries": typeof mediaShares_queries;
  "moderations/mutations": typeof moderations_mutations;
  "moderations/queries": typeof moderations_queries;
  "nominations/mutations": typeof nominations_mutations;
  "nominations/queries": typeof nominations_queries;
  "nominees/mutations": typeof nominees_mutations;
  "nominees/queries": typeof nominees_queries;
  "notifications/mutations": typeof notifications_mutations;
  "notifications/queries": typeof notifications_queries;
  "organizationMembers/mutations": typeof organizationMembers_mutations;
  "organizationMembers/queries": typeof organizationMembers_queries;
  "organizations/mutations": typeof organizations_mutations;
  "organizations/queries": typeof organizations_queries;
  "payoutAccounts/mutations": typeof payoutAccounts_mutations;
  "payoutAccounts/queries": typeof payoutAccounts_queries;
  "portfolio/mutations": typeof portfolio_mutations;
  "portfolio/queries": typeof portfolio_queries;
  seed: typeof seed;
  "shared/helpers": typeof shared_helpers;
  "shared/permissions": typeof shared_permissions;
  "sponsors/mutations": typeof sponsors_mutations;
  "sponsors/queries": typeof sponsors_queries;
  "storage/mutations": typeof storage_mutations;
  "storage/queries": typeof storage_queries;
  "subscriptions/mutations": typeof subscriptions_mutations;
  "subscriptions/queries": typeof subscriptions_queries;
  "ticketing/mutations": typeof ticketing_mutations;
  "transactions/mutations": typeof transactions_mutations;
  "transactions/queries": typeof transactions_queries;
  "userFollows/mutations": typeof userFollows_mutations;
  "userFollows/queries": typeof userFollows_queries;
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
