import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, Image as ImageIcon, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface ImageUploadProps {
  onImageSelect: (url: string | null) => void;
  value?: string;
  label?: string;
  aspectRatio?: 'video' | 'square' | 'portrait';
  className?: string;
}

async function uploadToConvexStorage(file: File): Promise<string | null> {
  const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;
  if (!CONVEX_URL) throw new Error('Convex URL not configured');

  console.log('Uploading image...', { filename: file.name, size: file.size });

  const response = await fetch(`${CONVEX_URL}/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': file.type || 'application/octet-stream',
    },
    body: file,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(err.error || `Upload failed: ${response.statusText}`);
  }

  const result = await response.json();
  console.log('Upload complete: storageId:', result.storageId);
  return result.storageId;
}

export function ImageUpload({
  onImageSelect,
  value,
  label = 'Upload Image',
  aspectRatio = 'video',
  className = ''
}: ImageUploadProps) {
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayUrl = localPreview || value || null;

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setError(null);
    setIsUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setLocalPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const storageId = await uploadToConvexStorage(file);
      if (!storageId) throw new Error('No storage ID returned');

      const resolvedUrl = await resolveStorageUrl(storageId);
      if (!resolvedUrl) throw new Error('Failed to resolve uploaded image URL');

      console.log('Resolved URL:', resolvedUrl);
      setLocalPreview(null);
      onImageSelect(resolvedUrl);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(err.message || 'Upload failed. Please try again.');
      setLocalPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const resolveStorageUrl = async (storageId: string): Promise<string | null> => {
    try {
      const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;
      if (!CONVEX_URL) return null;

      const response = await fetch(`${CONVEX_URL}/api/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: 'storage:getUrl',
          args: { storageId },
        }),
      });

      if (!response.ok) return null;
      const result = await response.json();
      return result.value ?? null;
    } catch {
      return null;
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalPreview(null);
    setError(null);
    onImageSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const ratioClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    portrait: 'aspect-[3/4]'
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">{label}</label>}
      
      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${ratioClasses[aspectRatio]} ${
          isDragging 
            ? 'border-gold-500 bg-gold-500/5' 
            : displayUrl 
              ? 'border-emerald-500/50 bg-dark-900' 
              : 'border-white/5 bg-dark-900 hover:border-gold-500/30'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="hidden"
          accept="image/*"
        />

        <AnimatePresence mode="wait">
          {displayUrl ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 w-full h-full"
            >
              <img src={displayUrl} className="w-full h-full object-cover" alt="Preview" referrerPolicy="no-referrer" />
              
              {isUploading && (
                <div className="absolute inset-0 bg-dark-950/60 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 text-gold-500 animate-spin" />
                    <span className="text-xs text-white font-bold uppercase tracking-widest">Uploading...</span>
                  </div>
                </div>
              )}

              {!isUploading && (
                <div className="absolute inset-0 bg-dark-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20">
                      <ImageIcon className="h-5 w-5 text-white" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleRemove}
                      className="h-10 w-10 rounded-full bg-rose-500/20 backdrop-blur-md hover:bg-rose-500/40"
                    >
                      <X className="h-5 w-5 text-rose-500" />
                    </Button>
                  </div>
                </div>
              )}

              {!isUploading && (
                <div className="absolute top-4 right-4 h-6 px-2 rounded-full bg-emerald-500 text-dark-950 text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
                  <CheckCircle2 className="h-3 w-3" /> Ready
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
            >
              <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-4 transition-colors ${
                isDragging ? 'bg-gold-500 text-dark-950' : 'bg-white/5 text-dark-500 group-hover:text-gold-500'
              }`}>
                {isUploading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Upload className="h-6 w-6" />
                )}
              </div>
              <h4 className="text-white font-medium text-sm">
                {isUploading ? 'Uploading...' : isDragging ? 'Drop Image Here' : 'Click to Upload'}
              </h4>
              <p className="text-[10px] text-dark-500 mt-2 uppercase tracking-widest">
                SVG, PNG, JPG or GIF (max. 5MB)
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="absolute bottom-4 inset-x-4 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center gap-2">
            <AlertCircle className="h-3 w-3 text-rose-500" />
            <span className="text-[8px] font-bold text-rose-500 uppercase tracking-widest">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
