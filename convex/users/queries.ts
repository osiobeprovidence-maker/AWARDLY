import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const getUserByFirebaseUid = query({
  args: { firebaseUid: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_firebaseUid', (q) => q.eq('firebaseUid', args.firebaseUid))
      .unique();
  },
});

export const getUserByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_username', (q) => q.eq('username', args.username))
      .unique();
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .unique();
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return await ctx.db
      .query('users')
      .withIndex('by_firebaseUid', (q) => q.eq('firebaseUid', identity.subject))
      .unique();
  },
});

export const searchUsers = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const q = args.query.toLowerCase();
    const allUsers = await ctx.db.query('users').collect();
    return allUsers
      .filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
      .slice(0, 20);
  },
});

export const getByIds = query({
  args: { ids: v.array(v.id('users')) },
  handler: async (ctx, args) => {
    const users = await Promise.all(args.ids.map(id => ctx.db.get(id)));
    return users.filter(Boolean);
  },
});

export const getProfileCompletion = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    const checks = [
      { label: 'Add a profile picture', done: !!user.avatarUrl },
      { label: 'Add a cover image', done: !!user.coverUrl },
      { label: 'Write a bio', done: !!user.bio },
      { label: 'Add a headline', done: !!user.headline },
      { label: 'Set your location', done: !!user.location },
      { label: 'Add a website', done: !!user.website },
      { label: 'Choose a username', done: !!user.username },
      { label: 'Add skills', done: (user.skills?.length ?? 0) > 0 },
      { label: 'Add interests', done: (user.interests?.length ?? 0) > 0 },
      { label: 'Add social links', done: !!(user.socialLinks?.twitter || user.socialLinks?.instagram || user.socialLinks?.linkedin) },
    ];

    const done = checks.filter(c => c.done).length;
    const percentage = Math.round((done / checks.length) * 100);
    const suggestions = checks.filter(c => !c.done).slice(0, 3).map(c => c.label);

    return { percentage, checks, suggestions };
  },
});
