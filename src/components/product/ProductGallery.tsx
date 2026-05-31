'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const galleryImages = images.length > 0 ? images : ['https://placehold.co/600x800/2D2D2D/FAF9F6?text=No+Image'];

  return (
    <div className="flex flex-col space-y-4">
      {/* Desktop view: Vertical stack of all images */}
      <div className="hidden md:flex flex-col space-y-6">
        {galleryImages.map((image, index) => (
          <div 
            key={index} 
            className="relative aspect-[3/4] w-full bg-brand-beige/10 dark:bg-dark-card border border-brand-charcoal/5 dark:border-dark-border overflow-hidden group cursor-zoom-in transition-theme"
          >
            <Image
              src={image}
              alt={`Product view ${index + 1}`}
              fill
              sizes="(max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              priority={index === 0}
              unoptimized={image.startsWith('http')}
            />
          </div>
        ))}
      </div>

      {/* Mobile view: Swipeable horizontal snap-to-slide carousel */}
      <div className="md:hidden flex flex-col space-y-3">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-beige/10 dark:bg-dark-card border border-brand-charcoal/5 dark:border-dark-border transition-theme">
          {/* Snap scroll container */}
          <div 
            className="flex overflow-x-auto snap-x snap-mandatory h-full scroll-smooth no-scrollbar"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
            onScroll={(e) => {
              const target = e.currentTarget;
              const index = Math.round(target.scrollLeft / target.clientWidth);
              if (index !== activeIndex) {
                setActiveIndex(index);
              }
            }}
          >
            {galleryImages.map((image, index) => (
              <div 
                key={index} 
                className="w-full h-full flex-shrink-0 snap-start snap-always relative"
              >
                <Image
                  src={image}
                  alt={`Product view ${index + 1}`}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority={index === 0}
                  unoptimized={image.startsWith('http')}
                />
              </div>
            ))}
          </div>

          {/* Mobile Page Counter Badge */}
          {galleryImages.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-brand-charcoal/70 dark:bg-dark-bg/80 text-brand-cream dark:text-dark-text px-2.5 py-1 text-[10px] uppercase font-semibold tracking-widest leading-none rounded-none z-10 backdrop-blur-sm">
              {activeIndex + 1} / {galleryImages.length}
            </div>
          )}
        </div>

        {/* Mobile progress dots */}
        {galleryImages.length > 1 && (
          <div className="flex justify-center items-center space-x-1.5 pt-1">
            {galleryImages.map((_, index) => (
              <span
                key={index}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-400 ease-out",
                  index === activeIndex
                    ? "bg-brand-charcoal dark:bg-dark-gold w-4"
                    : "bg-brand-charcoal/20 dark:bg-dark-border w-1.5"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
