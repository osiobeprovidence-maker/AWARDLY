import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // ─── Users ──────────────────────────────────────────────────────────────
  users: defineTable({
    firebaseUid: v.string(),
    email: v.string(),
    name: v.string(),
    avatarUrl: v.optional(v.string()),
    role: v.union(v.literal('user'), v.literal('admin'), v.literal('platform_admin')),
    lastLoginAt: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index('by_firebaseUid', ['firebaseUid'])
    .index('by_email', ['email']),

  // ─── Organizations ──────────────────────────────────────────────────────
  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    type: v.union(
      v.literal('company'), v.literal('government'), v.literal('nonprofit'),
      v.literal('university'), v.literal('community'), v.literal('media'),
      v.literal('individual'), v.literal('other'),
    ),
    ownerId: v.id('users'),
    logoUrl: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    primaryColor: v.string(),
    secondaryColor: v.string(),
    website: v.optional(v.string()),
    country: v.string(),
    headquarters: v.optional(v.string()),
    foundedYear: v.optional(v.number()),
    contactEmail: v.string(),
    phone: v.optional(v.string()),
    socialLinks: v.optional(v.object({
      facebook: v.optional(v.string()),
      twitter: v.optional(v.string()),
      instagram: v.optional(v.string()),
      linkedin: v.optional(v.string()),
      youtube: v.optional(v.string()),
      tiktok: v.optional(v.string()),
    })),
    isVerified: v.boolean(),
    verificationStatus: v.union(v.literal('none'), v.literal('pending'), v.literal('verified')),
    followerCount: v.number(),
    memberCount: v.number(),
    eventCount: v.number(),
    isDeleted: v.boolean(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_slug', ['slug'])
    .index('by_ownerId', ['ownerId'])
    .index('by_type', ['type'])
    .index('by_isDeleted', ['isDeleted']),

  // ─── Organization Members ───────────────────────────────────────────────
  organizationMembers: defineTable({
    orgId: v.id('organizations'),
    userId: v.id('users'),
    role: v.union(
      v.literal('owner'), v.literal('admin'), v.literal('event_manager'),
      v.literal('judge'), v.literal('moderator'), v.literal('finance'),
      v.literal('content_editor'), v.literal('viewer'),
    ),
    invitedBy: v.optional(v.id('users')),
    joinedAt: v.string(),
  })
    .index('by_orgId', ['orgId'])
    .index('by_userId', ['userId'])
    .index('by_orgId_userId', ['orgId', 'userId'])
    .index('by_role', ['role']),

  // ─── Events ─────────────────────────────────────────────────────────────
  events: defineTable({
    orgId: v.id('organizations'),
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    date: v.string(),
    time: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    bannerUrl: v.optional(v.string()),
    venue: v.optional(v.string()),
    theme: v.optional(v.string()),
    tagline: v.optional(v.string()),
    themeColor: v.optional(v.string()),
    timezone: v.optional(v.string()),
    status: v.union(v.literal('draft'), v.literal('published'), v.literal('live'), v.literal('closed'), v.literal('archived')),
    isVotingActive: v.boolean(),
    votingType: v.optional(v.union(v.literal('public'), v.literal('member'), v.literal('judge'), v.literal('both'))),
    nominationStart: v.optional(v.string()),
    nominationEnd: v.optional(v.string()),
    votingStart: v.optional(v.string()),
    votingEnd: v.optional(v.string()),
    youtubeVideoId: v.optional(v.string()),
    muxPlaybackId: v.optional(v.string()),
    categoryCount: v.number(),
    nomineeCount: v.number(),
    totalVotes: v.number(),
    viewCount: v.number(),
    isDeleted: v.boolean(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_orgId', ['orgId'])
    .index('by_slug', ['slug'])
    .index('by_status', ['status'])
    .index('by_orgId_status', ['orgId', 'status'])
    .index('by_isDeleted', ['isDeleted']),

  // ─── Categories ─────────────────────────────────────────────────────────
  categories: defineTable({
    eventId: v.id('events'),
    orgId: v.id('organizations'),
    name: v.string(),
    description: v.optional(v.string()),
    rulesSource: v.union(v.literal('global'), v.literal('custom')),
    customRules: v.optional(v.object({
      title: v.string(),
      description: v.string(),
      eligibility: v.string(),
      dailyLimit: v.number(),
      isPaid: v.boolean(),
      verificationRequired: v.boolean(),
      duplicatePolicy: v.string(),
      fraudPrevention: v.string(),
      startDate: v.string(),
      endDate: v.string(),
      terms: v.string(),
      notes: v.optional(v.string()),
    })),
    nomineeCount: v.number(),
    totalVotes: v.number(),
    isDeleted: v.boolean(),
    createdAt: v.string(),
  })
    .index('by_eventId', ['eventId'])
    .index('by_orgId', ['orgId'])
    .index('by_eventId_isDeleted', ['eventId', 'isDeleted']),

  // ─── Nominees ───────────────────────────────────────────────────────────
  nominees: defineTable({
    categoryId: v.id('categories'),
    eventId: v.id('events'),
    orgId: v.id('organizations'),
    name: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    voteCount: v.number(),
    isDeleted: v.boolean(),
    createdAt: v.string(),
  })
    .index('by_categoryId', ['categoryId'])
    .index('by_eventId', ['eventId'])
    .index('by_orgId', ['orgId'])
    .index('by_categoryId_isDeleted', ['categoryId', 'isDeleted']),

  // ─── Votes ──────────────────────────────────────────────────────────────
  votes: defineTable({
    userId: v.id('users'),
    eventId: v.id('events'),
    categoryId: v.id('categories'),
    nomineeId: v.id('nominees'),
    orgId: v.id('organizations'),
    quantity: v.number(),
    isPaid: v.boolean(),
    paymentReference: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index('by_userId', ['userId'])
    .index('by_eventId', ['eventId'])
    .index('by_nomineeId', ['nomineeId'])
    .index('by_categoryId', ['categoryId'])
    .index('by_userId_eventId', ['userId', 'eventId'])
    .index('by_userId_eventId_categoryId', ['userId', 'eventId', 'categoryId']),

  // ─── Judges ─────────────────────────────────────────────────────────────
  judges: defineTable({
    userId: v.id('users'),
    eventId: v.id('events'),
    orgId: v.id('organizations'),
    categoryIds: v.array(v.id('categories')),
    status: v.union(v.literal('invited'), v.literal('accepted'), v.literal('declined'), v.literal('completed')),
    invitedAt: v.string(),
    completedAt: v.optional(v.string()),
  })
    .index('by_userId', ['userId'])
    .index('by_eventId', ['eventId'])
    .index('by_userId_eventId', ['userId', 'eventId']),

  // ─── Broadcasts ─────────────────────────────────────────────────────────
  broadcasts: defineTable({
    eventId: v.id('events'),
    orgId: v.id('organizations'),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal('scheduled'), v.literal('live'), v.literal('ended'), v.literal('failed')),
    muxStreamId: v.optional(v.string()),
    muxPlaybackId: v.optional(v.string()),
    muxAssetId: v.optional(v.string()),
    youtubeVideoId: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    startedAt: v.optional(v.string()),
    endedAt: v.optional(v.string()),
    duration: v.optional(v.number()),
    viewerCount: v.number(),
    peakViewerCount: v.number(),
    createdAt: v.string(),
  })
    .index('by_eventId', ['eventId'])
    .index('by_orgId', ['orgId'])
    .index('by_status', ['status']),

  // ─── Feed Posts ─────────────────────────────────────────────────────────
  feedPosts: defineTable({
    orgId: v.id('organizations'),
    authorId: v.id('users'),
    eventId: v.optional(v.id('events')),
    content: v.string(),
    mediaUrls: v.optional(v.array(v.string())),
    mediaType: v.optional(v.union(v.literal('image'), v.literal('video'), v.literal('poll'))),
    pollOptions: v.optional(v.array(v.object({
      label: v.string(),
      votes: v.number(),
    }))),
    likesCount: v.number(),
    commentsCount: v.number(),
    sharesCount: v.number(),
    bookmarksCount: v.number(),
    isPinned: v.boolean(),
    isDeleted: v.boolean(),
    createdAt: v.string(),
  })
    .index('by_orgId', ['orgId'])
    .index('by_authorId', ['authorId'])
    .index('by_eventId', ['eventId'])
    .index('by_orgId_createdAt', ['orgId', 'createdAt']),

  // ─── Comments ───────────────────────────────────────────────────────────
  comments: defineTable({
    postId: v.id('feedPosts'),
    authorId: v.id('users'),
    content: v.string(),
    parentCommentId: v.optional(v.id('comments')),
    likesCount: v.number(),
    isDeleted: v.boolean(),
    createdAt: v.string(),
  })
    .index('by_postId', ['postId'])
    .index('by_authorId', ['authorId'])
    .index('by_parentCommentId', ['parentCommentId']),

  // ─── Likes ──────────────────────────────────────────────────────────────
  likes: defineTable({
    userId: v.id('users'),
    targetType: v.union(v.literal('post'), v.literal('comment'), v.literal('nominee')),
    targetId: v.string(),
    createdAt: v.string(),
  })
    .index('by_userId', ['userId'])
    .index('by_targetType_targetId', ['targetType', 'targetId'])
    .index('by_userId_targetType_targetId', ['userId', 'targetType', 'targetId']),

  // ─── Bookmarks ──────────────────────────────────────────────────────────
  bookmarks: defineTable({
    userId: v.id('users'),
    targetType: v.union(v.literal('event'), v.literal('post'), v.literal('nominee')),
    targetId: v.string(),
    createdAt: v.string(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_targetType', ['userId', 'targetType']),

  // ─── Followers ──────────────────────────────────────────────────────────
  followers: defineTable({
    userId: v.id('users'),
    orgId: v.id('organizations'),
    createdAt: v.string(),
  })
    .index('by_userId', ['userId'])
    .index('by_orgId', ['orgId'])
    .index('by_userId_orgId', ['userId', 'orgId']),

  // ─── Notifications ──────────────────────────────────────────────────────
  notifications: defineTable({
    userId: v.id('users'),
    type: v.union(
      v.literal('vote'), v.literal('comment'), v.literal('mention'),
      v.literal('org_invite'), v.literal('event_reminder'),
      v.literal('broadcast_starting'), v.literal('judge_invite'),
      v.literal('admin_announcement'), v.literal('follow'),
      v.literal('nomination'), v.literal('verification'),
    ),
    title: v.string(),
    body: v.string(),
    link: v.optional(v.string()),
    orgId: v.optional(v.id('organizations')),
    eventId: v.optional(v.id('events')),
    isRead: v.boolean(),
    createdAt: v.string(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_isRead', ['userId', 'isRead'])
    .index('by_userId_createdAt', ['userId', 'createdAt']),

  // ─── Analytics ──────────────────────────────────────────────────────────
  analyticsEvents: defineTable({
    orgId: v.id('organizations'),
    eventId: v.optional(v.id('events')),
    type: v.union(
      v.literal('page_view'), v.literal('profile_visit'), v.literal('vote_cast'),
      v.literal('broadcast_view'), v.literal('follow'), v.literal('unfollow'),
      v.literal('share'), v.literal('search'), v.literal('download'),
    ),
    userId: v.optional(v.id('users')),
    metadata: v.optional(v.record(v.string(), v.string())),
    createdAt: v.string(),
  })
    .index('by_orgId', ['orgId'])
    .index('by_eventId', ['eventId'])
    .index('by_type', ['type'])
    .index('by_orgId_createdAt', ['orgId', 'createdAt'])
    .index('by_eventId_createdAt', ['eventId', 'createdAt']),

  // ─── Verification Requests ──────────────────────────────────────────────
  verificationRequests: defineTable({
    orgId: v.id('organizations'),
    requestedBy: v.id('users'),
    documentType: v.union(v.literal('business_registration'), v.literal('government_id'), v.literal('organization_certificate'), v.literal('other')),
    documentUrl: v.string(),
    status: v.union(v.literal('pending'), v.literal('approved'), v.literal('rejected')),
    reviewedBy: v.optional(v.id('users')),
    reviewedAt: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index('by_orgId', ['orgId'])
    .index('by_status', ['status']),

  // ─── Audit Logs ─────────────────────────────────────────────────────────
  auditLogs: defineTable({
    orgId: v.id('organizations'),
    userId: v.id('users'),
    action: v.string(),
    targetType: v.string(),
    targetId: v.string(),
    metadata: v.optional(v.record(v.string(), v.string())),
    createdAt: v.string(),
  })
    .index('by_orgId', ['orgId'])
    .index('by_userId', ['userId'])
    .index('by_orgId_createdAt', ['orgId', 'createdAt']),
});
