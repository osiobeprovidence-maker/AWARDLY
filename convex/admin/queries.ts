import { query } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser } from '../shared/helpers';

async function requirePlatformAdmin(ctx: any, firebaseUid?: string) {
  const user = await getAuthenticatedUser(ctx, firebaseUid);
  if (user.role !== 'platform_admin' && user.role !== 'admin') {
    throw new Error('Access denied: platform admin required');
  }
  return user;
}

export const getPlatformStats = query({
  args: { firebaseUid: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requirePlatformAdmin(ctx, args.firebaseUid);

    const orgs = await ctx.db.query('organizations').collect();
    const nonDeletedOrgs = orgs.filter((o: any) => !o.isDeleted);

    const users = await ctx.db.query('users').collect();

    const events = await ctx.db.query('events').collect();
    const nonDeletedEvents = events.filter((e: any) => !e.isDeleted);

    const totalVotes = nonDeletedEvents.reduce((sum: number, e: any) => sum + (e.totalVotes || 0), 0);

    const txs = await ctx.db.query('transactions').collect();
    const completed = txs.filter((t: any) => t.status === 'completed');
    const totalRevenue = completed
      .filter((t: any) => ['ticket_sale', 'voting_revenue', 'award_entry'].includes(t.type))
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const pendingApprovals = await ctx.db
      .query('verificationRequests')
      .withIndex('by_status', (q) => q.eq('status', 'pending'))
      .collect();

    const pendingNominations = await ctx.db
      .query('nominations')
      .withIndex('by_status', (q) => q.eq('status', 'pending'))
      .collect();

    const weeklyRevenue: Record<string, number> = {};
    const twelveWeeksAgo = new Date();
    twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84);
    const twelveWeeksAgoStr = twelveWeeksAgo.toISOString();

    for (const t of completed) {
      if (t.createdAt < twelveWeeksAgoStr) continue;
      if (!['ticket_sale', 'voting_revenue', 'award_entry'].includes(t.type)) continue;
      const d = new Date(t.createdAt);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = weekStart.toISOString().slice(0, 10);
      weeklyRevenue[key] = (weeklyRevenue[key] || 0) + t.amount;
    }

    const revenueChart = Object.entries(weeklyRevenue)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([date, rev]) => ({ name: date.slice(5), rev }));

    const topOrgs = nonDeletedOrgs
      .sort((a: any, b: any) => (b.eventCount || 0) - (a.eventCount || 0))
      .slice(0, 10)
      .map((org: any) => ({
        _id: org._id,
        name: org.name,
        slug: org.slug,
        eventCount: org.eventCount || 0,
        followerCount: org.followerCount || 0,
        memberCount: org.memberCount || 0,
        isVerified: org.isVerified,
      }));

    return {
      totalOrgs: nonDeletedOrgs.length,
      totalUsers: users.length,
      totalEvents: nonDeletedEvents.length,
      totalVotes,
      totalRevenue,
      pendingApprovals: pendingApprovals.length,
      pendingNominations: pendingNominations.length,
      revenueChart,
      topOrgs,
    };
  },
});

export const getOrgDirectory = query({
  args: { firebaseUid: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requirePlatformAdmin(ctx, args.firebaseUid);

    const orgs = await ctx.db.query('organizations').collect();
    const nonDeletedOrgs = orgs.filter((o: any) => !o.isDeleted);

    const enriched = await Promise.all(
      nonDeletedOrgs.map(async (org: any) => {
        let subscription = null;
        try {
          subscription = await ctx.db
            .query('subscriptions')
            .withIndex('by_orgId', (q) => q.eq('orgId', org._id))
            .unique();
        } catch {}

        const eventCount = org.eventCount || 0;
        const txs = await ctx.db
          .query('transactions')
          .withIndex('by_orgId', (q) => q.eq('orgId', org._id))
          .collect();
        const revenue = txs
          .filter((t: any) => t.status === 'completed' && ['ticket_sale', 'voting_revenue', 'award_entry'].includes(t.type))
          .reduce((sum: number, t: any) => sum + t.amount, 0);

        return {
          _id: org._id,
          name: org.name,
          slug: org.slug,
          eventCount,
          followerCount: org.followerCount || 0,
          memberCount: org.memberCount || 0,
          isVerified: org.isVerified,
          plan: subscription?.plan || 'none',
          revenue,
          createdAt: org.createdAt,
        };
      })
    );

    return enriched.sort((a: any, b: any) => b.revenue - a.revenue);
  },
});

export const getUserDirectory = query({
  args: { firebaseUid: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requirePlatformAdmin(ctx, args.firebaseUid);

    const users = await ctx.db.query('users').collect();
    return users
      .sort((a: any, b: any) => new Date(b.lastLoginAt || b.createdAt).getTime() - new Date(a.lastLoginAt || a.createdAt).getTime())
      .slice(0, 100)
      .map((u: any) => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        awardsCount: u.awardsCount || 0,
        nominationsCount: u.nominationsCount || 0,
        lastLoginAt: u.lastLoginAt,
        createdAt: u.createdAt,
      }));
  },
});
