import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
  value?: string;
  label?: string;
  aspectRatio?: 'video' | 'square' | 'portrait';
  className?: string;
}

export function ImageUpload({
  onImageSelect,
  value,
  label = 'Upload Image',
  aspectRatio = 'video',
  className = ''
}: ImageUploadProps) {
  const [preview, setPreview] = React.useState<string | null>(value || null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onImageSelect(file);
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
    setPreview(null);
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
        onClick={() => fileInputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${ratioClasses[aspectRatio]} ${
          isDragging 
            ? 'border-gold-500 bg-gold-500/5' 
            : preview 
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
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 w-full h-full"
            >
              <img src={preview} className="w-full h-full object-cover" alt="Preview" referrerPolicy="no-referrer" />
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
              <div className="absolute top-4 right-4 h-6 px-2 rounded-full bg-emerald-500 text-dark-950 text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
                <CheckCircle2 className="h-3 w-3" /> Ready
              </div>
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
                <Upload className="h-6 w-6" />
              </div>
              <h4 className="text-white font-medium text-sm">
                {isDragging ? 'Drop Image Here' : 'Click to Upload'}
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

import { Button } from './ui/Button';
