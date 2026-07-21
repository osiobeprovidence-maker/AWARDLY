import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Image as ImageIcon, Video, FolderPlus, Upload, Search, MoreVertical, LayoutGrid, List } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { ImageUpload } from '../../components/ImageUpload';
import { X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { useToast } from '../../lib/toast';

export function DashboardMedia() {
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('All Types');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const { toast } = useToast();

  const allItems = [
    { type: 'video', label: 'Promo_Teaser.mp4', size: '24 MB', thumb: 'https://images.unsplash.com/photo-1493225457224-eda0e6fdca05?q=80' },
    { type: 'image', label: 'Main_Banner.png', size: '4.2 MB', thumb: 'https://images.unsplash.com/photo-1470229722913-7c092b09ff44?q=80' },
    { type: 'image', label: 'Sponsor_Logo.svg', size: '450 KB', thumb: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80' },
    { type: 'video', label: 'Event_Wrap_2025.mp4', size: '1.2 GB', thumb: 'https://images.unsplash.com/photo-1540039155732-684735035727?q=80' },
    { type: 'image', label: 'Official_Graphic.jpg', size: '8.1 MB', thumb: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80' },
    { type: 'image', label: 'Artist_Showcase.png', size: '12 MB', thumb: 'https://images.unsplash.com/photo-1520052205864-92d242b3a76b?q=80' },
  ];

  const filteredItems = allItems.filter(item => {
    const matchSearch = item.label.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All Types' || (typeFilter === 'Photos' && item.type === 'image') || (typeFilter === 'Videos' && item.type === 'video');
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-8">
      <div>
        <Breadcrumbs />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Media Center</h1>
          <p className="text-dark-400">Upload and manage promotional content and event highlights.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => toast('New folder created', 'success')}><FolderPlus className="h-4 w-4 mr-2" /> New Folder</Button>
          <Button onClick={() => setShowUploadModal(true)}><Upload className="h-4 w-4 mr-2" /> Upload Assets</Button>
        </div>
        </div>
      </div>

      <AnimatePresence>
        {showUploadModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUploadModal(false)}
              className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-dark-900 border border-white/10 rounded-3xl shadow-2xl z-[60] overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-xl font-serif text-white italic">Upload New Assets</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowUploadModal(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-8 space-y-6">
                <ImageUpload 
                  label="Select Media File"
                  onImageSelect={(file) => console.log('Media uploaded:', file)}
                />
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Asset Label</label>
                  <Input placeholder="e.g. Winner_Backdrop_2026" />
                </div>
              </div>
              <div className="p-6 border-t border-white/5 bg-dark-950/50 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setShowUploadModal(false)}>Cancel</Button>
                <Button className="px-8" onClick={() => { setShowUploadModal(false); toast('Asset added to library', 'success'); }}>
                  <Save className="h-4 w-4 mr-2" /> Add to Library
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
         <div className="flex gap-2 p-1 bg-dark-900/50 rounded-lg border border-white/5">
            <Button variant="ghost" size="icon" className={`h-8 w-8 ${viewMode === 'grid' ? 'bg-gold-500/10 text-gold-400' : 'text-dark-400'}`} onClick={() => setViewMode('grid')}><LayoutGrid className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className={`h-8 w-8 ${viewMode === 'list' ? 'bg-gold-500/10 text-gold-400' : 'text-dark-400'}`} onClick={() => setViewMode('list')}><List className="h-4 w-4" /></Button>
         </div>
         <div className="flex-1 max-w-md w-full">
            <Input icon={Search} placeholder="Search media assets..." value={search} onChange={e => setSearch(e.target.value)} />
         </div>
         <div className="flex items-center gap-2">
            <select className="bg-dark-900 border border-white/10 rounded-lg px-4 h-11 text-white text-xs outline-none" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
               <option>All Types</option>
               <option>Photos</option>
               <option>Videos</option>
               <option>Flyers</option>
            </select>
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredItems.map((item, i) => (
          <Card key={i} className="p-0 overflow-hidden group hover:border-gold-500/30 transition-all">
             <div className="aspect-square relative flex items-center justify-center bg-dark-800">
                <img 
                  src={item.thumb} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" 
                  alt="thumb" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   {item.type === 'video' ? <Video className="h-10 w-10 text-white" /> : <ImageIcon className="h-10 w-10 text-white" />}
                </div>
                <div className="absolute top-2 right-2">
                   <Button variant="glass" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); toast(`Options for ${item.label}`, 'info'); }}><MoreVertical className="h-4 w-4" /></Button>
                </div>
             </div>
             <div className="p-3">
                <h4 className="text-white text-xs font-medium truncate mb-1">{item.label}</h4>
                <div className="flex justify-between text-[10px] text-dark-500 uppercase tracking-widest">
                   <span>{item.type}</span>
                   <span>{item.size}</span>
                </div>
             </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
