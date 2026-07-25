import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../lib/convex-auth';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useToast } from '../../lib/toast';
import { cn } from '../../lib/utils';
import type { Id } from '../../../convex/_generated/dataModel';
import {
  FolderPlus, Upload, Search, LayoutGrid, List, ChevronRight, Home,
  Folder, Image, Video, FileText, Music, Archive, File, Trash2,
  Download, MoreVertical, Eye, Pencil, Share2, X, HardDrive,
  ArrowUpDown, Star, ArrowLeft, Move, Copy, Link, Check, Plus,
  FolderInput, Heart,
} from 'lucide-react';

const FILE_ICONS: Record<string, any> = {
  image: Image, video: Video, document: FileText, audio: Music, archive: Archive, other: File,
};
const FILE_COLORS: Record<string, string> = {
  image: 'text-blue-400', video: 'text-violet-400', document: 'text-amber-400',
  audio: 'text-emerald-400', archive: 'text-rose-400', other: 'text-dark-400',
};
const TYPE_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Images', value: 'image' },
  { label: 'Videos', value: 'video' },
  { label: 'Documents', value: 'document' },
  { label: 'Audio', value: 'audio' },
  { label: 'Archives', value: 'archive' },
];
const FAVORITES_FILTER = '__favorites__';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

type ContextMenu = { type: 'file' | 'folder'; id: string; x: number; y: number } | null;

