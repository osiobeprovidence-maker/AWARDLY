import { mutation } from './_generated/server';

export const seedDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    // Get the first user (dev mode)
    const user = await ctx.db.query('users').order('desc').first();
    if (!user) throw new Error('No users found. Sign in first.');

    const now = new Date().toISOString();

    // ─── Check if demo data already exists ───────────────────────────
    const existingOrg = await ctx.db
      .query('organizations')
      .withIndex('by_slug', (q) => q.eq('slug', 'south-side-studio'))
      .unique();
    if (existingOrg) {
      return { message: 'Demo data already exists', orgId: existingOrg._id };
    }

    // ─── 1. Create Organization ──────────────────────────────────────
    const orgId = await ctx.db.insert('organizations', {
      name: 'South Side Studio',
      slug: 'south-side-studio',
      description: 'A creative production studio celebrating excellence in music, film, and digital art across West Africa.',
      type: 'media',
      primaryColor: '#c68a35',
      secondaryColor: '#1a1a2e',
      logoUrl: 'https://ui-avatars.com/api/?name=SSS&background=c68a35&color=1a1a2e&bold=true&size=128',
      coverUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=400&fit=crop',
      website: 'https://southsidestudio.com',
      country: 'Nigeria',
      headquarters: 'Lagos',
      city: 'Lagos',
      foundedYear: 2020,
      contactEmail: 'hello@southsidestudio.com',
      phone: '+234 801 234 5678',
      timezone: 'Africa/Lagos',
      supportEmail: 'support@southsidestudio.com',
      ownerId: user._id,
      isVerified: true,
      verificationStatus: 'verified',
      followerCount: 1247,
      memberCount: 8,
      eventCount: 0,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
      socialLinks: {
        twitter: 'https://twitter.com/southsidestudio',
        instagram: 'https://instagram.com/southsidestudio',
        youtube: 'https://youtube.com/@southsidestudio',
        website: 'https://southsidestudio.com',
      },
    });

    // Add user as owner member
    await ctx.db.insert('organizationMembers', {
      orgId,
      userId: user._id,
      role: 'owner',
      status: 'active',
      joinedAt: now,
    });

    // ─── 2. Create Event ─────────────────────────────────────────────
    const eventId = await ctx.db.insert('events', {
      orgId,
      title: 'The Golden Crowns 2026',
      slug: 'the-golden-crowns-2026',
      description: 'The 4th annual Golden Crowns Awards celebrating the best in African music, film, and digital creativity. A night of elegance, talent, and cultural celebration.',
      date: '2026-12-20',
      time: '19:00',
      bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
      coverUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
      venue: 'Eko Convention Centre',
      themeColor: '#c68a35',
      tagline: 'Where Excellence Meets Recognition',
      status: 'published',
      isVotingActive: true,
      votingType: 'both',
      nominationStart: '2026-09-01',
      nominationEnd: '2026-11-15',
      votingStart: '2026-11-20',
      votingEnd: '2026-12-18',
      awardFormat: 'physical',
      categoryCount: 4,
      nomineeCount: 0,
      totalVotes: 0,
      viewCount: 0,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
      ceremony: {
        venueName: 'Eko Convention Centre',
        venueAddress: '14 Ahmadu Bello Way, Victoria Island, Lagos',
        date: '2026-12-20',
        time: '19:00',
        host: 'Osas Ighodaro',
        dressCode: 'Black Tie',
        capacity: 2000,
        description: 'An unforgettable evening of entertainment and awards.',
      },
    });

    // Update org event count
    await ctx.db.patch(orgId, { eventCount: 1 });

    // ─── 3. Create Categories ────────────────────────────────────────
    const categories = [
      { name: 'Artist of the Year', description: 'Recognizing the most outstanding musical artist of the year.' },
      { name: 'Best Music Video', description: 'Celebrating the most visually stunning and creative music video.' },
      { name: 'Album of the Year', description: 'Honoring the best overall album release of the year.' },
      { name: 'Best New Artist', description: 'Spotlighting the most promising breakthrough talent.' },
    ];

    const categoryIds = [];
    for (const cat of categories) {
      const catId = await ctx.db.insert('categories', {
        eventId,
        orgId,
        name: cat.name,
        description: cat.description,
        rulesSource: 'global',
        nomineeCount: 0,
        totalVotes: 0,
        isDeleted: false,
        createdAt: now,
        branding: {
          primaryColor: '#c68a35',
          secondaryColor: '#1a1a2e',
          accentColor: '#f59e0b',
          categoryIcon: '🏆',
          font: 'serif',
        },
        judgingCriteria: [
          { id: 'c1', label: 'Artistry', maxScore: 10, weight: 30, description: 'Vocal/instrumental skill' },
          { id: 'c2', label: 'Impact', maxScore: 10, weight: 30, description: 'Cultural and commercial impact' },
          { id: 'c3', label: 'Originality', maxScore: 10, weight: 20, description: 'Creative innovation' },
          { id: 'c4', label: 'Performance', maxScore: 10, weight: 20, description: 'Live performance quality' },
        ],
      });
      categoryIds.push(catId);
    }

    // ─── 4. Create Nominees ──────────────────────────────────────────
    const nomineesData = [
      // Artist of the Year
      { catIndex: 0, name: 'Burna Boy', description: 'Grammy-winning Afro-fusion artist with global reach.' },
      { catIndex: 0, name: 'Tems', description: 'Award-winning singer-songwriter and producer.' },
      { catIndex: 0, name: 'Rema', description: 'Global Afrobeats sensation with chart-topping hits.' },
      { catIndex: 0, name: 'Ayra Starr', description: 'Rising star redefining Afrobeats for a new generation.' },

      // Best Music Video
      { catIndex: 1, name: 'Burna Boy - "City Boys"', description: 'A cinematic visual masterpiece shot in Lagos.' },
      { catIndex: 1, name: 'Tems - "Free"', description: 'Artistic and emotionally powerful visual storytelling.' },
      { catIndex: 1, name: 'Rema - "March Am"', description: 'High-energy video with stunning choreography.' },

      // Album of the Year
      { catIndex: 2, name: 'Burna Boy - "I Told Them"', description: 'A genre-spanning album that solidified his legacy.' },
      { catIndex: 2, name: 'Tems - "Born in the Wild"', description: 'Debut album that captivated global audiences.' },
      { catIndex: 2, name: 'Rema - "Rave & Roses Ultra"', description: 'Expanded deluxe edition with new hits.' },

      // Best New Artist
      { catIndex: 3, name: 'Shallipopi', description: 'Pluto-fusion pioneer with viral hits.' },
      { catIndex: 3, name: 'Odumodublvck', description: 'Genre-bending artist blending rap and Afrobeats.' },
      { catIndex: 3, name: 'Ayo Maff', description: 'Young talent taking the streets by storm.' },
    ];

    for (const nom of nomineesData) {
      const nomineeId = await ctx.db.insert('nominees', {
        eventId,
        categoryId: categoryIds[nom.catIndex],
        orgId,
        name: nom.name,
        description: nom.description,
        imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(nom.name)}&background=random&color=fff&bold=true&size=256`,
        voteCount: 0,
        isDeleted: false,
        createdAt: now,
      });

      // Increment counts
      const cat = await ctx.db.get(categoryIds[nom.catIndex]);
      if (cat) {
        await ctx.db.patch(categoryIds[nom.catIndex], { nomineeCount: cat.nomineeCount + 1 });
      }
    }

    // Update event nominee count
    await ctx.db.patch(eventId, { nomineeCount: nomineesData.length });

    // ─── 5. Create Ticket Types ──────────────────────────────────────
    await ctx.db.insert('ticketTypes', {
      eventId,
      orgId,
      name: 'Regular',
      description: 'Standard admission to the ceremony.',
      type: 'paid',
      price: 15000,
      currency: 'NGN',
      quantity: 500,
      sold: 0,
      maxPerCustomer: 4,
      isActive: true,
      isDeleted: false,
      visibility: 'public',
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert('ticketTypes', {
      eventId,
      orgId,
      name: 'VIP',
      description: 'Premium seating with backstage access and complimentary drinks.',
      type: 'vip',
      price: 50000,
      currency: 'NGN',
      quantity: 100,
      sold: 0,
      maxPerCustomer: 2,
      isActive: true,
      isDeleted: false,
      visibility: 'public',
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert('ticketTypes', {
      eventId,
      orgId,
      name: 'VVIP Table',
      description: 'Exclusive table for 10 with premium dining and artist meet & greet.',
      type: 'vvip',
      price: 500000,
      currency: 'NGN',
      quantity: 20,
      sold: 0,
      maxPerCustomer: 1,
      isActive: true,
      isDeleted: false,
      visibility: 'public',
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert('ticketTypes', {
      eventId,
      orgId,
      name: 'Student',
      description: 'Discounted ticket for students with valid ID.',
      type: 'student',
      price: 5000,
      currency: 'NGN',
      quantity: 200,
      sold: 0,
      maxPerCustomer: 2,
      isActive: true,
      isDeleted: false,
      visibility: 'public',
      createdAt: now,
      updatedAt: now,
    });

    return {
      message: 'Demo data created successfully!',
      orgId,
      eventId,
      categories: categoryIds.length,
      nominees: nomineesData.length,
    };
  },
});
