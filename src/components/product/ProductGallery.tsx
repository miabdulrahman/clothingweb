'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const galleryImages = images.length > 0 ? images : ['https://placehold.co/600x800/2D2D2D/FAF9F6?text=No+Image'];

  return (
    <div className="flex flex-col space-y-4">
      {/* Main Image View */}
      <div className="relative overflow-hidden aspect-[3/4] bg-brand-beige/10 border border-brand-charcoal/5 group">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={galleryImages[activeIndex]}
              alt={`Product view ${activeIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
              unoptimized={galleryImages[activeIndex].startsWith('http')}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows (Only if multiple images) */}
        {galleryImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-brand-cream/80 hover:bg-brand-cream border border-brand-charcoal/10 hover:border-brand-charcoal text-brand-charcoal shadow-sm transition-all opacity-0 group-hover:opacity-100 rounded-none cursor-pointer"
              aria-label="Previous image"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-brand-cream/80 hover:bg-brand-cream border border-brand-charcoal/10 hover:border-brand-charcoal text-brand-charcoal shadow-sm transition-all opacity-0 group-hover:opacity-100 rounded-none cursor-pointer"
              aria-label="Next image"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Mobile Page indicator */}
        <div className="absolute bottom-4 right-4 bg-brand-charcoal/70 text-brand-cream px-2.5 py-1 text-[10px] uppercase font-semibold tracking-widest leading-none rounded-none md:hidden z-10">
          {activeIndex + 1} / {galleryImages.length}
        </div>
      </div>

      {/* Thumbnails list */}
      {galleryImages.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto no-scrollbar">
          {galleryImages.map((image, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > activeIndex ? 1 : -1);
                  setActiveIndex(index);
                }}
                className={cn(
                  'relative w-20 aspect-[3/4] flex-shrink-0 bg-brand-beige/5 border cursor-pointer transition-all duration-200 rounded-none overflow-hidden',
                  isActive
                    ? 'border-brand-charcoal ring-1 ring-brand-charcoal/10 scale-[0.98]'
                    : 'border-brand-charcoal/10 hover:border-brand-charcoal/40'
                )}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                  unoptimized={image.startsWith('http')}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
