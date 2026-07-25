import { mutation } from '../_generated/server';
import { v } from 'convex/values';

export const submit = mutation({
  args: {
    eventId: v.id('events'),
    categoryId: v.id('categories'),
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
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error('Event not found');
    if (event.isDeleted) throw new Error('Event is no longer active');

    if (event.nominationEnd) {
      const deadline = new Date(event.nominationEnd).getTime();
      if (Date.now() > deadline) {
        throw new Error('Nominations are closed for this event');
      }
    }

    const category = await ctx.db.get(args.categoryId);
    if (!category || category.isDeleted) throw new Error('Category not found');

    let submitterId = undefined;
    if (args.firebaseUid) {
      const user = await ctx.db
        .query('users')
        .withIndex('by_firebaseUid', (q) => q.eq('firebaseUid', args.firebaseUid!))
        .unique();
      if (user) submitterId = user._id;
    }

    const now = new Date().toISOString();
    const nominationId = await ctx.db.insert('nominations', {
      eventId: args.eventId,
      categoryId: args.categoryId,
      orgId: event.orgId,
      submitterId,
      submitterEmail: args.submitterEmail,
      isSelfNomination: args.isSelfNomination,
      nomineeName: args.nomineeName,
      nomineeEmail: args.nomineeEmail,
      nomineeOrganization: args.nomineeOrganization,
      nomineeTitle: args.nomineeTitle,
      nomineeBio: args.nomineeBio,
      nomineeAvatarUrl: args.nomineeAvatarUrl,
      nomineeLinks: args.nomineeLinks,
      supportingLinks: args.supportingLinks,
      achievementSummary: args.achievementSummary,
      whyNominated: args.whyNominated,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    });

    return nominationId;
  },
});

export const review = mutation({
  args: {
    nominationId: v.id('nominations'),
    status: v.union(v.literal('approved'), v.literal('rejected'), v.literal('shortlisted')),
    reviewNotes: v.optional(v.string()),
    firebaseUid: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    let userIdentity = identity;

    if (!userIdentity && args.firebaseUid) {
      const user = await ctx.db
        .query('users')
        .withIndex('by_firebaseUid', (q) => q.eq('firebaseUid', args.firebaseUid))
        .unique();
      if (!user) throw new Error('Not authenticated');
    }

    const nomination = await ctx.db.get(args.nominationId);
    if (!nomination) throw new Error('Nomination not found');

    const now = new Date().toISOString();
    await ctx.db.patch(args.nominationId, {
      status: args.status,
      reviewNotes: args.reviewNotes,
      reviewedAt: now,
      updatedAt: now,
    });

    if (args.status === 'approved') {
      const nomineeId = await ctx.db.insert('nominees', {
        categoryId: nomination.categoryId,
        eventId: nomination.eventId,
        orgId: nomination.orgId,
        name: nomination.nomineeName,
        description: nomination.nomineeBio,
        imageUrl: nomination.nomineeAvatarUrl,
        voteCount: 0,
        isDeleted: false,
        createdAt: now,
      });

      await ctx.db.patch(args.nominationId, { nomineeId });

      const category = await ctx.db.get(nomination.categoryId);
      if (category) {
        await ctx.db.patch(category._id, { nomineeCount: category.nomineeCount + 1 });
      }
      const event = await ctx.db.get(nomination.eventId);
      if (event) {
        await ctx.db.patch(event._id, { nomineeCount: event.nomineeCount + 1 });
      }
    }

    return args.nominationId;
  },
});
