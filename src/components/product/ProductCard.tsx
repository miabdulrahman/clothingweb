'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  // Format price
  const formattedPrice = formatPrice(product.price, product.currency);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Free Size';
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : 'Default';

    addToCart(product, defaultSize, defaultColor, 1);
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 1200);
  };

  // Determine active image
  const mainImage = product.images[0] || 'https://placehold.co/600x800/2D2D2D/FAF9F6?text=No+Image';
  const hoverImage = product.images[1] || mainImage;

  return (
    <motion.div
      className="group flex flex-col h-full bg-brand-cream dark:bg-dark-card border border-brand-charcoal/5 dark:border-dark-border transition-theme card-hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Wrapper */}
      <Link href={`/product/${product.slug}`} className="relative block overflow-hidden aspect-[3/4] bg-brand-beige/10 dark:bg-dark-bg/50">
        {/* Style Label Badge */}
        {product.style_label && (
          <div className="absolute top-3 left-3 z-10">
            <Badge variant="secondary" className="shadow-sm">
              {product.style_label}
            </Badge>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-brand-charcoal/40 dark:bg-dark-bg/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <Badge variant="primary" className="text-xs px-4 py-2 border border-brand-cream/30 dark:border-dark-border">
              Sold Out
            </Badge>
          </div>
        )}

        {/* Featured Badge */}
        {product.featured && product.in_stock && (
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="primary" className="shadow-sm">
              Curated
            </Badge>
          </div>
        )}

        {/* Image with crossfade */}
        <div className="relative w-full h-full">
          <Image
            src={mainImage}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
            style={{ opacity: isHovered && hoverImage !== mainImage ? 0 : 1 }}
            priority={priority}
            unoptimized={mainImage.startsWith('http')}
          />
          {hoverImage !== mainImage && (
            <Image
              src={hoverImage}
              alt={`${product.title} alternate view`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
              style={{ opacity: isHovered ? 1 : 0 }}
              unoptimized={hoverImage.startsWith('http')}
            />
          )}
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-4 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-1">
          {product.category?.name && (
            <p className="text-[10px] uppercase tracking-widest text-brand-charcoal/50 dark:text-dark-muted font-semibold">
              {product.category.name}
            </p>
          )}
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-display font-medium text-sm text-brand-charcoal dark:text-dark-text hover:text-brand-gold dark:hover:text-dark-gold transition-colors duration-300 tracking-wide leading-snug">
              {product.title}
            </h3>
          </Link>
          <p className="text-sm font-semibold tracking-wider text-brand-charcoal/90 dark:text-dark-text/90">
            {formattedPrice}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-brand-charcoal/5 dark:border-dark-border">
          <Link
            href={`/product/${product.slug}`}
            className="w-1/2 inline-flex items-center justify-center py-2.5 text-[10px] font-semibold uppercase tracking-widest border border-brand-charcoal dark:border-dark-text/30 text-brand-charcoal dark:text-dark-text hover:bg-brand-charcoal hover:text-brand-cream dark:hover:bg-dark-text dark:hover:text-dark-bg transition-all duration-300 rounded-none text-center"
          >
            Details
          </Link>
          
          {product.in_stock ? (
            <button
              onClick={handleAddToCart}
              className="w-1/2 inline-flex items-center justify-center py-2.5 text-[10px] font-semibold uppercase tracking-widest bg-brand-charcoal dark:bg-dark-gold text-brand-cream dark:text-dark-bg hover:bg-brand-gold dark:hover:bg-dark-gold/80 hover:text-brand-charcoal transition-all duration-300 rounded-none cursor-pointer text-center"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={isAdding ? 'added' : 'add'}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {isAdding ? '✓ Added' : 'Add to Cart'}
                </motion.span>
              </AnimatePresence>
            </button>
          ) : (
            <button
              disabled
              className="w-1/2 inline-flex items-center justify-center py-2.5 text-[10px] font-semibold uppercase tracking-widest bg-brand-charcoal/10 dark:bg-dark-border text-brand-charcoal/30 dark:text-dark-muted/40 rounded-none cursor-not-allowed text-center"
            >
              Sold Out
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
