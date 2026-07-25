import { mutation, query } from '../_generated/server';
import { v } from 'convex/values';

export const updateCeremony = mutation({
  args: {
    eventId: v.id('events'),
    awardFormat: v.union(v.literal('online'), v.literal('physical'), v.literal('hybrid')),
    ceremony: v.object({
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
    }),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error('Event not found');

    await ctx.db.patch(args.eventId, {
      awardFormat: args.awardFormat,
      ceremony: args.ceremony,
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  },
});

export const connectTicketEvent = mutation({
  args: {
    eventId: v.id('events'),
    ticketEventId: v.string(),
    ticketUrl: v.string(),
    eventName: v.string(),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error('Event not found');

    await ctx.db.patch(args.eventId, {
      ticketing: {
        provider: 'myinvite',
        ticketEventId: args.ticketEventId,
        ticketUrl: args.ticketUrl,
        ticketStatus: 'connected',
        ticketSales: 0,
        ticketRevenue: 0,
        guestCount: 0,
        eventName: args.eventName,
      },
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  },
});

export const disconnectTicketEvent = mutation({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.eventId, {
      ticketing: undefined,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  },
});

export const updateTicketStatus = mutation({
  args: {
    eventId: v.id('events'),
    ticketStatus: v.union(
      v.literal('not_connected'),
      v.literal('connected'),
      v.literal('syncing'),
      v.literal('error'),
    ),
    ticketSales: v.optional(v.number()),
    ticketRevenue: v.optional(v.number()),
    guestCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error('Event not found');

    const existing = event.ticketing;
    if (!existing) throw new Error('No ticketing configured');

    await ctx.db.patch(args.eventId, {
      ticketing: {
        ...existing,
        ticketStatus: args.ticketStatus,
        ...(args.ticketSales !== undefined && { ticketSales: args.ticketSales }),
        ...(args.ticketRevenue !== undefined && { ticketRevenue: args.ticketRevenue }),
        ...(args.guestCount !== undefined && { guestCount: args.guestCount }),
      },
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  },
});

export const getCeremonyByEvent = query({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) return null;

    return {
      awardFormat: event.awardFormat,
      ceremony: event.ceremony,
      ticketing: event.ticketing,
      title: event.title,
      date: event.date,
      time: event.time,
      venue: event.venue,
      status: event.status,
    };
  },
});

export const getTicketingByEvent = query({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) return null;
    return event.ticketing ?? null;
  },
});

export const getCeremonyOverview = query({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) return null;

    const categories = await ctx.db
      .query('categories')
      .withIndex('by_eventId', (q) => q.eq('eventId', args.eventId))
      .collect();

    return {
      title: event.title,
      awardFormat: event.awardFormat,
      ceremony: event.ceremony,
      ticketing: event.ticketing,
      status: event.status,
      date: event.date,
      time: event.time,
      venue: event.venue,
      categoryCount: categories.length,
      nomineeCount: event.nomineeCount,
      totalVotes: event.totalVotes,
    };
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// Ticket Types
// ═══════════════════════════════════════════════════════════════════════════════

export const createTicketType = mutation({
  args: {
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
    maxPerCustomer: v.number(),
    salesStart: v.optional(v.string()),
    salesEnd: v.optional(v.string()),
    visibility: v.union(v.literal('public'), v.literal('hidden'), v.literal('invite_only')),
    refundPolicy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const ticketTypeId = await ctx.db.insert('ticketTypes', {
      orgId: args.orgId,
      eventId: args.eventId,
      name: args.name,
      description: args.description,
      type: args.type,
      price: args.price,
      currency: args.currency,
      quantity: args.quantity,
      sold: 0,
      maxPerCustomer: args.maxPerCustomer,
      salesStart: args.salesStart,
      salesEnd: args.salesEnd,
      visibility: args.visibility,
      refundPolicy: args.refundPolicy,
      isActive: true,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    });
    return { ticketTypeId };
  },
});

export const updateTicketType = mutation({
  args: {
    ticketTypeId: v.id('ticketTypes'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.optional(v.union(
      v.literal('free'), v.literal('paid'), v.literal('vip'),
      v.literal('vvip'), v.literal('early_bird'), v.literal('student'),
      v.literal('group'), v.literal('table'), v.literal('donation'),
    )),
    price: v.optional(v.number()),
    currency: v.optional(v.string()),
    quantity: v.optional(v.number()),
    maxPerCustomer: v.optional(v.number()),
    salesStart: v.optional(v.string()),
    salesEnd: v.optional(v.string()),
    visibility: v.optional(v.union(v.literal('public'), v.literal('hidden'), v.literal('invite_only'))),
    refundPolicy: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.ticketTypeId);
    if (!existing) throw new Error('Ticket type not found');

    const { ticketTypeId, ...updates } = args;
    await ctx.db.patch(ticketTypeId, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  },
});

export const deleteTicketType = mutation({
  args: { ticketTypeId: v.id('ticketTypes') },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.ticketTypeId);
    if (!existing) throw new Error('Ticket type not found');

    await ctx.db.patch(args.ticketTypeId, {
      isDeleted: true,
      isActive: false,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// Ticket Orders
// ═══════════════════════════════════════════════════════════════════════════════

export const createOrder = mutation({
  args: {
    orgId: v.id('organizations'),
    eventId: v.id('events'),
    ticketTypeId: v.id('ticketTypes'),
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.optional(v.string()),
    quantity: v.number(),
    discountCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const ticketType = await ctx.db.get(args.ticketTypeId);
    if (!ticketType) throw new Error('Ticket type not found');
    if (!ticketType.isActive) throw new Error('Ticket type is not active');
    if (ticketType.isDeleted) throw new Error('Ticket type no longer available');
    if (ticketType.quantity - ticketType.sold < args.quantity) {
      throw new Error('Not enough tickets available');
    }
    if (args.quantity > ticketType.maxPerCustomer) {
      throw new Error(`Maximum ${ticketType.maxPerCustomer} tickets per customer`);
    }

    const now = new Date().toISOString();
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const ticketCode = `TKT-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    let discountAmount = 0;
    if (args.discountCode) {
      const discount = await ctx.db
        .query('ticketDiscounts')
        .withIndex('by_code', (q) => q.eq('code', args.discountCode!))
        .first();

      if (discount && discount.isActive && !discount.isDeleted) {
        const nowDate = new Date(now);
        if (nowDate >= new Date(discount.validFrom) && nowDate <= new Date(discount.validUntil)) {
          if (discount.usedCount < discount.maxUses) {
            if (discount.type === 'percentage') {
              discountAmount = (ticketType.price * args.quantity * discount.value) / 100;
            } else {
              discountAmount = discount.value * args.quantity;
            }
          }
        }
      }
    }

    const totalAmount = Math.max(0, ticketType.price * args.quantity - discountAmount);

    const orderDocId = await ctx.db.insert('ticketOrders', {
      orgId: args.orgId,
      eventId: args.eventId,
      ticketTypeId: args.ticketTypeId,
      orderId,
      customerName: args.customerName,
      customerEmail: args.customerEmail,
      customerPhone: args.customerPhone,
      quantity: args.quantity,
      unitPrice: ticketType.price,
      totalAmount,
      currency: ticketType.currency,
      discountCode: args.discountCode,
      discountAmount: discountAmount > 0 ? discountAmount : undefined,
      paymentStatus: 'pending',
      checkinStatus: 'not_checked_in',
      ticketCode,
      qrCode: ticketCode,
      deliveryMethod: 'email',
      deliveryStatus: 'pending',
      createdAt: now,
      updatedAt: now,
    });

    return { orderId, orderDocId, ticketCode, totalAmount, discountAmount };
  },
});

export const confirmOrder = mutation({
  args: {
    orderId: v.id('ticketOrders'),
    paymentReference: v.string(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error('Order not found');
    if (order.paymentStatus !== 'pending') {
      throw new Error('Order is not in pending status');
    }

    const now = new Date().toISOString();

    await ctx.db.patch(args.orderId, {
      paymentStatus: 'successful',
      paymentReference: args.paymentReference,
      deliveryStatus: 'delivered',
      updatedAt: now,
    });

    const ticketType = await ctx.db.get(order.ticketTypeId);
    if (ticketType) {
      await ctx.db.patch(order.ticketTypeId, {
        sold: ticketType.sold + order.quantity,
        updatedAt: now,
      });
    }

    if (order.discountCode) {
      const discount = await ctx.db
        .query('ticketDiscounts')
        .withIndex('by_code', (q) => q.eq('code', order.discountCode!))
        .first();
      if (discount) {
        await ctx.db.patch(discount._id, {
          usedCount: discount.usedCount + 1,
        });
      }
    }

    return { success: true };
  },
});

export const failOrder = mutation({
  args: { orderId: v.id('ticketOrders') },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error('Order not found');

    await ctx.db.patch(args.orderId, {
      paymentStatus: 'failed',
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  },
});

export const refundOrder = mutation({
  args: { orderId: v.id('ticketOrders') },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error('Order not found');
    if (order.paymentStatus !== 'successful') {
      throw new Error('Only successful orders can be refunded');
    }

    const now = new Date().toISOString();

    await ctx.db.patch(args.orderId, {
      paymentStatus: 'refunded',
      updatedAt: now,
    });

    const ticketType = await ctx.db.get(order.ticketTypeId);
    if (ticketType) {
      await ctx.db.patch(order.ticketTypeId, {
        sold: Math.max(0, ticketType.sold - order.quantity),
        updatedAt: now,
      });
    }

    if (order.discountCode) {
      const discount = await ctx.db
        .query('ticketDiscounts')
        .withIndex('by_code', (q) => q.eq('code', order.discountCode!))
        .first();
      if (discount) {
        await ctx.db.patch(discount._id, {
          usedCount: Math.max(0, discount.usedCount - 1),
        });
      }
    }

    return { success: true };
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// Check-in
// ═══════════════════════════════════════════════════════════════════════════════

export const checkinAttendee = mutation({
  args: {
    orderId: v.id('ticketOrders'),
    checkedInBy: v.id('users'),
    method: v.union(v.literal('qr_scan'), v.literal('manual'), v.literal('search')),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error('Order not found');
    if (order.paymentStatus !== 'successful') {
      throw new Error('Only paid orders can be checked in');
    }
    if (order.checkinStatus === 'checked_in') {
      throw new Error('Attendee already checked in');
    }

    const now = new Date().toISOString();

    await ctx.db.patch(args.orderId, {
      checkinStatus: 'checked_in',
      checkedInAt: now,
      checkedInBy: args.checkedInBy,
      updatedAt: now,
    });

    await ctx.db.insert('checkinLogs', {
      orgId: order.orgId,
      eventId: order.eventId,
      orderId: args.orderId,
      checkedInBy: args.checkedInBy,
      method: args.method,
      timestamp: now,
    });

    return { success: true };
  },
});

export const undoCheckin = mutation({
  args: { orderId: v.id('ticketOrders') },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error('Order not found');
    if (order.checkinStatus !== 'checked_in') {
      throw new Error('Attendee is not checked in');
    }

    await ctx.db.patch(args.orderId, {
      checkinStatus: 'not_checked_in',
      checkedInAt: undefined,
      checkedInBy: undefined,
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// Discounts
// ═══════════════════════════════════════════════════════════════════════════════

export const createDiscount = mutation({
  args: {
    orgId: v.id('organizations'),
    eventId: v.id('events'),
    code: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal('percentage'), v.literal('fixed')),
    value: v.number(),
    maxUses: v.number(),
    validFrom: v.string(),
    validUntil: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('ticketDiscounts')
      .withIndex('by_code', (q) => q.eq('code', args.code))
      .first();
    if (existing) throw new Error('Discount code already exists');

    const discountId = await ctx.db.insert('ticketDiscounts', {
      orgId: args.orgId,
      eventId: args.eventId,
      code: args.code.toUpperCase(),
      description: args.description,
      type: args.type,
      value: args.value,
      maxUses: args.maxUses,
      usedCount: 0,
      validFrom: args.validFrom,
      validUntil: args.validUntil,
      isActive: true,
      isDeleted: false,
      createdAt: new Date().toISOString(),
    });

    return { discountId };
  },
});

export const updateDiscount = mutation({
  args: {
    discountId: v.id('ticketDiscounts'),
    code: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.optional(v.union(v.literal('percentage'), v.literal('fixed'))),
    value: v.optional(v.number()),
    maxUses: v.optional(v.number()),
    validFrom: v.optional(v.string()),
    validUntil: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.discountId);
    if (!existing) throw new Error('Discount not found');

    const { discountId, ...updates } = args;
    const patched: Record<string, unknown> = { ...updates };
    if (updates.code) patched.code = updates.code.toUpperCase();

    await ctx.db.patch(discountId, patched);
    return { success: true };
  },
});

export const deleteDiscount = mutation({
  args: { discountId: v.id('ticketDiscounts') },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.discountId);
    if (!existing) throw new Error('Discount not found');

    await ctx.db.patch(args.discountId, {
      isDeleted: true,
      isActive: false,
    });
    return { success: true };
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// Queries
// ═══════════════════════════════════════════════════════════════════════════════

export const getByEvent = query({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    const ticketTypes = await ctx.db
      .query('ticketTypes')
      .withIndex('by_eventId', (q) => q.eq('eventId', args.eventId))
      .collect();

    return ticketTypes.filter((t) => !t.isDeleted);
  },
});

export const getOrdersByEvent = query({
  args: {
    eventId: v.id('events'),
    status: v.optional(v.union(
      v.literal('pending'), v.literal('successful'),
      v.literal('failed'), v.literal('refunded'),
    )),
  },
  handler: async (ctx, args) => {
    let orders;
    if (args.status) {
      orders = await ctx.db
        .query('ticketOrders')
        .withIndex('by_eventId_paymentStatus', (q) =>
          q.eq('eventId', args.eventId).eq('paymentStatus', args.status!),
        )
        .order('desc')
        .collect();
    } else {
      orders = await ctx.db
        .query('ticketOrders')
        .withIndex('by_eventId', (q) => q.eq('eventId', args.eventId))
        .order('desc')
        .collect();
    }

    return orders;
  },
});

export const getOrdersByOrg = query({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query('ticketOrders')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .order('desc')
      .collect();

    return orders;
  },
});

export const getDiscountsByEvent = query({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    const discounts = await ctx.db
      .query('ticketDiscounts')
      .withIndex('by_eventId', (q) => q.eq('eventId', args.eventId))
      .collect();

    return discounts.filter((d) => !d.isDeleted);
  },
});

export const getCheckinsByEvent = query({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query('checkinLogs')
      .withIndex('by_eventId', (q) => q.eq('eventId', args.eventId))
      .order('desc')
      .collect();

    return logs;
  },
});

export const getDashboardStats = query({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    const ticketTypes = await ctx.db
      .query('ticketTypes')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .collect();

    const orders = await ctx.db
      .query('ticketOrders')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .collect();

    const activeEventIds = new Set(
      ticketTypes.filter((t) => !t.isDeleted).map((t) => t.eventId),
    );

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayStr = todayStart.toISOString();

    const totalTicketsSold = orders
      .filter((o) => o.paymentStatus === 'successful')
      .reduce((sum, o) => sum + o.quantity, 0);

    const totalRevenue = orders
      .filter((o) => o.paymentStatus === 'successful')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const pendingOrders = orders.filter((o) => o.paymentStatus === 'pending').length;
    const successfulOrders = orders.filter((o) => o.paymentStatus === 'successful').length;

    const checkedInToday = orders.filter(
      (o) =>
        o.checkinStatus === 'checked_in' &&
        o.checkedInAt &&
        o.checkedInAt >= todayStr,
    ).length;

    return {
      totalTicketsSold,
      totalRevenue,
      activeEvents: activeEventIds.size,
      pendingOrders,
      successfulOrders,
      checkedInToday,
    };
  },
});

export const getCustomers = query({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query('ticketOrders')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .collect();

    const customerMap = new Map<
      string,
      {
        name: string;
        email: string;
        phone: string | undefined;
        totalSpent: number;
        totalOrders: number;
        events: Set<string>;
      }
    >();

    for (const order of orders) {
      if (order.paymentStatus !== 'successful') continue;

      const existing = customerMap.get(order.customerEmail);
      if (existing) {
        existing.totalSpent += order.totalAmount;
        existing.totalOrders += 1;
        existing.events.add(order.eventId);
      } else {
        customerMap.set(order.customerEmail, {
          name: order.customerName,
          email: order.customerEmail,
          phone: order.customerPhone,
          totalSpent: order.totalAmount,
          totalOrders: 1,
          events: new Set([order.eventId]),
        });
      }
    }

    const customers = Array.from(customerMap.values()).map((c) => ({
      name: c.name,
      email: c.email,
      phone: c.phone,
      totalSpent: c.totalSpent,
      totalOrders: c.totalOrders,
      eventCount: c.events.size,
    }));

    customers.sort((a, b) => b.totalSpent - a.totalSpent);
    return customers;
  },
});

export const getDailySales = query({
  args: {
    orgId: v.id('organizations'),
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.days ?? 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffStr = cutoffDate.toISOString();

    const orders = await ctx.db
      .query('ticketOrders')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .collect();

    const dailyMap = new Map<string, { count: number; revenue: number }>();

    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      dailyMap.set(key, { count: 0, revenue: 0 });
    }

    for (const order of orders) {
      if (order.paymentStatus !== 'successful') continue;
      const dateKey = order.createdAt.split('T')[0];
      const entry = dailyMap.get(dateKey);
      if (entry) {
        entry.count += 1;
        entry.revenue += order.totalAmount;
      }
    }

    const result = Array.from(dailyMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return result;
  },
});

export const getSalesByType = query({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    const ticketTypes = await ctx.db
      .query('ticketTypes')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .collect();

    const orders = await ctx.db
      .query('ticketOrders')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .collect();

    const successfulOrders = orders.filter((o) => o.paymentStatus === 'successful');

    const typeMap = new Map<string, { name: string; type: string; sold: number; revenue: number }>();

    for (const tt of ticketTypes) {
      if (tt.isDeleted) continue;
      typeMap.set(tt._id, { name: tt.name, type: tt.type, sold: 0, revenue: 0 });
    }

    for (const order of successfulOrders) {
      const entry = typeMap.get(order.ticketTypeId);
      if (entry) {
        entry.sold += order.quantity;
        entry.revenue += order.totalAmount;
      }
    }

    return Array.from(typeMap.values());
  },
});

export const searchOrders = query({
  args: {
    orgId: v.id('organizations'),
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const q = args.query.toLowerCase();
    if (!q) return [];

    const orders = await ctx.db
      .query('ticketOrders')
      .withIndex('by_orgId', (q2) => q2.eq('orgId', args.orgId))
      .collect();

    return orders.filter(
      (o) =>
        o.orderId.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q),
    );
  },
});

export const verifyTicket = query({
  args: { ticketCode: v.string() },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query('ticketOrders')
      .collect();

    const order = orders.find((o) => o.ticketCode === args.ticketCode);
    if (!order) return null;

    const ticketType = await ctx.db.get(order.ticketTypeId);
    const event = await ctx.db.get(order.eventId);

    return {
      order: {
        orderId: order.orderId,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        quantity: order.quantity,
        paymentStatus: order.paymentStatus,
        checkinStatus: order.checkinStatus,
        checkedInAt: order.checkedInAt,
        ticketCode: order.ticketCode,
      },
      event: event
        ? {
            title: event.title,
            date: event.date,
            time: event.time,
            venue: event.venue,
          }
        : null,
      ticketType: ticketType
        ? {
            name: ticketType.name,
            type: ticketType.type,
          }
        : null,
    };
  },
});
