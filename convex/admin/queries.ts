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
    const suspendedOrgs = orgs.filter((o: any) => o.isDeleted);

    const users = await ctx.db.query('users').collect();

    const events = await ctx.db.query('events').collect();
    const nonDeletedEvents = events.filter((e: any) => !e.isDeleted);
    const activeEvents = nonDeletedEvents.filter((e: any) => e.status === 'live' || e.status === 'published');

    const totalVotes = nonDeletedEvents.reduce((sum: number, e: any) => sum + (e.totalVotes || 0), 0);

    const nominations = await ctx.db.query('nominations').collect();
    const pendingNominations = nominations.filter((n: any) => n.status === 'pending');

    const txs = await ctx.db.query('transactions').collect();
    const completed = txs.filter((t: any) => t.status === 'completed');
    const pendingWithdrawals = txs.filter((t: any) => t.status === 'pending' && (t.type === 'withdrawal' || t.type === 'payout'));
    const totalRevenue = completed
      .filter((t: any) => ['ticket_sale', 'voting_revenue', 'award_entry', 'platform_fee'].includes(t.type))
      .reduce((sum: number, t: any) => sum + t.amount, 0);
    const platformFees = completed
      .filter((t: any) => t.type === 'platform_fee')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const pendingApprovals = await ctx.db
      .query('verificationRequests')
      .withIndex('by_status', (q) => q.eq('status', 'pending'))
      .collect();

    const dailyRevenue: Record<string, number> = {};
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString();

    for (const t of completed) {
      if (t.createdAt < thirtyDaysAgoStr) continue;
      const day = t.createdAt.slice(0, 10);
      dailyRevenue[day] = (dailyRevenue[day] || 0) + t.amount;
    }

    const revenueChart = Object.entries(dailyRevenue)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-30)
      .map(([date, rev]) => ({ name: date.slice(5), rev }));

    const weeklyRevenue: Record<string, number> = {};
    for (const t of completed) {
      if (t.createdAt < thirtyDaysAgoStr) continue;
      if (!['ticket_sale', 'voting_revenue', 'award_entry'].includes(t.type)) continue;
      const d = new Date(t.createdAt);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = weekStart.toISOString().slice(0, 10);
      weeklyRevenue[key] = (weeklyRevenue[key] || 0) + t.amount;
    }

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

    const votesByStatus = {
      liveEvents: activeEvents.length,
      totalVotes,
      todayVotes: totalVotes,
    };

    return {
      totalOrgs: nonDeletedOrgs.length,
      suspendedOrgs: suspendedOrgs.length,
      totalUsers: users.length,
      totalEvents: nonDeletedEvents.length,
      activeEvents: activeEvents.length,
      totalVotes,
      totalRevenue,
      platformFees,
      pendingWithdrawals: pendingWithdrawals.length,
      pendingApprovals: pendingApprovals.length,
      pendingNominations: pendingNominations.length,
      totalNominations: nominations.length,
      revenueChart,
      topOrgs,
      votesByStatus,
    };
  },
});

