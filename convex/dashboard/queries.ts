import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getOrgStats = query({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    const org = await ctx.db.get(args.orgId);
    if (!org) return null;

    const events = await ctx.db
      .query('events')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .collect();

    const nonDeletedEvents = events.filter((e) => !e.isDeleted);

    const eventStats = {
      total: nonDeletedEvents.length,
      draft: nonDeletedEvents.filter((e) => e.status === 'draft').length,
      inReview: nonDeletedEvents.filter((e) => e.status === 'ready_for_review').length,
      published: nonDeletedEvents.filter((e) => e.status === 'published').length,
      live: nonDeletedEvents.filter((e) => e.status === 'live').length,
      votingEnded: nonDeletedEvents.filter((e) => e.status === 'voting_ended').length,
      winnersAnnounced: nonDeletedEvents.filter((e) => e.status === 'winners_announced').length,
      archived: nonDeletedEvents.filter((e) => e.status === 'archived').length,
    };

    const totalVotes = nonDeletedEvents.reduce((sum, e) => sum + (e.totalVotes || 0), 0);
    const totalViews = nonDeletedEvents.reduce((sum, e) => sum + (e.viewCount || 0), 0);
    const totalNominees = nonDeletedEvents.reduce((sum, e) => sum + (e.nomineeCount || 0), 0);
    const totalCategories = nonDeletedEvents.reduce((sum, e) => sum + (e.categoryCount || 0), 0);

    const nominations = await ctx.db
      .query('nominations')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .collect();

    const nominationStats = {
      total: nominations.length,
      pending: nominations.filter((n) => n.status === 'pending').length,
      approved: nominations.filter((n) => n.status === 'approved').length,
      rejected: nominations.filter((n) => n.status === 'rejected').length,
      shortlisted: nominations.filter((n) => n.status === 'shortlisted').length,
    };

    const txs = await ctx.db
      .query('transactions')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .collect();

    const completed = txs.filter((t) => t.status === 'completed');
    const earned = completed
      .filter((t) => ['ticket_sale', 'voting_revenue', 'award_entry'].includes(t.type))
      .reduce((sum, t) => sum + t.amount, 0);
    const withdrawn = completed
      .filter((t) => ['withdrawal', 'payout'].includes(t.type))
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const pending = txs
      .filter((t) => t.status === 'pending')
      .reduce((sum, t) => sum + t.amount, 0);
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    const thisMonthStr = thisMonth.toISOString();
    const thisMonthEarnings = completed
      .filter((t) => ['ticket_sale', 'voting_revenue', 'award_entry'].includes(t.type) && t.createdAt >= thisMonthStr)
      .reduce((sum, t) => sum + t.amount, 0);

    const revenue = {
      total: earned,
      withdrawn,
      pending,
      thisMonth: thisMonthEarnings,
      available: earned - withdrawn,
    };

    const members = await ctx.db
      .query('organizationMembers')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .collect();

    const memberStats = {
      total: members.length,
      owners: members.filter((m) => m.role === 'owner').length,
      admins: members.filter((m) => m.role === 'admin').length,
      managers: members.filter((m) => m.role === 'event_manager').length,
      judges: members.filter((m) => m.role === 'judge').length,
    };

    const followers = await ctx.db
      .query('followers')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .collect();

    const judges = await ctx.db
      .query('judges')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .collect();

    const judgeStats = {
      total: judges.length,
      accepted: judges.filter((j) => j.status === 'accepted').length,
      pending: judges.filter((j) => j.status === 'invited').length,
      completed: judges.filter((j) => j.status === 'completed').length,
    };

    const daily: Record<string, number> = {};
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString();

    const recentAnalytics = await ctx.db
      .query('analyticsEvents')
      .withIndex('by_orgId_createdAt', (q) =>
        q.eq('orgId', args.orgId).gte('createdAt', thirtyDaysAgoStr)
      )
      .collect();

    for (const e of recentAnalytics) {
      const day = e.createdAt.slice(0, 10);
      daily[day] = (daily[day] || 0) + 1;
    }

    return {
      eventStats,
      totalVotes,
      totalViews,
      totalNominees,
      totalCategories,
      nominationStats,
      revenue,
      memberStats,
      followerCount: followers.length,
      judgeStats,
      dailyAnalytics: daily,
    };
  },
});

export const getRecentActivity = query({
  args: { orgId: v.id('organizations'), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;

    const logs = await ctx.db
      .query('auditLogs')
      .withIndex('by_orgId_createdAt', (q) => q.eq('orgId', args.orgId))
      .order('desc')
      .take(limit);

    const enriched = await Promise.all(
      logs.map(async (log) => {
        let userName = 'Unknown';
        try {
          const user = await ctx.db.get(log.userId);
          if (user) userName = user.name || user.email || 'Unknown';
        } catch {}
        return { ...log, userName };
      })
    );

    return enriched;
  },
});
