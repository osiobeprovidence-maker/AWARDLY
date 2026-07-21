export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'user' | 'admin' | 'platform_admin';
  followingIds: string[];
};

export type Organization = {
  id: string;
  name: string;
  username: string;
  description: string;
  logoUrl?: string;
  coverUrl?: string;
  followerCount: number;
  category: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    website?: string;
  };
  isLive?: boolean;
  liveUrl?: string; // e.g. youtube embed
  createdAt: string;
};

export type Post = {
  id: string;
  orgId: string;
  content: string;
  mediaUrls?: string[];
  likesCount: number;
  commentsCount: number;
  isPinned?: boolean;
  createdAt: string;
};

export type Event = {
  id: string;
  orgId: string;
  title: string;
  description: string;
  date: string;
  coverUrl?: string;
  status: 'draft' | 'published' | 'ended';
  isVotingActive: boolean;
};

export type Category = {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  rulesSource: 'global' | 'custom';
  customRules?: VotingRules;
};

export type VotingRules = {
  title: string;
  description: string;
  eligibility: string;
  dailyLimit: number;
  isPaid: boolean;
  verificationRequired: boolean;
  duplicatePolicy: string;
  fraudPrevention: string;
  startDate: string;
  endDate: string;
  terms: string;
  notes?: string;
};

export type Nominee = {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  voteCount: number;
};
