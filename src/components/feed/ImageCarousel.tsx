import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  className?: string;
}

export function ImageCarousel({ images, className = '' }: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!images || images.length === 0) return null;

  const goTo = (dir: 'prev' | 'next') => {
    if (dir === 'prev') setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
    else setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  if (images.length === 1) {
    return (
      <>
        <div className={`relative overflow-hidden rounded-xl ${className}`}>
          <img
            src={images[0]}
            alt="Post media"
            className="w-full h-auto max-h-96 object-cover cursor-pointer"
            onClick={() => setIsFullscreen(true)}
          />
        </div>
        <AnimatePresence>
          {isFullscreen && (
            <FullscreenModal images={images} initialIndex={0} onClose={() => setIsFullscreen(false)} />
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      <div className={`relative overflow-hidden rounded-xl group ${className}`}>
        <div className="relative h-72 sm:h-80">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              src={images[activeIndex]}
              alt={`Post image ${activeIndex + 1}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 w-full h-full object-cover cursor-pointer"
              onClick={() => setIsFullscreen(true)}
            />
          </AnimatePresence>
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={() => goTo('prev')}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-dark-900/80 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-dark-900"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => goTo('next')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-dark-900/80 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-dark-900"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeIndex ? 'w-5 bg-gold-500' : 'w-1.5 bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>

            <div className="absolute top-3 right-3 px-2 py-0.5 bg-dark-900/80 backdrop-blur-sm rounded-full text-[10px] text-white/80 font-medium">
              {activeIndex + 1}/{images.length}
            </div>

            <button
              onClick={() => setIsFullscreen(true)}
              className="absolute top-3 left-3 p-1.5 bg-dark-900/80 backdrop-blur-sm rounded-full text-white/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-dark-900"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>

      <AnimatePresence>
        {isFullscreen && (
          <FullscreenModal images={images} initialIndex={activeIndex} onClose={() => setIsFullscreen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

function FullscreenModal({ images, initialIndex, onClose }: { images: string[]; initialIndex: number; onClose: () => void }) {
  const [index, setIndex] = useState(initialIndex);

  const goTo = (dir: 'prev' | 'next') => {
    if (dir === 'prev') setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
    else setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors z-10"
      >
        <X className="h-5 w-5" />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); goTo('prev'); }}
            className="absolute left-4 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors z-10"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goTo('next'); }}
            className="absolute right-4 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors z-10"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <motion.img
        key={index}
        src={images[index]}
        alt="Full size"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />

      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setIndex(i); }}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-6 bg-gold-500' : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