export const getAllEvents = query({
  args: { firebaseUid: v.optional(v.string()), status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requirePlatformAdmin(ctx, args.firebaseUid);

    let events = await ctx.db.query('events').collect();
    events = events.filter((e: any) => !e.isDeleted);
    if (args.status && args.status !== 'all') {
      events = events.filter((e: any) => e.status === args.status);
    }

    const enriched = await Promise.all(
      events.map(async (event: any) => {
        const org = await ctx.db.get(event.orgId) as any;
        return {
          _id: event._id,
          title: event.title,
          slug: event.slug,
          status: event.status,
          totalVotes: event.totalVotes,
          nomineeCount: event.nomineeCount,
          categoryCount: event.categoryCount,
          viewCount: event.viewCount,
          orgName: org?.name || 'Unknown',
          orgSlug: org?.slug || '',
          isVotingActive: event.isVotingActive,
          createdAt: event.createdAt,
          date: event.date,
        };
      })
    );

    return enriched.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
});

export const getAllTransactions = query({
  args: { firebaseUid: v.optional(v.string()), status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requirePlatformAdmin(ctx, args.firebaseUid);

    let txs = await ctx.db.query('transactions').collect();
    if (args.status && args.status !== 'all') {
      txs = txs.filter((t: any) => t.status === args.status);
    }

    const enriched = await Promise.all(
      txs.slice(0, 200).map(async (tx: any) => {
        const org = await ctx.db.get(tx.orgId) as any;
        const event = tx.eventId ? await ctx.db.get(tx.eventId) as any : null;
        return {
          _id: tx._id,
          type: tx.type,
          amount: tx.amount,
          currency: tx.currency,
          status: tx.status,
          description: tx.description,
          reference: tx.reference,
          orgName: org?.name || 'Unknown',
          eventTitle: event?.title || null,
          createdAt: tx.createdAt,
        };
      })
    );

    return enriched.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
});

export const getPendingPayouts = query({
  args: { firebaseUid: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requirePlatformAdmin(ctx, args.firebaseUid);

    const txs = await ctx.db.query('transactions').collect();
    const pending = txs.filter((t: any) => t.status === 'pending' && (t.type === 'withdrawal' || t.type === 'payout'));

    const enriched = await Promise.all(
      pending.map(async (tx: any) => {
        const org = await ctx.db.get(tx.orgId) as any;
        const payoutAccount = tx.payoutAccountId ? await ctx.db.get(tx.payoutAccountId) as any : null;
        return {
          _id: tx._id,
          amount: tx.amount,
          currency: tx.currency,
          description: tx.description,
          orgName: org?.name || 'Unknown',
          orgId: tx.orgId,
          bankName: payoutAccount?.bankName || 'N/A',
          accountNumber: payoutAccount?.accountNumber || 'N/A',
          accountName: payoutAccount?.accountName || 'N/A',
          createdAt: tx.createdAt,
        };
      })
    );

    return enriched.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
});

export const getVotingCenter = query({
  args: { firebaseUid: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requirePlatformAdmin(ctx, args.firebaseUid);

    const votes = await ctx.db.query('votes').collect();
    const paidVotes = votes.filter((v: any) => v.isPaid);
    const freeVotes = votes.filter((v: any) => !v.isPaid);

    const totalVoteValue = paidVotes.reduce((sum: number, v: any) => sum + (v.quantity || 1), 0);

    const votesByDay: Record<string, number> = {};
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString();

    for (const v of votes) {
      if (v.createdAt < sevenDaysAgoStr) continue;
      const day = v.createdAt.slice(0, 10);
      votesByDay[day] = (votesByDay[day] || 0) + (v.quantity || 1);
    }

    const votesChart = Object.entries(votesByDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ name: date.slice(5), votes: count }));

    const uniqueIPs = new Set(votes.map((v: any) => v.ipAddress).filter(Boolean));
    const suspiciousVotes = votes.filter((v: any) => {
      return v.ipAddress && votes.filter((v2: any) => v2.ipAddress === v.ipAddress && v2.userId !== v.userId).length > 5;
    });

    return {
      totalVotes: votes.length,
      totalVoteQuantity: votes.reduce((sum: number, v: any) => sum + (v.quantity || 1), 0),
      paidVotes: paidVotes.length,
      freeVotes: freeVotes.length,
      paidVoteValue: totalVoteValue,
      uniqueIPs: uniqueIPs.size,
      suspiciousVotes: suspiciousVotes.length,
      votesChart,
      recentVotes: votes.slice(-50).reverse().map((v: any) => ({
        _id: v._id,
        userId: v.userId,
        eventId: v.eventId,
        nomineeId: v.nomineeId,
        quantity: v.quantity,
        isPaid: v.isPaid,
        ipAddress: v.ipAddress,
        createdAt: v.createdAt,
      })),
    };
  },
});

export const getAuditLogs = query({
  args: { firebaseUid: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requirePlatformAdmin(ctx, args.firebaseUid);

    const logs = await ctx.db.query('auditLogs').collect();

    const enriched = await Promise.all(
      logs.slice(0, 200).map(async (log: any) => {
        const user = await ctx.db.get(log.userId) as any;
        const org = await ctx.db.get(log.orgId) as any;
        return {
          _id: log._id,
          action: log.action,
          targetType: log.targetType,
          targetId: log.targetId,
          metadata: log.metadata,
          userName: user?.name || 'Unknown',
          orgName: org?.name || 'Unknown',
          createdAt: log.createdAt,
        };
      })
    );

    return enriched.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
          type: org.type,
          country: org.country,
          eventCount,
          followerCount: org.followerCount || 0,
          memberCount: org.memberCount || 0,
          isVerified: org.isVerified,
          isDeleted: org.isDeleted,
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

    const enriched = await Promise.all(
      users.slice(0, 200).map(async (u: any) => {
        const membershipCount = (await ctx.db.query('organizationMembers').withIndex('by_userId', (q) => q.eq('userId', u._id)).collect()).length;
        return {
          _id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          avatarUrl: u.avatarUrl,
          awardsCount: u.awardsCount || 0,
          nominationsCount: u.nominationsCount || 0,
          followerCount: u.followerCount || 0,
          membershipCount,
          lastLoginAt: u.lastLoginAt,
          createdAt: u.createdAt,
        };
      })
    );

    return enriched.sort((a: any, b: any) => new Date(b.lastLoginAt || b.createdAt).getTime() - new Date(a.lastLoginAt || a.createdAt).getTime());
  },
});

export const getVerificationRequests = query({
  args: { firebaseUid: v.optional(v.string()), status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requirePlatformAdmin(ctx, args.firebaseUid);

    let requests = await ctx.db.query('verificationRequests').collect();
    if (args.status && args.status !== 'all') {
      requests = requests.filter((r: any) => r.status === args.status);
    }

    const enriched = await Promise.all(
      requests.map(async (req: any) => {
        const org = await ctx.db.get(req.orgId) as any;
        const user = await ctx.db.get(req.requestedBy) as any;
        return {
          _id: req._id,
          orgName: org?.name || 'Unknown',
          orgId: req.orgId,
          requesterName: user?.name || 'Unknown',
          documentType: req.documentType,
          status: req.status,
          createdAt: req.createdAt,
        };
      })
    );

    return enriched.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
});

export const getFraudAlerts = query({
  args: { firebaseUid: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requirePlatformAdmin(ctx, args.firebaseUid);

    const votes = await ctx.db.query('votes').collect();

    const ipVotes: Record<string, { count: number; userIds: Set<string> }> = {};
    for (const vote of votes) {
      if (!vote.ipAddress) continue;
      if (!ipVotes[vote.ipAddress]) {
        ipVotes[vote.ipAddress] = { count: 0, userIds: new Set() };
      }
      ipVotes[vote.ipAddress].count++;
      ipVotes[vote.ipAddress].userIds.add(vote.userId);
    }

    const suspiciousIPs = Object.entries(ipVotes)
      .filter(([_, data]) => data.count > 10 || data.userIds.size > 3)
      .map(([ip, data]) => ({
        ipAddress: ip,
        totalVotes: data.count,
        uniqueUsers: data.userIds.size,
        riskScore: data.userIds.size > 5 ? 'high' : data.userIds.size > 3 ? 'medium' : 'low',
      }))
      .sort((a, b) => b.totalVotes - a.totalVotes);

    return {
      totalSuspicious: suspiciousIPs.length,
      highRisk: suspiciousIPs.filter((i) => i.riskScore === 'high').length,
      mediumRisk: suspiciousIPs.filter((i) => i.riskScore === 'medium').length,
      alerts: suspiciousIPs.slice(0, 50),
    };
  },
});
