import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser } from '../shared/helpers';

export const syncUser = mutation({
  args: {
    firebaseUid: v.string(),
    email: v.string(),
    name: v.string(),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('users')
      .withIndex('by_firebaseUid', (q) => q.eq('firebaseUid', args.firebaseUid))
      .unique();

    if (existing) {
      const updates: Record<string, any> = { lastLoginAt: new Date().toISOString() };
      if (args.name && args.name !== existing.name) updates.name = args.name;
      if (args.avatarUrl && args.avatarUrl !== existing.avatarUrl) updates.avatarUrl = args.avatarUrl;
      await ctx.db.patch(existing._id, updates);
      return existing._id;
    }

    return await ctx.db.insert('users', {
      firebaseUid: args.firebaseUid,
      email: args.email,
      name: args.name,
      avatarUrl: args.avatarUrl,
      role: 'user',
      reputationScore: 0,
      awardsCount: 0,
      nominationsCount: 0,
      followerCount: 0,
      followingCount: 0,
      profileViews: 0,
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
  },
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
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
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (args.username) {
      const clean = args.username.toLowerCase().replace(/[^a-z0-9_]/g, '');
      if (clean.length < 3 || clean.length > 30) {
        throw new Error('Username must be 3-30 characters, alphanumeric and underscores only');
      }
      const existing = await ctx.db
        .query('users')
        .withIndex('by_username', (q) => q.eq('username', clean))
        .unique();
      if (existing && existing._id !== user._id) {
        throw new Error('Username is already taken');
      }
    }

    const updates: Record<string, any> = {};
    const fields = [
      'name', 'username', 'avatarUrl', 'coverUrl', 'bio', 'headline',
      'location', 'website', 'phone', 'industry',
    ] as const;
    for (const field of fields) {
      if (args[field] !== undefined) updates[field] = args[field];
    }
    if (args.skills !== undefined) updates.skills = args.skills;
    if (args.languages !== undefined) updates.languages = args.languages;
    if (args.interests !== undefined) updates.interests = args.interests;
    if (args.socialLinks !== undefined) updates.socialLinks = args.socialLinks;

    await ctx.db.patch(user._id, updates);
    return user._id;
  },
});

export const incrementProfileViews = mutation({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return;
    await ctx.db.patch(args.userId, {
      profileViews: (user.profileViews ?? 0) + 1,
    });
  },
});

export const updateRole = mutation({
  args: {
    userId: v.id('users'),
    role: v.union(v.literal('user'), v.literal('admin'), v.literal('platform_admin')),
  },
  handler: async (ctx, args) => {
    const caller = await getAuthenticatedUser(ctx);
    if (caller.role !== 'platform_admin') {
      throw new Error('Only platform admins can change user roles');
    }
    await ctx.db.patch(args.userId, { role: args.role });
    return args.userId;
  },
});
