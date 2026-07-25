import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser, requirePermission } from '../shared/helpers';

export const create = mutation({
  args: {
    orgId: v.id('organizations'),
    name: v.string(),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    parentId: v.optional(v.id('mediaFolders')),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log('[mediaFolders:create] Start', { orgId: args.orgId, name: args.name, parentId: args.parentId });

    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    console.log('[mediaFolders:create] Authenticated user', { userId: user._id, email: user.email });

    const org = await ctx.db.get(args.orgId);
    if (!org) {
      console.error('[mediaFolders:create] Organization not found', { orgId: args.orgId });
      throw new Error('Organization not found');
    }

    await requirePermission(ctx, user._id, args.orgId, 'manageMedia');

    const name = args.name.trim();
    if (!name) throw new Error('Folder name is required');
    if (name.length > 100) throw new Error('Folder name must be 100 characters or less');

    if (args.parentId) {
      const parent = await ctx.db.get(args.parentId);
      if (!parent) throw new Error('Parent folder not found');
      if (parent.orgId !== args.orgId) throw new Error('Parent folder belongs to a different organization');
    }

    const existing = await ctx.db
      .query('mediaFolders')
      .withIndex('by_orgId_parentId', (q) =>
        q.eq('orgId', args.orgId).eq('parentId', args.parentId ?? undefined)
      )
      .collect();

    if (existing.some((f) => f.name.toLowerCase() === name.toLowerCase() && !f.isDeleted)) {
      throw new Error('A folder with this name already exists in this location');
    }

    let path = `/${name}`;
    if (args.parentId) {
      const parent = await ctx.db.get(args.parentId);
      if (parent) path = `${parent.path}/${name}`;
    }

    const now = new Date().toISOString();
    const folderId = await ctx.db.insert('mediaFolders', {
      orgId: args.orgId,
      name,
      description: args.description,
      color: args.color,
      parentId: args.parentId,
      path,
      fileCount: 0,
      totalSize: 0,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    });

    console.log('[mediaFolders:create] Success', { folderId, path });
    return folderId;
  },
});

export const rename = mutation({
  args: {
    folderId: v.id('mediaFolders'),
    name: v.string(),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const folder = await ctx.db.get(args.folderId);
    if (!folder) throw new Error('Folder not found');

    await requirePermission(ctx, user._id, folder.orgId, 'manageMedia');

    const name = args.name.trim();
    if (!name) throw new Error('Folder name is required');
    if (name.length > 100) throw new Error('Folder name must be 100 characters or less');

    const siblings = await ctx.db
      .query('mediaFolders')
      .withIndex('by_orgId_parentId', (q) =>
        q.eq('orgId', folder.orgId).eq('parentId', folder.parentId ?? undefined)
      )
      .collect();

    if (siblings.some((f) => f._id !== args.folderId && f.name.toLowerCase() === name.toLowerCase() && !f.isDeleted)) {
      throw new Error('A folder with this name already exists in this location');
    }

    const oldPath = folder.path;
    const newPath = folder.parentId
      ? `${oldPath.substring(0, oldPath.lastIndexOf('/'))}/${name}`
      : `/${name}`;

    await ctx.db.patch(args.folderId, {
      name,
      path: newPath,
      updatedAt: new Date().toISOString(),
    });

    const children = await ctx.db
      .query('mediaFolders')
      .withIndex('by_parentId', (q) => q.eq('parentId', args.folderId))
      .collect();

    for (const child of children) {
      const childNewPath = child.path.replace(oldPath, newPath);
      await ctx.db.patch(child._id, { path: childNewPath });
    }

    console.log('[mediaFolders:rename] Success', { folderId: args.folderId, newPath, childrenUpdated: children.length });
  },
});

export const remove = mutation({
  args: {
    folderId: v.id('mediaFolders'),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const folder = await ctx.db.get(args.folderId);
    if (!folder) throw new Error('Folder not found');

    await requirePermission(ctx, user._id, folder.orgId, 'manageMedia');

    await ctx.db.patch(args.folderId, { isDeleted: true, updatedAt: new Date().toISOString() });

    const children = await ctx.db
      .query('mediaFolders')
      .withIndex('by_parentId', (q) => q.eq('parentId', args.folderId))
      .collect();

    for (const child of children) {
      await ctx.db.patch(child._id, { isDeleted: true });
    }

    const files = await ctx.db
      .query('mediaFiles')
      .withIndex('by_folderId', (q) => q.eq('folderId', args.folderId))
      .collect();

    const now = new Date().toISOString();
    for (const file of files) {
      await ctx.db.patch(file._id, { isDeleted: true, deletedAt: now });
    }

    console.log('[mediaFolders:remove] Success', { folderId: args.folderId, childrenDeleted: children.length, filesDeleted: files.length });
  },
});

export const move = mutation({
  args: {
    folderId: v.id('mediaFolders'),
    newParentId: v.optional(v.id('mediaFolders')),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const folder = await ctx.db.get(args.folderId);
    if (!folder) throw new Error('Folder not found');

    await requirePermission(ctx, user._id, folder.orgId, 'manageMedia');

    if (args.newParentId === args.folderId) throw new Error('Cannot move folder to itself');

    if (args.newParentId) {
      const targetParent = await ctx.db.get(args.newParentId);
      if (!targetParent) throw new Error('Target folder not found');
      if (targetParent.orgId !== folder.orgId) throw new Error('Target folder belongs to a different organization');
    }

    const newPath = args.newParentId
      ? `${(await ctx.db.get(args.newParentId))?.path ?? ''}/${folder.name}`
      : `/${folder.name}`;

    await ctx.db.patch(args.folderId, {
      parentId: args.newParentId,
      path: newPath,
      updatedAt: new Date().toISOString(),
    });

    console.log('[mediaFolders:move] Success', { folderId: args.folderId, newPath });
  },
});
