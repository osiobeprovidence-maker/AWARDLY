import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Users,
  Plus,
  Search,
  Trash2,
  Edit3,
  ExternalLink,
  Filter,
  ChevronDown,
  AlertTriangle,
  Twitter,
  Instagram,
  Globe,
  BarChart3,
  User,
  Eye,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { ImageUpload } from '../../components/ImageUpload';
import { useToast } from '../../lib/toast';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { mockNominees, mockCategories } from '../../data';
import { Nominee } from '../../types';

type SortKey = 'name' | 'votes' | 'date';
type FilterStatus = 'all' | 'active' | 'pending' | 'inactive';

interface NomineeWithMeta extends Nominee {
  bio?: string;
  twitter?: string;
  instagram?: string;
  website?: string;
  status: 'active' | 'pending' | 'inactive';
  addedAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  inactive: 'bg-dark-700 text-dark-400 border-white/5',
};

function mapNominees(raw: Nominee[]): NomineeWithMeta[] {
  return raw.map((n, i) => ({
    ...n,
    bio:
      n.description ||
      'Distinguished nominee recognized for outstanding contributions and excellence in their field.',
    twitter: i % 3 === 0 ? '@nominee' : undefined,
    instagram: i % 2 === 0 ? '@nominee' : undefined,
    website: i % 4 === 0 ? 'https://nominee.com' : undefined,
    status: (['active', 'pending', 'active', 'active', 'pending', 'inactive'] as const)[i % 6],
    addedAt: new Date(Date.now() - i * 86400000).toISOString(),
  }));
}

