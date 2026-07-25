import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser, requirePermission } from '../shared/helpers';

function getFileType(mimeType: string): 'image' | 'video' | 'document' | 'audio' | 'archive' | 'other' {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument', 'application/vnd.ms-powerpoint', 'application/vnd.ms-excel', 'text/plain'].some(t => mimeType.includes(t))) return 'document';
  if (['application/zip', 'application/x-rar', 'application/x-7z', 'application/gzip', 'application/x-tar'].some(t => mimeType.includes(t))) return 'archive';
  return 'other';
}

function getStorageLimit(plan: string): number {
  switch (plan) {
    case 'starter': return 1024 * 1024 * 1024;
    case 'professional': return 100 * 1024 * 1024 * 1024;
    case 'enterprise': return 1024 * 1024 * 1024 * 1024;
    default: return 1024 * 1024 * 1024;
  }
}

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
    orgId: v.id('organizations'),
    folderId: v.optional(v.id('mediaFolders')),
    name: v.string(),
    mimeType: v.string(),
    fileExtension: v.string(),
    fileSize: v.number(),
    storageId: v.string(),
    thumbnailUrl: v.optional(v.string()),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    await requirePermission(ctx, user._id, args.orgId, 'manageMedia');

    const subscription = await ctx.db
      .query('subscriptions')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .unique();

    const storageLimit = getStorageLimit(subscription?.plan ?? 'starter');

    const existingFiles = await ctx.db
      .query('mediaFiles')
      .withIndex('by_orgId_isDeleted', (q) => q.eq('orgId', args.orgId).eq('isDeleted', false))
      .collect();

    const currentUsage = existingFiles.reduce((sum, f) => sum + f.fileSize, 0);
    if (currentUsage + args.fileSize > storageLimit) {
      throw new Error('Storage limit reached. Upgrade your plan to continue uploading.');
    }

    const fileType = getFileType(args.mimeType);
    const url = await ctx.storage.getUrl(args.storageId);

    const fileRecord = await ctx.db.insert('mediaFiles', {
      orgId: args.orgId,
      folderId: args.folderId,
      name: args.name,
      originalName: args.name,
      fileType,
      mimeType: args.mimeType,
      fileExtension: args.fileExtension,
      fileSize: args.fileSize,
      storageId: args.storageId,
      thumbnailUrl: args.thumbnailUrl,
      displayUrl: url ?? undefined,
      uploadedBy: user._id,
      isDeleted: false,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    });

    if (args.folderId) {
      const folder = await ctx.db.get(args.folderId);
      if (folder) {
        await ctx.db.patch(args.folderId, {
          fileCount: folder.fileCount + 1,
          totalSize: folder.totalSize + args.fileSize,
        });
      }
    }

    return fileRecord;
  },
});

export const rename = mutation({
  args: {
    fileId: v.id('mediaFiles'),
    name: v.string(),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const file = await ctx.db.get(args.fileId);
    if (!file) throw new Error('File not found');

    await requirePermission(ctx, user._id, file.orgId, 'manageMedia');
    await ctx.db.patch(args.fileId, { name: args.name.trim() });
  },
});

export const move = mutation({
  args: {
    fileId: v.id('mediaFiles'),
    newFolderId: v.optional(v.id('mediaFolders')),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const file = await ctx.db.get(args.fileId);
    if (!file) throw new Error('File not found');

    await requirePermission(ctx, user._id, file.orgId, 'manageMedia');

    if (file.folderId) {
      const oldFolder = await ctx.db.get(file.folderId);
      if (oldFolder) {
        await ctx.db.patch(file.folderId, {
          fileCount: Math.max(0, oldFolder.fileCount - 1),
          totalSize: Math.max(0, oldFolder.totalSize - file.fileSize),
        });
      }
    }

    if (args.newFolderId) {
      const newFolder = await ctx.db.get(args.newFolderId);
      if (newFolder) {
        await ctx.db.patch(args.newFolderId, {
          fileCount: newFolder.fileCount + 1,
          totalSize: newFolder.totalSize + file.fileSize,
        });
      }
    }

    await ctx.db.patch(args.fileId, { folderId: args.newFolderId });
  },
});

export const remove = mutation({
  args: {
    fileId: v.id('mediaFiles'),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const file = await ctx.db.get(args.fileId);
    if (!file) throw new Error('File not found');

    await requirePermission(ctx, user._id, file.orgId, 'manageMedia');

    const now = new Date().toISOString();
    await ctx.db.patch(args.fileId, { isDeleted: true, deletedAt: now });

    if (file.folderId) {
      const folder = await ctx.db.get(file.folderId);
      if (folder) {
        await ctx.db.patch(file.folderId, {
          fileCount: Math.max(0, folder.fileCount - 1),
          totalSize: Math.max(0, folder.totalSize - file.fileSize),
        });
      }
    }
  },
});

export const restore = mutation({
  args: {
    fileId: v.id('mediaFiles'),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const file = await ctx.db.get(args.fileId);
    if (!file) throw new Error('File not found');

    await requirePermission(ctx, user._id, file.orgId, 'manageMedia');

    await ctx.db.patch(args.fileId, { isDeleted: false, deletedAt: undefined });

    if (file.folderId) {
      const folder = await ctx.db.get(file.folderId);
      if (folder) {
        await ctx.db.patch(file.folderId, {
          fileCount: folder.fileCount + 1,
          totalSize: folder.totalSize + file.fileSize,
        });
      }
    }
  },
});

export const permanentDelete = mutation({
  args: {
    fileId: v.id('mediaFiles'),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const file = await ctx.db.get(args.fileId);
    if (!file) throw new Error('File not found');

    await requirePermission(ctx, user._id, file.orgId, 'manageMedia');

    try {
      await ctx.storage.delete(file.storageId);
    } catch {}

    await ctx.db.delete(args.fileId);
  },
});

export const toggleFavorite = mutation({
  args: {
    fileId: v.id('mediaFiles'),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    const file = await ctx.db.get(args.fileId);
    if (!file) throw new Error('File not found');

    await requirePermission(ctx, user._id, file.orgId, 'manageMedia');

    await ctx.db.patch(args.fileId, { isFavorite: !file.isFavorite });
    return !file.isFavorite;
  },
});

export const batchMove = mutation({
  args: {
    fileIds: v.array(v.id('mediaFiles')),
    newFolderId: v.optional(v.id('mediaFolders')),
    firebaseUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);
    if (args.fileIds.length === 0) return;

    const firstFile = await ctx.db.get(args.fileIds[0]);
    if (!firstFile) throw new Error('File not found');
    await requirePermission(ctx, user._id, firstFile.orgId, 'manageMedia');

    for (const fileId of args.fileIds) {
      const file = await ctx.db.get(fileId);
      if (!file || file.orgId !== firstFile.orgId) continue;

      if (file.folderId) {
        const oldFolder = await ctx.db.get(file.folderId);
        if (oldFolder) {
          await ctx.db.patch(file.folderId, {
            fileCount: Math.max(0, oldFolder.fileCount - 1),
            totalSize: Math.max(0, oldFolder.totalSize - file.fileSize),
          });
        }
      }

      if (args.newFolderId) {
        const newFolder = await ctx.db.get(args.newFolderId);
        if (newFolder) {
          await ctx.db.patch(args.newFolderId, {
            fileCount: newFolder.fileCount + 1,
            totalSize: newFolder.totalSize + file.fileSize,
          });
        }
      }

      await ctx.db.patch(fileId, { folderId: args.newFolderId });
    }
  },
});
