import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // ─── Users ──────────────────────────────────────────────────────────────
  users: defineTable({
    firebaseUid: v.string(),
    email: v.string(),
    name: v.string(),
    username: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    headline: v.optional(v.string()),
    location: v.optional(v.string()),
    website: v.optional(v.string()),
    phone: v.optional(v.string()),
    industry: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    languages: v.optional(v.array(v.string())),
    interests: v.optional(v.array(v.string())),
    socialLinks: v.optional(v.object({
      twitter: v.optional(v.string()),
      instagram: v.optional(v.string()),
      linkedin: v.optional(v.string()),
      youtube: v.optional(v.string()),
      github: v.optional(v.string()),
      portfolio: v.optional(v.string()),
    })),
    verificationStatus: v.optional(v.object({
      email: v.boolean(),
      phone: v.boolean(),
      identity: v.boolean(),
      organization: v.boolean(),
    })),
    reputationScore: v.optional(v.number()),
    awardsCount: v.optional(v.number()),
    nominationsCount: v.optional(v.number()),
    followerCount: v.optional(v.number()),
    followingCount: v.optional(v.number()),
    profileViews: v.optional(v.number()),
    role: v.union(v.literal('user'), v.literal('admin'), v.literal('platform_admin')),
    lastLoginAt: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index('by_firebaseUid', ['firebaseUid'])
    .index('by_email', ['email'])
    .index('by_username', ['username']),

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
    audienceScope: v.optional(v.union(
      v.literal('local'), v.literal('national'), v.literal('regional'),
      v.literal('international'), v.literal('global'),
    )),
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
      threads: v.optional(v.string()),
      snapchat: v.optional(v.string()),
      whatsapp: v.optional(v.string()),
      telegram: v.optional(v.string()),
      discord: v.optional(v.string()),
      website: v.optional(v.string()),
    })),
    timezone: v.optional(v.string()),
    city: v.optional(v.string()),
    supportEmail: v.optional(v.string()),
    youtubeChannelId: v.optional(v.string()),
    youtubeChannelName: v.optional(v.string()),
    youtubeChannelThumbnail: v.optional(v.string()),
    youtubeAccessToken: v.optional(v.string()),
    youtubeRefreshToken: v.optional(v.string()),
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
    status: v.union(
      v.literal('draft'), v.literal('ready_for_review'), v.literal('published'),
      v.literal('live'), v.literal('voting_ended'), v.literal('winners_announced'),
      v.literal('closed'), v.literal('archived'),
    ),
    isVotingActive: v.boolean(),
    votingType: v.optional(v.union(v.literal('public'), v.literal('member'), v.literal('judge'), v.literal('both'))),
    nominationStart: v.optional(v.string()),
    nominationEnd: v.optional(v.string()),
    votingStart: v.optional(v.string()),
    votingEnd: v.optional(v.string()),
    judgingDeadline: v.optional(v.string()),
    judgingRules: v.optional(v.object({
      publicWeight: v.number(),
      judgeWeight: v.number(),
      scoreRange: v.number(),
      lockAfterDeadline: v.boolean(),
      allowDraftSaving: v.boolean(),
    })),
    judgingGuidelines: v.optional(v.string()),
    youtubeVideoId: v.optional(v.string()),
    muxPlaybackId: v.optional(v.string()),
    categoryCount: v.number(),
    nomineeCount: v.number(),
    totalVotes: v.number(),
    viewCount: v.number(),

    // ─── Award Ceremony ────────────────────────────────────────────────────
    awardFormat: v.optional(v.union(
      v.literal('online'),
      v.literal('physical'),
      v.literal('hybrid'),
    )),
    ceremony: v.optional(v.object({
      venueName: v.optional(v.string()),
      venueAddress: v.optional(v.string()),
      coordinates: v.optional(v.object({ lat: v.number(), lng: v.number() })),
      date: v.optional(v.string()),
      time: v.optional(v.string()),
      host: v.optional(v.string()),
      dressCode: v.optional(v.string()),
      capacity: v.optional(v.number()),
      parkingInfo: v.optional(v.string()),
      accessibilityNotes: v.optional(v.string()),
      description: v.optional(v.string()),
      livestreamUrl: v.optional(v.string()),
      winnerAnnouncementDate: v.optional(v.string()),
    })),

    // ─── Ticketing (Powered by MyInvite) ───────────────────────────────────
    ticketing: v.optional(v.object({
      provider: v.optional(v.union(v.literal('myinvite'))),
      ticketEventId: v.optional(v.string()),
      ticketUrl: v.optional(v.string()),
      ticketStatus: v.optional(v.union(
        v.literal('not_connected'),
        v.literal('connected'),
        v.literal('syncing'),
        v.literal('error'),
      )),
      ticketSales: v.optional(v.number()),
      ticketRevenue: v.optional(v.number()),
      guestCount: v.optional(v.number()),
      eventName: v.optional(v.string()),
    })),

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
    judgingCriteria: v.optional(v.array(v.object({
      id: v.string(),
      label: v.string(),
      description: v.optional(v.string()),
      maxScore: v.number(),
      weight: v.number(),
    }))),
    nomineeCount: v.number(),
    totalVotes: v.number(),
    isDeleted: v.boolean(),
    createdAt: v.string(),
    branding: v.optional(v.object({
      primaryColor: v.string(),
      secondaryColor: v.string(),
      accentColor: v.string(),
      categoryIcon: v.string(),
      font: v.string(),
      bannerImage: v.optional(v.string()),
      sponsorLogo: v.optional(v.string()),
      tagline: v.optional(v.string()),
      description: v.optional(v.string()),
    })),
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

  // ─── Nominations (Public Submissions) ──────────────────────────────────
  nominations: defineTable({
    eventId: v.id('events'),
    categoryId: v.id('categories'),
    orgId: v.id('organizations'),
    submitterId: v.optional(v.id('users')),
    submitterEmail: v.string(),
    isSelfNomination: v.boolean(),
    nomineeName: v.string(),
    nomineeEmail: v.optional(v.string()),
    nomineeOrganization: v.optional(v.string()),
    nomineeTitle: v.optional(v.string()),
    nomineeBio: v.string(),
    nomineeAvatarUrl: v.optional(v.string()),
    nomineeLinks: v.optional(v.object({
      website: v.optional(v.string()),
      twitter: v.optional(v.string()),
      instagram: v.optional(v.string()),
      linkedin: v.optional(v.string()),
      youtube: v.optional(v.string()),
    })),
    supportingLinks: v.optional(v.array(v.string())),
    achievementSummary: v.string(),
    whyNominated: v.string(),
    status: v.union(
      v.literal('pending'), v.literal('approved'),
      v.literal('rejected'), v.literal('shortlisted'),
    ),
    reviewNotes: v.optional(v.string()),
    reviewedBy: v.optional(v.id('users')),
    reviewedAt: v.optional(v.string()),
    nomineeId: v.optional(v.id('nominees')),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_eventId', ['eventId'])
    .index('by_categoryId', ['categoryId'])
    .index('by_orgId', ['orgId'])
    .index('by_status', ['status'])
    .index('by_eventId_status', ['eventId', 'status'])
    .index('by_submitterId', ['submitterId'])
    .index('by_submitterEmail', ['submitterEmail']),

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
    deadline: v.optional(v.string()),
    notes: v.optional(v.string()),
    invitedAt: v.string(),
    completedAt: v.optional(v.string()),
  })
    .index('by_userId', ['userId'])
    .index('by_eventId', ['eventId'])
    .index('by_userId_eventId', ['userId', 'eventId'])
    .index('by_orgId', ['orgId']),

  // ─── Judge Scores ──────────────────────────────────────────────────────
  judgeScores: defineTable({
    judgeId: v.id('judges'),
    userId: v.id('users'),
    eventId: v.id('events'),
    orgId: v.id('organizations'),
    categoryId: v.id('categories'),
    nomineeId: v.id('nominees'),
    criteriaScores: v.array(v.object({
      criteriaId: v.string(),
      label: v.string(),
      score: v.number(),
      maxScore: v.number(),
    })),
    totalScore: v.number(),
    maxTotalScore: v.number(),
    comment: v.optional(v.string()),
    status: v.union(v.literal('draft'), v.literal('submitted'), v.literal('locked')),
    submittedAt: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_judgeId', ['judgeId'])
    .index('by_nomineeId', ['nomineeId'])
    .index('by_categoryId', ['categoryId'])
    .index('by_eventId', ['eventId'])
    .index('by_judgeId_categoryId', ['judgeId', 'categoryId'])
    .index('by_judgeId_nomineeId', ['judgeId', 'nomineeId']),

  // ─── Broadcasts ─────────────────────────────────────────────────────────
  broadcasts: defineTable({
    eventId: v.id('events'),
    orgId: v.id('organizations'),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal('scheduled'), v.literal('live'), v.literal('ended'), v.literal('failed')),
    source: v.union(v.literal('youtube'), v.literal('rtmp'), v.literal('upload')),
    youtubeVideoId: v.optional(v.string()),
    youtubeLiveUrl: v.optional(v.string()),
    youtubeChannelId: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    scheduledStartTime: v.optional(v.string()),
    actualStartTime: v.optional(v.string()),
    endedAt: v.optional(v.string()),
    duration: v.optional(v.number()),
    concurrentViewers: v.number(),
    peakViewerCount: v.number(),
    totalChatMessages: v.number(),
    totalReactions: v.number(),
    totalVotesDuringStream: v.number(),
    totalDonationsDuringStream: v.number(),
    revenueDuringStream: v.number(),
    isPinned: v.boolean(),
    pinnedMessage: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index('by_eventId', ['eventId'])
    .index('by_orgId', ['orgId'])
    .index('by_status', ['status'])
    .index('by_eventId_status', ['eventId', 'status']),

  // ─── Live Chat ──────────────────────────────────────────────────────────
  liveChat: defineTable({
    broadcastId: v.id('broadcasts'),
    eventId: v.id('events'),
    orgId: v.id('organizations'),
    userId: v.id('users'),
    message: v.string(),
    isDeleted: v.boolean(),
    createdAt: v.string(),
  })
    .index('by_broadcastId', ['broadcastId'])
    .index('by_eventId', ['eventId'])
    .index('by_broadcastId_createdAt', ['broadcastId', 'createdAt']),

  // ─── Live Reactions ─────────────────────────────────────────────────────
  liveReactions: defineTable({
    broadcastId: v.id('broadcasts'),
    eventId: v.id('events'),
    userId: v.id('users'),
    emoji: v.string(),
    createdAt: v.string(),
  })
    .index('by_broadcastId', ['broadcastId'])
    .index('by_eventId', ['eventId']),

  // ─── Live Analytics Snapshots ───────────────────────────────────────────
  liveAnalytics: defineTable({
    broadcastId: v.id('broadcasts'),
    eventId: v.id('events'),
    orgId: v.id('organizations'),
    timestamp: v.string(),
    concurrentViewers: v.number(),
    chatMessagesPerMinute: v.number(),
    reactionsPerMinute: v.number(),
    votesPerMinute: v.number(),
    donationsPerMinute: v.number(),
  })
    .index('by_broadcastId', ['broadcastId'])
    .index('by_eventId', ['eventId'])
    .index('by_broadcastId_timestamp', ['broadcastId', 'timestamp']),

  // ─── Feed Posts ─────────────────────────────────────────────────────────
  feedPosts: defineTable({
    orgId: v.id('organizations'),
    authorId: v.id('users'),
    eventId: v.optional(v.id('events')),
    nomineeId: v.optional(v.id('nominees')),
    broadcastId: v.optional(v.id('broadcasts')),
    content: v.string(),
    visibility: v.union(
      v.literal('public'), v.literal('members_only'),
      v.literal('judges_only'), v.literal('staff_only'),
    ),
    postType: v.union(
      v.literal('text'), v.literal('image'), v.literal('video'),
      v.literal('poll'), v.literal('event_promotion'),
      v.literal('nominee_promotion'), v.literal('live_promotion'),
    ),
    mediaUrls: v.optional(v.array(v.string())),
    linkUrl: v.optional(v.string()),
    linkTitle: v.optional(v.string()),
    linkDescription: v.optional(v.string()),
    linkImage: v.optional(v.string()),
    status: v.union(v.literal('published'), v.literal('draft'), v.literal('scheduled'), v.literal('archived')),
    scheduledAt: v.optional(v.string()),
    publishedAt: v.optional(v.string()),
    likesCount: v.number(),
    commentsCount: v.number(),
    sharesCount: v.number(),
    bookmarksCount: v.number(),
    viewsCount: v.number(),
    isPinned: v.boolean(),
    isDeleted: v.boolean(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_orgId', ['orgId'])
    .index('by_authorId', ['authorId'])
    .index('by_eventId', ['eventId'])
    .index('by_orgId_createdAt', ['orgId', 'createdAt'])
    .index('by_orgId_status', ['orgId', 'status'])
    .index('by_status', ['status'])
    .index('by_scheduledAt', ['scheduledAt']),

  // ─── Post Polls ────────────────────────────────────────────────────────
  postPolls: defineTable({
    postId: v.id('feedPosts'),
    question: v.string(),
    options: v.array(v.object({
      id: v.string(),
      label: v.string(),
      votes: v.number(),
    })),
    totalVotes: v.number(),
    endsAt: v.optional(v.string()),
    isDeleted: v.boolean(),
    createdAt: v.string(),
  })
    .index('by_postId', ['postId']),

  // ─── Post Poll Votes ──────────────────────────────────────────────────
  postPollVotes: defineTable({
    pollId: v.id('postPolls'),
    postId: v.id('feedPosts'),
    userId: v.id('users'),
    optionId: v.string(),
    createdAt: v.string(),
  })
    .index('by_pollId', ['pollId'])
    .index('by_postId', ['postId'])
    .index('by_userId', ['userId'])
    .index('by_pollId_userId', ['pollId', 'userId']),

  // ─── Comments ───────────────────────────────────────────────────────────
  comments: defineTable({
    postId: v.id('feedPosts'),
    authorId: v.id('users'),
    content: v.string(),
    mediaUrl: v.optional(v.string()),
    parentCommentId: v.optional(v.id('comments')),
    likesCount: v.number(),
    isPinned: v.boolean(),
    isHidden: v.boolean(),
    isFeatured: v.boolean(),
    isDeleted: v.boolean(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_postId', ['postId'])
    .index('by_authorId', ['authorId'])
    .index('by_parentCommentId', ['parentCommentId']),

  // ─── Moderation ─────────────────────────────────────────────────────────
  moderations: defineTable({
    orgId: v.id('organizations'),
    targetType: v.union(v.literal('post'), v.literal('comment'), v.literal('user')),
    targetId: v.string(),
    action: v.union(
      v.literal('hide'), v.literal('feature'), v.literal('lock'),
      v.literal('unhide'), v.literal('unfeature'), v.literal('unlock'),
      v.literal('ban'), v.literal('unban'),
    ),
    moderatorId: v.id('users'),
    reason: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index('by_orgId', ['orgId'])
    .index('by_targetType_targetId', ['targetType', 'targetId']),

  // ─── Banned Users ──────────────────────────────────────────────────────
  bannedUsers: defineTable({
    orgId: v.id('organizations'),
    userId: v.id('users'),
    reason: v.optional(v.string()),
    bannedById: v.id('users'),
    createdAt: v.string(),
  })
    .index('by_orgId_userId', ['orgId', 'userId']),

  // ─── Post Lock ─────────────────────────────────────────────────────────
  postLocks: defineTable({
    postId: v.id('feedPosts'),
    lockedBy: v.id('users'),
    reason: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index('by_postId', ['postId']),

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

  // ─── User Follows (user-to-user) ───────────────────────────────────────
  userFollows: defineTable({
    followerId: v.id('users'),
    followingId: v.id('users'),
    createdAt: v.string(),
  })
    .index('by_followerId', ['followerId'])
    .index('by_followingId', ['followingId'])
    .index('by_followerId_followingId', ['followerId', 'followingId']),

  // ─── Portfolio Items ────────────────────────────────────────────────────
  portfolioItems: defineTable({
    userId: v.id('users'),
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal('image'), v.literal('video'), v.literal('pdf'), v.literal('link')),
    url: v.string(),
    thumbnailUrl: v.optional(v.string()),
    displayOrder: v.number(),
    isPublic: v.boolean(),
    isDeleted: v.boolean(),
    createdAt: v.string(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_displayOrder', ['userId', 'displayOrder']),

  // ─── Notifications ──────────────────────────────────────────────────────
  notifications: defineTable({
    userId: v.id('users'),
    type: v.union(
      v.literal('vote'), v.literal('comment'), v.literal('mention'),
      v.literal('org_invite'), v.literal('event_reminder'),
      v.literal('broadcast_starting'), v.literal('judge_invite'),
      v.literal('admin_announcement'), v.literal('follow'),
      v.literal('nomination'), v.literal('verification'),
      v.literal('like'),
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

  // ─── Payout Accounts ────────────────────────────────────────────────────
  payoutAccounts: defineTable({
    orgId: v.id('organizations'),
    bankName: v.string(),
    accountNumber: v.string(),
    accountName: v.string(),
    bankCode: v.optional(v.string()),
    currency: v.string(),
    isDefault: v.boolean(),
    isVerified: v.boolean(),
    isDeleted: v.boolean(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_orgId', ['orgId']),

  // ─── Transactions ───────────────────────────────────────────────────────
  transactions: defineTable({
    orgId: v.id('organizations'),
    eventId: v.optional(v.id('events')),
    type: v.union(
      v.literal('ticket_sale'), v.literal('voting_revenue'),
      v.literal('award_entry'), v.literal('withdrawal'),
      v.literal('refund'), v.literal('platform_fee'),
      v.literal('payout'),
    ),
    amount: v.number(),
    currency: v.string(),
    status: v.union(v.literal('pending'), v.literal('completed'), v.literal('failed'), v.literal('cancelled')),
    description: v.string(),
    reference: v.optional(v.string()),
    payoutAccountId: v.optional(v.id('payoutAccounts')),
    metadata: v.optional(v.record(v.string(), v.string())),
    createdAt: v.string(),
  })
    .index('by_orgId', ['orgId'])
    .index('by_orgId_type', ['orgId', 'type'])
    .index('by_orgId_createdAt', ['orgId', 'createdAt']),

  // ─── Subscriptions ──────────────────────────────────────────────────────
  subscriptions: defineTable({
    orgId: v.id('organizations'),
    plan: v.union(v.literal('starter'), v.literal('professional'), v.literal('enterprise')),
    status: v.union(v.literal('active'), v.literal('cancelled'), v.literal('past_due'), v.literal('trialing')),
    currentPeriodStart: v.string(),
    currentPeriodEnd: v.string(),
    monthlyPrice: v.number(),
    currency: v.string(),
    storageLimit: v.number(),
    eventLimit: v.number(),
    teamMemberLimit: v.number(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_orgId', ['orgId']),

  // ─── Media Folders ─────────────────────────────────────────────────────
  mediaFolders: defineTable({
    orgId: v.id('organizations'),
    name: v.string(),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    parentId: v.optional(v.id('mediaFolders')),
    path: v.string(),
    fileCount: v.number(),
    totalSize: v.number(),
    isDeleted: v.boolean(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_orgId', ['orgId'])
    .index('by_parentId', ['parentId'])
    .index('by_orgId_parentId', ['orgId', 'parentId'])
    .index('by_orgId_isDeleted', ['orgId', 'isDeleted']),

  // ─── Media Files ───────────────────────────────────────────────────────
  mediaFiles: defineTable({
    orgId: v.id('organizations'),
    folderId: v.optional(v.id('mediaFolders')),
    name: v.string(),
    originalName: v.string(),
    fileType: v.union(
      v.literal('image'), v.literal('video'), v.literal('document'),
      v.literal('audio'), v.literal('archive'), v.literal('other'),
    ),
    mimeType: v.string(),
    fileExtension: v.string(),
    fileSize: v.number(),
    storageId: v.string(),
    thumbnailUrl: v.optional(v.string()),
    displayUrl: v.optional(v.string()),
    uploadedBy: v.id('users'),
    isDeleted: v.boolean(),
    isFavorite: v.boolean(),
    deletedAt: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index('by_orgId', ['orgId'])
    .index('by_folderId', ['folderId'])
    .index('by_orgId_folderId', ['orgId', 'folderId'])
    .index('by_orgId_fileType', ['orgId', 'fileType'])
    .index('by_orgId_isDeleted', ['orgId', 'isDeleted'])
    .index('by_uploadedBy', ['uploadedBy']),

  // ─── Media Shares ─────────────────────────────────────────────────────
  mediaShares: defineTable({
    orgId: v.id('organizations'),
    fileId: v.id('mediaFiles'),
    createdBy: v.id('users'),
    token: v.string(),
    allowDownload: v.boolean(),
    expiresAt: v.optional(v.string()),
    accessCount: v.number(),
    isRevoked: v.boolean(),
    createdAt: v.string(),
  })
    .index('by_fileId', ['fileId'])
    .index('by_token', ['token'])
    .index('by_orgId', ['orgId']),

  // ─── Sponsors ────────────────────────────────────────────────────────
  sponsors: defineTable({
    orgId: v.id('organizations'),
    name: v.string(),
    logoUrl: v.optional(v.string()),
    website: v.optional(v.string()),
    level: v.union(
      v.literal('strategic'), v.literal('gold'),
      v.literal('silver'), v.literal('bronze'),
    ),
    displayOrder: v.number(),
    isActive: v.boolean(),
    isDeleted: v.boolean(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_orgId', ['orgId'])
    .index('by_orgId_isActive', ['orgId', 'isActive'])
    .index('by_orgId_isDeleted', ['orgId', 'isDeleted']),

  // ─── Ticket Types ─────────────────────────────────────────────────────
  ticketTypes: defineTable({
    orgId: v.id('organizations'),
    eventId: v.id('events'),
    name: v.string(),
    description: v.optional(v.string()),
    type: v.union(
      v.literal('free'), v.literal('paid'), v.literal('vip'),
      v.literal('vvip'), v.literal('early_bird'), v.literal('student'),
      v.literal('group'), v.literal('table'), v.literal('donation'),
    ),
    price: v.number(),
    currency: v.string(),
    quantity: v.number(),
    sold: v.number(),
    maxPerCustomer: v.number(),
    salesStart: v.optional(v.string()),
    salesEnd: v.optional(v.string()),
    visibility: v.union(v.literal('public'), v.literal('hidden'), v.literal('invite_only')),
    refundPolicy: v.optional(v.string()),
    isActive: v.boolean(),
    isDeleted: v.boolean(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_orgId', ['orgId'])
    .index('by_eventId', ['eventId'])
    .index('by_eventId_isActive', ['eventId', 'isActive']),

  // ─── Ticket Orders ────────────────────────────────────────────────────
  ticketOrders: defineTable({
    orgId: v.id('organizations'),
    eventId: v.id('events'),
    ticketTypeId: v.id('ticketTypes'),
    orderId: v.string(),
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.optional(v.string()),
    quantity: v.number(),
    unitPrice: v.number(),
    totalAmount: v.number(),
    currency: v.string(),
    discountCode: v.optional(v.string()),
    discountAmount: v.optional(v.number()),
    paymentStatus: v.union(
      v.literal('pending'), v.literal('successful'),
      v.literal('failed'), v.literal('refunded'),
    ),
    paymentReference: v.optional(v.string()),
    checkinStatus: v.union(
      v.literal('not_checked_in'), v.literal('checked_in'),
    ),
    checkedInAt: v.optional(v.string()),
    checkedInBy: v.optional(v.id('users')),
    ticketCode: v.string(),
    qrCode: v.optional(v.string()),
    deliveryMethod: v.optional(v.union(v.literal('email'), v.literal('whatsapp'), v.literal('physical'))),
    deliveryStatus: v.optional(v.union(v.literal('pending'), v.literal('delivered'), v.literal('failed'))),
    metadata: v.optional(v.any()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_orgId', ['orgId'])
    .index('by_eventId', ['eventId'])
    .index('by_ticketTypeId', ['ticketTypeId'])
    .index('by_orderId', ['orderId'])
    .index('by_customerEmail', ['customerEmail'])
    .index('by_paymentStatus', ['paymentStatus'])
    .index('by_eventId_paymentStatus', ['eventId', 'paymentStatus']),

  // ─── Ticket Discounts ─────────────────────────────────────────────────
  ticketDiscounts: defineTable({
    orgId: v.id('organizations'),
    eventId: v.id('events'),
    code: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal('percentage'), v.literal('fixed')),
    value: v.number(),
    maxUses: v.number(),
    usedCount: v.number(),
    validFrom: v.string(),
    validUntil: v.string(),
    isActive: v.boolean(),
    isDeleted: v.boolean(),
    createdAt: v.string(),
  })
    .index('by_orgId', ['orgId'])
    .index('by_eventId', ['eventId'])
    .index('by_code', ['code']),

  // ─── Check-in Logs ────────────────────────────────────────────────────
  checkinLogs: defineTable({
    orgId: v.id('organizations'),
    eventId: v.id('events'),
    orderId: v.id('ticketOrders'),
    checkedInBy: v.id('users'),
    method: v.union(v.literal('qr_scan'), v.literal('manual'), v.literal('search')),
    timestamp: v.string(),
  })
    .index('by_eventId', ['eventId'])
    .index('by_orderId', ['orderId']),
});