export function ManageNominees() {
  const { eventId, categoryId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const category = mockCategories.find(c => c.id === categoryId) || mockCategories[0];

  const [nominees, setNominees] = React.useState<NomineeWithMeta[]>(() =>
    mapNominees(mockNominees.filter(n => n.categoryId === categoryId))
  );
  const [search, setSearch] = React.useState('');
  const [sort, setSort] = React.useState<SortKey>('name');
  const [filterStatus, setFilterStatus] = React.useState<FilterStatus>('all');
  const [showModal, setShowModal] = React.useState(false);
  const [editingNominee, setEditingNominee] = React.useState<NomineeWithMeta | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [showSortDropdown, setShowSortDropdown] = React.useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = React.useState(false);

  const filtered = React.useMemo(() => {
    let list = [...nominees];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(n => n.name.toLowerCase().includes(q));
    }

    if (filterStatus !== 'all') {
      list = list.filter(n => n.status === filterStatus);
    }

    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'votes') list.sort((a, b) => b.voteCount - a.voteCount);
    else if (sort === 'date') list.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());

    return list;
  }, [nominees, search, sort, filterStatus]);

  const openAddModal = () => {
    setEditingNominee(null);
    setShowModal(true);
  };

  const openEditModal = (nominee: NomineeWithMeta) => {
    setEditingNominee(nominee);
    setShowModal(true);
  };

  const handleSave = (data: {
    name: string;
    bio: string;
    imageUrl?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
    status: 'active' | 'pending' | 'inactive';
  }) => {
    if (editingNominee) {
      setNominees(prev =>
        prev.map(n =>
          n.id === editingNominee.id
            ? { ...n, ...data }
            : n
        )
      );
      toast('Nominee updated successfully', 'success');
    } else {
      const newNominee: NomineeWithMeta = {
        id: `nom_${Date.now()}`,
        categoryId: categoryId || '',
        name: data.name,
        voteCount: 0,
        imageUrl: data.imageUrl,
        bio: data.bio,
        twitter: data.twitter,
        instagram: data.instagram,
        website: data.website,
        status: data.status,
        addedAt: new Date().toISOString(),
      };
      setNominees(prev => [newNominee, ...prev]);
      toast('Nominee added successfully', 'success');
    }
    setShowModal(false);
    setEditingNominee(null);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setNominees(prev => prev.filter(n => n.id !== deleteId));
    setDeleteId(null);
    toast('Nominee deleted', 'success');
  };

  const handleViewProfile = (name: string) => {
    toast(`Viewing profile for ${name} — coming soon`, 'info');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full bg-white/5"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-gold-500" />
              <span className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">
                Management Hub
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-white tracking-tight italic">
              {category.name}{' '}
              <span className="text-dark-500 not-italic">/ Nominees</span>
            </h1>
          </div>
        </div>
        <Button className="shadow-lg shadow-gold-500/20" onClick={openAddModal}>
          <Plus className="h-4 w-4 mr-2" /> Add Nominee
        </Button>
      </div>

      <Breadcrumbs />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
          <Input
            placeholder="Search nominees..."
            className="pl-10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="relative">
          <Button
            variant="outline"
            className="border-white/10 hover:bg-white/5 w-full sm:w-auto"
            onClick={() => {
              setShowSortDropdown(!showSortDropdown);
              setShowFilterDropdown(false);
            }}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Sort: {sort === 'name' ? 'Name' : sort === 'votes' ? 'Votes' : 'Date Added'}
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
          {showSortDropdown && (
            <div className="absolute top-full mt-2 right-0 z-50 w-44 rounded-xl bg-dark-800 border border-white/10 shadow-2xl overflow-hidden">
              {(['name', 'votes', 'date'] as SortKey[]).map(s => (
                <button
                  key={s}
                  className={`block w-full text-left px-4 py-3 text-sm transition-colors ${
                    sort === s
                      ? 'bg-gold-500/10 text-gold-500'
                      : 'text-dark-300 hover:bg-white/5'
                  }`}
                  onClick={() => {
                    setSort(s);
                    setShowSortDropdown(false);
                  }}
                >
                  {s === 'name' ? 'Name' : s === 'votes' ? 'Votes' : 'Date Added'}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <Button
            variant="outline"
            className="border-white/10 hover:bg-white/5 w-full sm:w-auto"
            onClick={() => {
              setShowFilterDropdown(!showFilterDropdown);
              setShowSortDropdown(false);
            }}
          >
            <Filter className="h-4 w-4 mr-2" />
            {filterStatus === 'all'
              ? 'All'
              : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
          {showFilterDropdown && (
            <div className="absolute top-full mt-2 right-0 z-50 w-44 rounded-xl bg-dark-800 border border-white/10 shadow-2xl overflow-hidden">
              {(['all', 'active', 'pending', 'inactive'] as FilterStatus[]).map(s => (
                <button
                  key={s}
                  className={`block w-full text-left px-4 py-3 text-sm transition-colors ${
                    filterStatus === s
                      ? 'bg-gold-500/10 text-gold-500'
                      : 'text-dark-300 hover:bg-white/5'
                  }`}
                  onClick={() => {
                    setFilterStatus(s);
                    setShowFilterDropdown(false);
                  }}
                >
                  {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Nominee Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((nominee, i) => (
            <motion.div
              key={nominee.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-dark-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-gold-500/30 transition-all"
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-xl overflow-hidden border border-white/10 shrink-0">
                    <img
                      src={
                        nominee.imageUrl ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${nominee.name}`
                      }
                      className="w-full h-full object-cover"
                      alt={nominee.name}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-medium truncate">{nominee.name}</h3>
                      <span
                        className={`shrink-0 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                          STATUS_STYLES[nominee.status]
                        }`}
                      >
                        {nominee.status}
                      </span>
                    </div>
                    <p className="text-xs text-dark-500 mt-1 line-clamp-2">{nominee.bio}</p>
                    <div className="flex items-center gap-3 mt-2">
                      {nominee.twitter && (
                        <Twitter className="h-3.5 w-3.5 text-dark-500 hover:text-sky-400 transition-colors cursor-pointer" />
                      )}
                      {nominee.instagram && (
                        <Instagram className="h-3.5 w-3.5 text-dark-500 hover:text-pink-400 transition-colors cursor-pointer" />
                      )}
                      {nominee.website && (
                        <Globe className="h-3.5 w-3.5 text-dark-500 hover:text-gold-500 transition-colors cursor-pointer" />
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-serif text-gold-500">
                      {nominee.voteCount.toLocaleString()}
                    </div>
                    <div className="text-[9px] text-dark-500 uppercase tracking-widest">votes</div>
                  </div>
                </div>
              </div>
              <div className="border-t border-white/5 px-5 py-3 flex items-center justify-between">
                <button
                  onClick={() => handleViewProfile(nominee.name)}
                  className="flex items-center gap-1.5 text-xs text-dark-500 hover:text-white transition-colors"
                >
                  <Eye className="h-3.5 w-3.5" /> View Profile
                </button>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(nominee)}
                    className="text-dark-400 hover:text-white"
                  >
                    <Edit3 className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(nominee.id)}
                    className="text-rose-500/70 hover:text-rose-500 hover:bg-rose-500/10"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <User className="h-10 w-10 text-dark-600" />
          </div>
          <h3 className="text-xl font-serif text-white mb-2">No nominees found</h3>
          <p className="text-sm text-dark-500 max-w-sm mb-6">
            {search || filterStatus !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'Get started by adding your first nominee to this category.'}
          </p>
          <Button onClick={openAddModal} className="shadow-lg shadow-gold-500/20">
            <Plus className="h-4 w-4 mr-2" /> Add your first nominee
          </Button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <NomineeModal
            nominee={editingNominee}
            onSave={handleSave}
            onClose={() => {
              setShowModal(false);
              setEditingNominee(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md rounded-2xl bg-dark-800 border border-white/10 p-6 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="h-14 w-14 rounded-full bg-rose-500/10 flex items-center justify-center">
                  <AlertTriangle className="h-7 w-7 text-rose-500" />
                </div>
              </div>
              <h3 className="text-xl font-serif text-white text-center mb-2">Delete Nominee?</h3>
              <p className="text-sm text-dark-400 text-center mb-6">
                This action cannot be undone. The nominee will be permanently removed from this
                category and all associated data will be lost.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-white/10 hover:bg-white/5"
                  onClick={() => setDeleteId(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Add / Edit Modal ─────────────────────────────────────────── */

function NomineeModal({
  nominee,
  onSave,
  onClose,
}: {
  nominee: NomineeWithMeta | null;
  onSave: (data: {
    name: string;
    bio: string;
    imageUrl?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
    status: 'active' | 'pending' | 'inactive';
  }) => void;
  onClose: () => void;
}) {
  const [name, setName] = React.useState(nominee?.name || '');
  const [bio, setBio] = React.useState(nominee?.bio || '');
  const [imageUrl, setImageUrl] = React.useState<string | undefined>(nominee?.imageUrl);
  const [twitter, setTwitter] = React.useState(nominee?.twitter || '');
  const [instagram, setInstagram] = React.useState(nominee?.instagram || '');
  const [website, setWebsite] = React.useState(nominee?.website || '');
  const [status, setStatus] = React.useState<'active' | 'pending' | 'inactive'>(
    nominee?.status || 'active'
  );
  const [nameError, setNameError] = React.useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setNameError('Name is required');
      return;
    }
    onSave({
      name: name.trim(),
      bio,
      imageUrl,
      twitter: twitter || undefined,
      instagram: instagram || undefined,
      website: website || undefined,
      status,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-dark-800 border border-white/10 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <CardHeader className="border-b border-white/5 p-6 pb-4">
          <CardTitle className="text-xl">
            {nominee ? 'Edit Nominee' : 'Add Nominee'}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">
              Name *
            </label>
            <Input
              placeholder="e.g. Burna Boy"
              value={name}
              onChange={e => {
                setName(e.target.value);
                if (nameError) setNameError('');
              }}
              error={nameError}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">
              Bio
            </label>
            <textarea
              className="w-full min-h-[100px] bg-dark-900 border border-white/10 rounded-xl p-4 text-white text-xs outline-none focus:ring-1 focus:ring-gold-500/50 resize-none"
              placeholder="Briefly describe this nominee..."
              value={bio}
              onChange={e => setBio(e.target.value)}
            />
          </div>

          <ImageUpload
            label="Profile Photo"
            aspectRatio="square"
            value={imageUrl}
            onImageSelect={file => {
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setImageUrl(reader.result as string);
                reader.readAsDataURL(file);
              } else {
                setImageUrl(undefined);
              }
            }}
          />

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">
              Social Links
            </label>
            <div className="relative">
              <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
              <Input
                placeholder="@twitter_handle"
                className="pl-10"
                value={twitter}
                onChange={e => setTwitter(e.target.value)}
              />
            </div>
            <div className="relative">
              <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
              <Input
                placeholder="@instagram_handle"
                className="pl-10"
                value={instagram}
                onChange={e => setInstagram(e.target.value)}
              />
            </div>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
              <Input
                placeholder="https://website.com"
                className="pl-10"
                value={website}
                onChange={e => setWebsite(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">
              Status
            </label>
            <div className="flex gap-4">
              {(['active', 'pending', 'inactive'] as const).map(s => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={status === s}
                    onChange={() => setStatus(s)}
                    className="accent-gold-500"
                  />
                  <span className="text-sm text-dark-300 capitalize">{s}</span>
                </label>
              ))}
            </div>
          </div>
        </CardContent>

        <div className="border-t border-white/5 p-6 pt-4 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-white/10 hover:bg-white/5"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button className="flex-1 shadow-lg shadow-gold-500/20" onClick={handleSubmit}>
            {nominee ? 'Save Changes' : 'Add Nominee'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