export function DashboardMedia() {
  const { user, currentOrg } = useAuth();
  const { toast } = useToast();
  const fbUid = user?.id;

  // State
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    try { return (localStorage.getItem('media_view') as 'grid' | 'list') ?? 'grid'; } catch { return 'grid'; }
  });
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showTrash, setShowTrash] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenu>(null);
  const [previewFile, setPreviewFile] = useState<any>(null);
  const [moveTarget, setMoveTarget] = useState<string | null>(null);
  const [shareFileId, setShareFileId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Drag state
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);
  const draggedItemRef = useRef<{ type: 'file' | 'folder'; id: string } | null>(null);

  // Pagination cursors
  const [folderCursor, setFolderCursor] = useState<string | undefined>(undefined);
  const [fileCursor, setFileCursor] = useState<string | undefined>(undefined);
  const [allFoldersList, setAllFoldersList] = useState<any[]>([]);
  const [allFilesList, setAllFilesList] = useState<any[]>([]);
  const [hasMoreFolders, setHasMoreFolders] = useState(true);
  const [hasMoreFiles, setHasMoreFiles] = useState(true);
  const folderSentinelRef = useRef<HTMLDivElement>(null);
  const fileSentinelRef = useRef<HTMLDivElement>(null);

  const setView = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    try { localStorage.setItem('media_view', mode); } catch {}
  };

  // ─── QUERIES ────────────────────────────────────────────────────────
  const storage = useQuery(
    api.mediaFiles.queries.getStorageUsage,
    currentOrg ? { orgId: currentOrg.id as Id<'organizations'> } : 'skip'
  );

  const foldersPage = useQuery(
    api.mediaFolders.queries.getPaginated,
    currentOrg ? { orgId: currentOrg.id as Id<'organizations'>, parentId: (currentFolderId as Id<'mediaFolders'>) ?? undefined, limit: 50, cursor: folderCursor } : 'skip'
  );

  const filesPage = useQuery(
    api.mediaFiles.queries.getPaginated,
    currentOrg ? { orgId: currentOrg.id as Id<'organizations'>, folderId: (currentFolderId as Id<'mediaFolders'>) ?? undefined, limit: 50, cursor: fileCursor } : 'skip'
  );

  const allFolders = useQuery(
    api.mediaFolders.queries.getByOrg,
    currentOrg ? { orgId: currentOrg.id as Id<'organizations'> } : 'skip'
  ) ?? [];

  const trashFiles = useQuery(
    api.mediaFiles.queries.getTrash,
    showTrash && currentOrg ? { orgId: currentOrg.id as Id<'organizations'> } : 'skip'
  ) ?? [];

  const trashFolders = useQuery(
    api.mediaFolders.queries.getTrash,
    showTrash && currentOrg ? { orgId: currentOrg.id as Id<'organizations'> } : 'skip'
  ) ?? [];

  const favorites = useQuery(
    api.mediaFiles.queries.getFavorites,
    showFavorites && currentOrg ? { orgId: currentOrg.id as Id<'organizations'> } : 'skip'
  ) ?? [];

  const searchResults = useQuery(
    api.mediaFiles.queries.search,
    currentOrg && search ? { orgId: currentOrg.id as Id<'organizations'>, query: search, fileType: typeFilter && typeFilter !== FAVORITES_FILTER ? typeFilter : undefined } : 'skip'
  );

  const searchFolderResults = useQuery(
    api.mediaFolders.queries.search,
    currentOrg && search ? { orgId: currentOrg.id as Id<'organizations'>, query: search } : 'skip'
  ) ?? [];

  // ─── MUTATIONS ──────────────────────────────────────────────────────
  const createFolder = useMutation(api.mediaFolders.mutations.create);
  const renameFolder = useMutation(api.mediaFolders.mutations.rename);
  const removeFolder = useMutation(api.mediaFolders.mutations.remove);
  const moveFolder = useMutation(api.mediaFolders.mutations.move);
  const renameFile = useMutation(api.mediaFiles.mutations.rename);
  const removeFile = useMutation(api.mediaFiles.mutations.remove);
  const restoreFile = useMutation(api.mediaFiles.mutations.restore);
  const permanentDeleteFile = useMutation(api.mediaFiles.mutations.permanentDelete);
  const toggleFavorite = useMutation(api.mediaFiles.mutations.toggleFavorite);
  const batchMove = useMutation(api.mediaFiles.mutations.batchMove);
  const generateUploadUrl = useMutation(api.mediaFiles.mutations.generateUploadUrl);
  const createFile = useMutation(api.mediaFiles.mutations.create);
  const createShareLink = useMutation(api.mediaShares.mutations.create);
  const revokeShareLink = useMutation(api.mediaShares.mutations.revoke);

  // Reset pagination when folder changes
  useEffect(() => {
    setFolderCursor(undefined);
    setFileCursor(undefined);
    setAllFoldersList([]);
    setAllFilesList([]);
    setHasMoreFolders(true);
    setHasMoreFiles(true);
  }, [currentFolderId, showTrash, showFavorites]);

  // Accumulate paginated results
  useEffect(() => {
    if (foldersPage) {
      if (!folderCursor) {
        setAllFoldersList(foldersPage.items);
      } else {
        setAllFoldersList((prev) => [...prev, ...foldersPage.items]);
      }
      setHasMoreFolders(foldersPage.hasMore);
    }
  }, [foldersPage, folderCursor]);

  useEffect(() => {
    if (filesPage) {
      if (!fileCursor) {
        setAllFilesList(filesPage.items);
      } else {
        setAllFilesList((prev) => [...prev, ...filesPage.items]);
      }
      setHasMoreFiles(filesPage.hasMore);
    }
  }, [filesPage, fileCursor]);

  // Infinite scroll observers
  useEffect(() => {
    if (!hasMoreFolders || showTrash || showFavorites || search) return;
    const el = folderSentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && foldersPage?.nextCursor) {
          setFolderCursor(foldersPage.nextCursor);
        }
      },
      { rootMargin: '200px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMoreFolders, foldersPage?.nextCursor, showTrash, showFavorites, search]);

  useEffect(() => {
    if (!hasMoreFiles || showTrash || showFavorites || search) return;
    const el = fileSentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && filesPage?.nextCursor) {
          setFileCursor(filesPage.nextCursor);
        }
      },
      { rootMargin: '200px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMoreFiles, filesPage?.nextCursor, showTrash, showFavorites, search]);

  // Breadcrumb path
  const breadcrumb = React.useMemo(() => {
    if (!currentFolderId) return [];
    const parts: { id: string; name: string }[] = [];
    let current = allFolders.find((f: any) => f._id === currentFolderId);
    while (current) {
      parts.unshift({ id: current._id, name: current.name });
      current = current.parentId ? allFolders.find((f: any) => f._id === current!.parentId) : undefined;
    }
    return parts;
  }, [currentFolderId, allFolders]);

  // Filtered files
  const displayFiles = React.useMemo(() => {
    if (showFavorites) return favorites;
    if (search && searchResults) return searchResults;
    if (typeFilter) return allFilesList.filter((f: any) => f.fileType === typeFilter);
    return allFilesList;
  }, [allFilesList, showFavorites, favorites, search, searchResults, typeFilter]);

  const displayFolders = React.useMemo(() => {
    if (search) return searchFolderResults;
    return allFoldersList;
  }, [allFoldersList, search, searchFolderResults]);

  // Close context menu on click outside
  useEffect(() => {
    const handler = () => { setContextMenu(null); setDragOverFolder(null); };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  // ─── DRAG HANDLERS ──────────────────────────────────────────────────
  const handleDragStart = useCallback((e: React.DragEvent, type: 'file' | 'folder', id: string) => {
    e.stopPropagation();
    draggedItemRef.current = { type, id };
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  }, []);

  const handleDragOverFolder = useCallback((e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setDragOverFolder(folderId);
  }, []);

  const handleDropOnFolder = useCallback(async (e: React.DragEvent, targetFolderId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverFolder(null);

    const dragged = draggedItemRef.current;
    if (!dragged) return;

    if (dragged.type === 'file') {
      try {
        const file = allFilesList.find((f: any) => f._id === dragged.id);
        if (!file) return;
        // Update old folder
        if (file.folderId) {
          const oldFolder = allFoldersList.find((f: any) => f._id === file.folderId);
          if (oldFolder) {
            // just call move — counts are handled server-side
          }
        }
        await batchMove({ fileIds: [dragged.id as Id<'mediaFiles'>], newFolderId: targetFolderId as Id<'mediaFolders'>, firebaseUid: fbUid });
        toast('File moved', 'success');
      } catch (e: any) {
        toast(e.message || 'Failed to move file', 'error');
      }
    } else if (dragged.type === 'folder' && dragged.id !== targetFolderId) {
      try {
        await moveFolder({ folderId: dragged.id as Id<'mediaFolders'>, newParentId: targetFolderId as Id<'mediaFolders'>, firebaseUid: fbUid });
        toast('Folder moved', 'success');
      } catch (e: any) {
        toast(e.message || 'Failed to move folder', 'error');
      }
    }
    draggedItemRef.current = null;
  }, [allFilesList, allFoldersList, batchMove, moveFolder, toast]);

  const handleDragEnd = useCallback(() => {
    draggedItemRef.current = null;
    setDragOverFolder(null);
  }, []);

  // ─── FILE UPLOAD HANDLER ────────────────────────────────────────────
  const handleFileUpload = useCallback(async (fileList: FileList | File[]) => {
    if (!currentOrg) return;
    const arr = Array.from(fileList);
    for (const file of arr) {
      try {
        const url = await generateUploadUrl();
        const result = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': file.type },
          body: file,
        });
        const { storageId } = await result.json();
        await createFile({
          orgId: currentOrg.id as Id<'organizations'>,
          folderId: (currentFolderId as Id<'mediaFolders'>) ?? undefined,
          name: file.name,
          mimeType: file.type,
          fileExtension: file.name.split('.').pop() ?? '',
          fileSize: file.size,
          storageId,
          firebaseUid: fbUid,
        });
      } catch (e: any) {
        toast(`Failed to upload ${file.name}: ${e.message}`, 'error');
      }
    }
    toast(`${arr.length} file(s) uploaded`, 'success');
    setShowUpload(false);
  }, [currentOrg, currentFolderId, generateUploadUrl, createFile, toast]);

  // ─── SHARE HANDLER ──────────────────────────────────────────────────
  const handleShare = useCallback(async (fileId: string) => {
    try {
      const token = await createShareLink({
        fileId: fileId as Id<'mediaFiles'>,
        allowDownload: true,
        firebaseUid: fbUid,
      });
      const url = `${window.location.origin}/share/${token}`;
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      toast('Share link copied to clipboard', 'success');
    } catch (e: any) {
      toast(e.message || 'Failed to create share link', 'error');
    }
  }, [createShareLink, toast]);

  // ─── MOVE FILE HANDLER ──────────────────────────────────────────────
  const handleMoveFile = useCallback(async (fileId: string, targetFolderId: string | null) => {
    try {
      await batchMove({
        fileIds: [fileId as Id<'mediaFiles'>],
        newFolderId: targetFolderId ? targetFolderId as Id<'mediaFolders'> : undefined,
        firebaseUid: fbUid,
      });
      toast('File moved', 'success');
      setMoveTarget(null);
    } catch (e: any) {
      toast(e.message || 'Failed to move file', 'error');
    }
  }, [batchMove, toast]);

  // ─── STORAGE FULL CHECK ──────────────────────────────────────────────
  if (storage?.isFull) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Media Center</h1>
        </div>
        <Card>
          <CardContent className="py-16 text-center">
            <div className="h-16 w-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <HardDrive className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-serif text-white mb-2">Storage Full</h3>
            <p className="text-sm text-dark-400 max-w-md mx-auto mb-6">
              You've used your {storage.plan === 'starter' ? 'free 1 GB' : storage.plan === 'professional' ? '100 GB' : 'storage'} of storage.
              Upgrade to continue uploading files.
            </p>
            <div className="mb-6">
              <div className="h-3 bg-dark-800 rounded-full overflow-hidden max-w-xs mx-auto">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '100%' }} />
              </div>
              <p className="text-xs text-dark-500 mt-2">{formatBytes(storage.totalSize)} / {formatBytes(storage.storageLimit)}</p>
            </div>
            <Button variant="primary" onClick={() => window.location.href = '/dashboard/billing'}>Upgrade Plan</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-serif text-white tracking-tight mb-2">
            {showTrash ? 'Trash' : showFavorites ? 'Favorites' : 'Media Center'}
          </h1>
          <p className="text-dark-400 text-sm">
            {showTrash
              ? 'Deleted files are kept for 30 days.'
              : showFavorites
                ? "Files you've marked as favorites."
                : 'Organize posters, videos, logos, sponsor materials, and promotional content.'}
          </p>
        </div>
        {!showTrash && !showFavorites && (
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => { setShowTrash(true); setShowFavorites(false); }} className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" /> Trash
            </Button>
            <Button variant="outline" onClick={() => { setShowFavorites(true); setShowTrash(false); }} className="flex items-center gap-2">
              <Heart className="h-4 w-4" /> Favorites
            </Button>
            <Button variant="outline" onClick={() => setShowCreateFolder(true)} className="flex items-center gap-2">
              <FolderPlus className="h-4 w-4" /> New Folder
            </Button>
            <Button onClick={() => setShowUpload(true)} className="flex items-center gap-2">
              <Upload className="h-4 w-4" /> Upload
            </Button>
          </div>
        )}
        {(showTrash || showFavorites) && (
          <Button variant="secondary" onClick={() => { setShowTrash(false); setShowFavorites(false); }} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Media
          </Button>
        )}
      </div>

      {/* Storage Card */}
      {!showTrash && !showFavorites && storage && (
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-white">Storage</span>
                  <span className="text-xs text-dark-400">{formatBytes(storage.totalSize)} / {formatBytes(storage.storageLimit)}</span>
                </div>
                <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", storage.percentage > 80 ? 'bg-red-500' : storage.percentage > 50 ? 'bg-amber-500' : 'bg-gold-500')}
                    style={{ width: `${Math.min(100, storage.percentage)}%` }}
                  />
                </div>
              </div>
              <div className="flex gap-6 text-xs text-dark-400 shrink-0">
                <span>{storage.fileCount} files</span>
                <span>{storage.folderCount} folders</span>
                <span className="capitalize">{storage.plan}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Breadcrumb */}
      {!showTrash && !showFavorites && (
        <div className="flex items-center gap-1.5 text-xs flex-wrap">
          <button onClick={() => { setCurrentFolderId(null); setSearch(''); }} className="flex items-center gap-1 text-dark-500 hover:text-gold-500 transition-colors">
            <Home className="h-3 w-3" /> Media Center
          </button>
          {breadcrumb.map((crumb) => (
            <React.Fragment key={crumb.id}>
              <ChevronRight className="h-3 w-3 text-dark-600" />
              <button onClick={() => { setCurrentFolderId(crumb.id); setSearch(''); }} className="text-dark-400 hover:text-gold-500 transition-colors font-medium">
                {crumb.name}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Toolbar */}
      {!showTrash && !showFavorites && (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 p-1 bg-dark-900/50 rounded-lg border border-white/5">
            <Button variant="ghost" size="icon" className={cn("h-8 w-8", viewMode === 'grid' ? 'bg-gold-500/10 text-gold-400' : 'text-dark-400')} onClick={() => setView('grid')}><LayoutGrid className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className={cn("h-8 w-8", viewMode === 'list' ? 'bg-gold-500/10 text-gold-400' : 'text-dark-400')} onClick={() => setView('list')}><List className="h-4 w-4" /></Button>
          </div>
          <div className="flex-1 max-w-md w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files and folders..." className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-dark-600 focus:outline-none focus:border-gold-500/50" />
            </div>
          </div>
          <div className="flex gap-1.5">
            {TYPE_FILTERS.map((f) => (
              <button key={f.value} onClick={() => setTypeFilter(f.value)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors", typeFilter === f.value ? "bg-gold-500/10 text-gold-500 border border-gold-500/20" : "text-dark-400 hover:text-white border border-transparent")}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty State — Library */}
      {!showTrash && !showFavorites && displayFolders.length === 0 && displayFiles.length === 0 && !search && (
        <Card>
          <CardContent className="py-20 text-center">
            <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
              <Folder className="h-10 w-10 text-dark-600" />
            </div>
            <h3 className="text-xl font-serif text-white mb-2">Your Media Library is Empty</h3>
            <p className="text-sm text-dark-400 max-w-md mx-auto mb-6">
              Store posters, videos, sponsor logos, award graphics, livestream assets, and promotional content here.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => setShowCreateFolder(true)} className="flex items-center gap-2">
                <FolderPlus className="h-4 w-4" /> Create Folder
              </Button>
              <Button onClick={() => setShowUpload(true)} className="flex items-center gap-2">
                <Upload className="h-4 w-4" /> Upload Files
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State — Favorites */}
      {showFavorites && favorites.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <Heart className="h-12 w-12 text-dark-600 mx-auto mb-4" />
            <h3 className="text-lg font-serif text-white mb-2">No Favorites Yet</h3>
            <p className="text-sm text-dark-400">Star files to add them to your favorites.</p>
          </CardContent>
        </Card>
      )}

      {/* Empty State — Trash */}
      {showTrash && trashFiles.length === 0 && trashFolders.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <Trash2 className="h-12 w-12 text-dark-600 mx-auto mb-4" />
            <h3 className="text-lg font-serif text-white mb-2">Trash is Empty</h3>
            <p className="text-sm text-dark-400">No deleted files or folders.</p>
          </CardContent>
        </Card>
      )}

      {/* Grid View */}
      {!showTrash && !showFavorites && viewMode === 'grid' && (displayFolders.length > 0 || displayFiles.length > 0) && (
        <div className="space-y-6">
          {displayFolders.length > 0 && (
            <div>
              <p className="text-[10px] text-dark-500 uppercase tracking-widest mb-3">Folders</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {displayFolders.map((folder: any) => (
                  <div
                    key={folder._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'folder', folder._id)}
                    onDragOver={(e) => handleDragOverFolder(e, folder._id)}
                    onDrop={(e) => handleDropOnFolder(e, folder._id)}
                    onDragEnd={handleDragEnd}
                  >
                    <button
                      onClick={() => { setCurrentFolderId(folder._id); setSearch(''); }}
                      onContextMenu={(e) => { e.preventDefault(); setContextMenu({ type: 'folder', id: folder._id, x: e.clientX, y: e.clientY }); }}
                      className={cn(
                        "w-full text-left rounded-2xl border transition-all group cursor-pointer",
                        dragOverFolder === folder._id
                          ? "border-gold-500 bg-gold-500/10 scale-[1.02]"
                          : "border-white/5 hover:border-gold-500/30 bg-white/[0.02]"
                      )}
                    >
                      <div className="pt-4 pb-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: (folder.color || '#c68a35') + '20' }}>
                            <Folder className="h-5 w-5" style={{ color: folder.color || '#c68a35' }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{folder.name}</p>
                            <p className="text-[10px] text-dark-500">{folder.fileCount} files</p>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {displayFiles.length > 0 && (
            <div>
              <p className="text-[10px] text-dark-500 uppercase tracking-widest mb-3">Files</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {displayFiles.map((file: any) => {
                  const Icon = FILE_ICONS[file.fileType] || File;
                  const color = FILE_COLORS[file.fileType] || 'text-dark-400';
                  return (
                    <div
                      key={file._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, 'file', file._id)}
                      onDragEnd={handleDragEnd}
                    >
                      <Card className="p-0 overflow-hidden group hover:border-gold-500/30 transition-all cursor-pointer" onClick={() => setPreviewFile(file)} onContextMenu={(e) => { e.preventDefault(); setContextMenu({ type: 'file', id: file._id, x: e.clientX, y: e.clientY }); }}>
                        <div className="aspect-square relative flex items-center justify-center bg-dark-800">
                          {file.fileType === 'image' && file.displayUrl ? (
                            <img src={file.displayUrl} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                          ) : (
                            <Icon className={cn("h-10 w-10", color)} />
                          )}
                          {/* Favorite star */}
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleFavorite({ fileId: file._id, firebaseUid: fbUid }); }}
                            className={cn(
                              "absolute top-2 left-2 h-7 w-7 flex items-center justify-center rounded-lg transition-all",
                              file.isFavorite ? "bg-gold-500/20 text-gold-400" : "bg-black/40 text-dark-400 opacity-0 group-hover:opacity-100"
                            )}
                          >
                            <Star className={cn("h-3.5 w-3.5", file.isFavorite && "fill-current")} />
                          </button>
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={(e) => { e.stopPropagation(); setContextMenu({ type: 'file', id: file._id, x: e.clientX, y: e.clientY }); }} className="h-7 w-7 flex items-center justify-center rounded-lg bg-black/60 text-white hover:bg-black/80">
                              <MoreVertical className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-xs font-medium text-white truncate">{file.name}</p>
                          <p className="text-[10px] text-dark-500">{formatBytes(file.fileSize)}</p>
                        </div>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Infinite scroll sentinels */}
          {hasMoreFolders && <div ref={folderSentinelRef} className="h-4" />}
          {hasMoreFiles && <div ref={fileSentinelRef} className="h-4" />}
        </div>
      )}

      {/* List View */}
      {!showTrash && !showFavorites && viewMode === 'list' && (displayFolders.length > 0 || displayFiles.length > 0) && (
        <Card>
          <CardContent className="pt-0 pb-0">
            <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-white/5 text-[10px] text-dark-500 uppercase tracking-widest font-bold">
              <div className="col-span-5">Name</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-1"></div>
            </div>
            {displayFolders.map((folder: any) => (
              <div
                key={folder._id}
                onClick={() => { setCurrentFolderId(folder._id); setSearch(''); }}
                onDragOver={(e) => handleDragOverFolder(e, folder._id)}
                onDrop={(e) => handleDropOnFolder(e, folder._id)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "grid grid-cols-12 gap-4 px-4 py-3 border-b border-white/5 hover:bg-white/[0.02] cursor-pointer items-center transition-colors",
                  dragOverFolder === folder._id && "bg-gold-500/5 border-gold-500/20"
                )}
              >
                <div className="col-span-5 flex items-center gap-3 min-w-0">
                  <Folder className="h-4 w-4 shrink-0" style={{ color: folder.color || '#c68a35' }} />
                  <span className="text-sm text-white truncate">{folder.name}</span>
                </div>
                <div className="col-span-2 text-xs text-dark-400">Folder</div>
                <div className="col-span-2 text-xs text-dark-400">{folder.fileCount} files</div>
                <div className="col-span-2 text-xs text-dark-400">{new Date(folder.createdAt).toLocaleDateString()}</div>
                <div className="col-span-1"></div>
              </div>
            ))}
            {displayFiles.map((file: any) => {
              const Icon = FILE_ICONS[file.fileType] || File;
              return (
                <div
                  key={file._id}
                  onClick={() => setPreviewFile(file)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'file', file._id)}
                  onDragEnd={handleDragEnd}
                  className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-white/5 hover:bg-white/[0.02] cursor-pointer items-center"
                >
                  <div className="col-span-5 flex items-center gap-3 min-w-0">
                    <Icon className={cn("h-4 w-4 shrink-0", FILE_COLORS[file.fileType])} />
                    <span className="text-sm text-white truncate">{file.name}</span>
                    {file.isFavorite && <Star className="h-3 w-3 text-gold-400 fill-current shrink-0" />}
                  </div>
                  <div className="col-span-2 text-xs text-dark-400 capitalize">{file.fileType}</div>
                  <div className="col-span-2 text-xs text-dark-400">{formatBytes(file.fileSize)}</div>
                  <div className="col-span-2 text-xs text-dark-400">{new Date(file.createdAt).toLocaleDateString()}</div>
                  <div className="col-span-1 text-right">
                    <button onClick={(e) => { e.stopPropagation(); setContextMenu({ type: 'file', id: file._id, x: e.clientX, y: e.clientY }); }} className="h-7 w-7 inline-flex items-center justify-center rounded-lg text-dark-400 hover:text-white hover:bg-white/5">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
            {hasMoreFolders && <div ref={folderSentinelRef} className="h-4" />}
            {hasMoreFiles && <div ref={fileSentinelRef} className="h-4" />}
          </CardContent>
        </Card>
      )}

      {/* Favorites Grid View */}
      {showFavorites && viewMode === 'grid' && favorites.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {favorites.map((file: any) => {
            const Icon = FILE_ICONS[file.fileType] || File;
            const color = FILE_COLORS[file.fileType] || 'text-dark-400';
            return (
              <Card key={file._id} className="p-0 overflow-hidden group hover:border-gold-500/30 transition-all cursor-pointer" onClick={() => setPreviewFile(file)}>
                <div className="aspect-square relative flex items-center justify-center bg-dark-800">
                  {file.fileType === 'image' && file.displayUrl ? (
                    <img src={file.displayUrl} alt="" className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <Icon className={cn("h-10 w-10", color)} />
                  )}
                  <button onClick={(e) => { e.stopPropagation(); toggleFavorite({ fileId: file._id, firebaseUid: fbUid }); }} className="absolute top-2 left-2 h-7 w-7 flex items-center justify-center rounded-lg bg-gold-500/20 text-gold-400">
                    <Star className="h-3.5 w-3.5 fill-current" />
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium text-white truncate">{file.name}</p>
                  <p className="text-[10px] text-dark-500">{formatBytes(file.fileSize)}</p>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Trash List */}
      {showTrash && (
        <div className="space-y-3">
          {[...trashFolders.map((f: any) => ({ ...f, _trashType: 'folder' })), ...trashFiles.map((f: any) => ({ ...f, _trashType: 'file' }))].map((item: any) => (
            <Card key={item._id}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item._trashType === 'folder' ? <Folder className="h-5 w-5 text-dark-400" /> : <File className="h-5 w-5 text-dark-400" />}
                    <div>
                      <p className="text-sm text-white">{item.name}</p>
                      <p className="text-xs text-dark-500">{item._trashType === 'folder' ? 'Folder' : formatBytes(item.fileSize)} · Deleted {item.deletedAt ? new Date(item.deletedAt).toLocaleDateString() : ''}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {item._trashType === 'file' && (
                      <Button variant="ghost" size="sm" onClick={async () => { await restoreFile({ fileId: item._id, firebaseUid: fbUid }); toast('Restored', 'success'); }}>
                        Restore
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={async () => {
                      if (confirm('Permanently delete?')) {
                        if (item._trashType === 'file') await permanentDeleteFile({ fileId: item._id, firebaseUid: fbUid });
                        toast('Permanently deleted', 'success');
                      }
                    }} className="text-rose-400 hover:text-rose-300">
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ─── CONTEXT MENU ────────────────────────────────────────────── */}
      {contextMenu && (
        <div style={{ position: 'fixed', left: contextMenu.x, top: contextMenu.y, zIndex: 100 }} className="w-48 bg-dark-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          {contextMenu.type === 'file' ? (
            <>
              {previewFile?.displayUrl && <button onClick={() => { setPreviewFile(displayFiles.find((f: any) => f._id === contextMenu.id)); setContextMenu(null); }} className="w-full px-4 py-2.5 text-xs text-white hover:bg-white/5 flex items-center gap-2"><Eye className="h-3.5 w-3.5" /> Preview</button>}
              <button onClick={() => { const f = displayFiles.find((x: any) => x._id === contextMenu.id); if (f?.displayUrl) { const a = document.createElement('a'); a.href = f.displayUrl; a.download = f.name; a.click(); } setContextMenu(null); }} className="w-full px-4 py-2.5 text-xs text-white hover:bg-white/5 flex items-center gap-2"><Download className="h-3.5 w-3.5" /> Download</button>
              <button onClick={() => { handleShare(contextMenu.id); setContextMenu(null); }} className="w-full px-4 py-2.5 text-xs text-white hover:bg-white/5 flex items-center gap-2"><Link className="h-3.5 w-3.5" /> Share Link</button>
              <button onClick={() => { setMoveTarget(contextMenu.id); setContextMenu(null); }} className="w-full px-4 py-2.5 text-xs text-white hover:bg-white/5 flex items-center gap-2"><FolderInput className="h-3.5 w-3.5" /> Move to Folder</button>
              <button onClick={() => { toggleFavorite({ fileId: contextMenu.id as Id<'mediaFiles'>, firebaseUid: fbUid }); setContextMenu(null); }} className="w-full px-4 py-2.5 text-xs text-white hover:bg-white/5 flex items-center gap-2"><Star className="h-3.5 w-3.5" /> {displayFiles.find((x: any) => x._id === contextMenu.id)?.isFavorite ? 'Unfavorite' : 'Favorite'}</button>
              <button onClick={() => { const name = prompt('Rename file:', displayFiles.find((x: any) => x._id === contextMenu.id)?.name); if (name) renameFile({ fileId: contextMenu.id as Id<'mediaFiles'>, name, firebaseUid: fbUid }); setContextMenu(null); }} className="w-full px-4 py-2.5 text-xs text-white hover:bg-white/5 flex items-center gap-2"><Pencil className="h-3.5 w-3.5" /> Rename</button>
              <button onClick={() => { removeFile({ fileId: contextMenu.id as Id<'mediaFiles'>, firebaseUid: fbUid }); toast('Moved to trash', 'success'); setContextMenu(null); }} className="w-full px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
            </>
          ) : (
            <>
              <button onClick={() => { const name = prompt('Rename folder:', allFolders.find((x: any) => x._id === contextMenu.id)?.name); if (name) renameFolder({ folderId: contextMenu.id as Id<'mediaFolders'>, name, firebaseUid: fbUid }); setContextMenu(null); }} className="w-full px-4 py-2.5 text-xs text-white hover:bg-white/5 flex items-center gap-2"><Pencil className="h-3.5 w-3.5" /> Rename</button>
              <button onClick={() => { removeFolder({ folderId: contextMenu.id as Id<'mediaFolders'>, firebaseUid: fbUid }); toast('Deleted', 'success'); setContextMenu(null); }} className="w-full px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
            </>
          )}
        </div>
      )}

      {/* ─── CREATE FOLDER MODAL ────────────────────────────────────── */}
      <CreateFolderModal show={showCreateFolder} onClose={() => setShowCreateFolder(false)} orgId={currentOrg?.id} parentId={currentFolderId} createFolder={createFolder} firebaseUid={fbUid} />

      {/* ─── UPLOAD MODAL ───────────────────────────────────────────── */}
      <UploadModal show={showUpload} onClose={() => setShowUpload(false)} onUpload={handleFileUpload} storage={storage} />

      {/* ─── MOVE TO FOLDER MODAL ──────────────────────────────────── */}
      {moveTarget && (
        <MoveToFolderModal
          allFolders={allFolders}
          currentFolderId={currentFolderId}
          onSelect={async (folderId) => { await handleMoveFile(moveTarget, folderId); }}
          onClose={() => setMoveTarget(null)}
        />
      )}

      {/* ─── FILE PREVIEW ───────────────────────────────────────────── */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setPreviewFile(null)}>
          <div className="max-w-4xl max-h-[90vh] w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <h3 className="text-white font-medium truncate">{previewFile.name}</h3>
                <button onClick={() => { toggleFavorite({ fileId: previewFile._id, firebaseUid: fbUid }); setPreviewFile({ ...previewFile, isFavorite: !previewFile.isFavorite }); }} className={cn("h-7 w-7 flex items-center justify-center rounded-lg shrink-0", previewFile.isFavorite ? "bg-gold-500/20 text-gold-400" : "bg-white/10 text-dark-400 hover:text-white")}>
                  <Star className={cn("h-4 w-4", previewFile.isFavorite && "fill-current")} />
                </button>
              </div>
              <button onClick={() => setPreviewFile(null)} className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20">
                <X className="h-4 w-4" />
              </button>
            </div>
            {previewFile.fileType === 'image' && previewFile.displayUrl ? (
              <img src={previewFile.displayUrl} alt="" className="w-full rounded-xl object-contain max-h-[80vh]" referrerPolicy="no-referrer" />
            ) : previewFile.fileType === 'video' && previewFile.displayUrl ? (
              <video src={previewFile.displayUrl} controls className="w-full rounded-xl max-h-[80vh]" />
            ) : (
              <div className="aspect-video bg-dark-900 rounded-xl flex items-center justify-center">
                <p className="text-dark-400">Preview not available for this file type</p>
              </div>
            )}
            <div className="flex justify-center gap-3 mt-4">
              {previewFile.displayUrl && (
                <Button variant="outline" onClick={() => { const a = document.createElement('a'); a.href = previewFile.displayUrl; a.download = previewFile.name; a.click(); }} className="flex items-center gap-2">
                  <Download className="h-4 w-4" /> Download
                </Button>
              )}
              <Button variant="outline" onClick={() => handleShare(previewFile._id)} className="flex items-center gap-2">
                <Link className="h-4 w-4" /> Share
              </Button>
              <Button variant="outline" onClick={() => { setMoveTarget(previewFile._id); setPreviewFile(null); }} className="flex items-center gap-2">
                <FolderInput className="h-4 w-4" /> Move
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CREATE FOLDER MODAL ──────────────────────────────────────────────
function CreateFolderModal({ show, onClose, orgId, parentId, createFolder, firebaseUid }: any) {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#c68a35');
  const [isCreating, setIsCreating] = useState(false);

  if (!show) return null;

  const handleCreate = async () => {
    if (!name.trim() || !orgId) return;
    setIsCreating(true);
    try {
      await createFolder({
        orgId,
        name: name.trim(),
        description: description || undefined,
        color,
        parentId: parentId ?? undefined,
        firebaseUid,
      });
      toast('Folder created', 'success');
      onClose();
      setName('');
      setDescription('');
    } catch (e: any) {
      toast(e.message || 'Failed to create folder', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 bg-dark-900 border border-white/10 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-lg font-bold text-white">Create New Folder</h2>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 text-dark-400 hover:text-white"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-white block mb-2">Folder Name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} placeholder="My Folder" className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-dark-600 focus:outline-none focus:border-gold-500/50" autoFocus />
          </div>
          <div>
            <label className="text-sm font-medium text-white block mb-2">Description (optional)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-dark-600 focus:outline-none focus:border-gold-500/50 resize-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-white block mb-2">Color</label>
            <div className="flex gap-2">
              {['#c68a35', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#f59e0b', '#ec4899', '#6366f1'].map((c) => (
                <button key={c} onClick={() => setColor(c)} className={cn("h-8 w-8 rounded-lg transition-all", color === c ? "ring-2 ring-white ring-offset-2 ring-offset-dark-900 scale-110" : "hover:scale-105")} style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-6 border-t border-white/5">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleCreate} disabled={!name.trim() || isCreating} className="flex items-center gap-2">
            {isCreating ? <span className="h-4 w-4 border-2 border-dark-950 border-t-transparent rounded-full animate-spin" /> : <FolderPlus className="h-4 w-4" />}
            Create Folder
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── MOVE TO FOLDER MODAL ─────────────────────────────────────────────
function MoveToFolderModal({ allFolders, currentFolderId, onSelect, onClose }: {
  allFolders: any[];
  currentFolderId: string | null;
  onSelect: (folderId: string | null) => void;
  onClose: () => void;
}) {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  // Build tree structure
  const rootFolders = allFolders.filter((f: any) => !f.parentId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 bg-dark-900 border border-white/10 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-lg font-bold text-white">Move to Folder</h2>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 text-dark-400 hover:text-white"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-4 max-h-80 overflow-y-auto">
          {/* Root option */}
          <button
            onClick={() => setSelectedFolder(null)}
            className={cn(
              "w-full px-4 py-3 rounded-xl text-left text-sm flex items-center gap-3 transition-colors",
              selectedFolder === null ? "bg-gold-500/10 text-gold-400 border border-gold-500/20" : "text-dark-400 hover:bg-white/5"
            )}
          >
            <Home className="h-4 w-4" />
            <span>Media Center (root)</span>
          </button>

          {rootFolders.map((folder: any) => {
            if (folder._id === currentFolderId) return null;
            return (
              <button
                key={folder._id}
                onClick={() => setSelectedFolder(folder._id)}
                className={cn(
                  "w-full px-4 py-3 rounded-xl text-left text-sm flex items-center gap-3 transition-colors mt-1",
                  selectedFolder === folder._id ? "bg-gold-500/10 text-gold-400 border border-gold-500/20" : "text-dark-400 hover:bg-white/5"
                )}
              >
                <Folder className="h-4 w-4 shrink-0" style={{ color: folder.color || '#c68a35' }} />
                <span className="truncate">{folder.name}</span>
                <span className="text-[10px] text-dark-600 ml-auto shrink-0">{folder.fileCount} files</span>
              </button>
            );
          })}
        </div>
        <div className="flex justify-end gap-3 p-6 border-t border-white/5">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={() => onSelect(selectedFolder)} className="flex items-center gap-2">
            <Move className="h-4 w-4" /> Move Here
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── UPLOAD MODAL ─────────────────────────────────────────────────────
function UploadModal({ show, onClose, onUpload, storage }: any) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!show) return null;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg mx-4 bg-dark-900 border border-white/10 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-lg font-bold text-white">Upload Files</h2>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 text-dark-400 hover:text-white"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-6">
          {/* Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn("border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all", isDragging ? "border-gold-500 bg-gold-500/5" : "border-white/10 hover:border-white/20")}
          >
            <Upload className="h-10 w-10 text-dark-500 mx-auto mb-3" />
            <p className="text-sm text-white mb-1">Drag & drop files here, or click to browse</p>
            <p className="text-xs text-dark-500">Images, videos, documents, audio, archives</p>
          </div>
          <input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} className="hidden" accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar,.txt" />

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
              {selectedFiles.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-2 min-w-0">
                    <File className="h-4 w-4 text-dark-400 shrink-0" />
                    <span className="text-xs text-white truncate">{file.name}</span>
                    <span className="text-[10px] text-dark-500 shrink-0">{formatBytes(file.size)}</span>
                  </div>
                  <button onClick={() => removeFile(i)} className="h-5 w-5 flex items-center justify-center rounded text-dark-400 hover:text-rose-400">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 p-6 border-t border-white/5">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={() => { onUpload(selectedFiles); setSelectedFiles([]); }} disabled={selectedFiles.length === 0} className="flex items-center gap-2">
            <Upload className="h-4 w-4" /> Upload {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
          </Button>
        </div>
      </div>
    </div>
  );
}
