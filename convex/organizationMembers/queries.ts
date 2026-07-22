import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getOrgMembers = query({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    const memberships = await ctx.db
      .query('organizationMembers')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .collect();

    const membersWithUsers = await Promise.all(
      memberships.map(async (m) => {
        const user = await ctx.db.get(m.userId);
        return { ...m, user: user ? { name: user.name, email: user.email, avatarUrl: user.avatarUrl } : null };
      })
    );

    return membersWithUsers;
  },
});

export const getMyMemberships = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const memberships = await ctx.db
      .query('organizationMembers')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .collect();

    const withOrgs = await Promise.all(
      memberships.map(async (m) => {
        const org = await ctx.db.get(m.orgId);
        return { ...m, org };
      })
    );

    return withOrgs;
  },
});

export const getMembership = query({
  args: {
    orgId: v.id('organizations'),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('organizationMembers')
      .withIndex('by_orgId_userId', (q) => q.eq('orgId', args.orgId).eq('userId', args.userId))
      .unique();
  },
});
