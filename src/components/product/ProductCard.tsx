'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import { ScaleOnHover } from '@/components/motion/Transitions';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();

  // Format price
  const formattedPrice = formatPrice(product.price, product.currency);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Free Size';
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : 'Default';

    addToCart(product, defaultSize, defaultColor, 1);
  };

  // Determine active image
  const mainImage = product.images[0] || 'https://placehold.co/600x800/2D2D2D/FAF9F6?text=No+Image';
  const hoverImage = product.images[1] || mainImage;
  const currentImage = isHovered ? hoverImage : mainImage;

  return (
    <div
      className="group flex flex-col h-full bg-brand-cream border border-brand-charcoal/5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Wrapper */}
      <Link href={`/product/${product.slug}`} className="relative block overflow-hidden aspect-[3/4] bg-brand-beige/10">
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
          <div className="absolute inset-0 bg-brand-charcoal/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <Badge variant="primary" className="text-xs px-4 py-2 border border-brand-cream/30">
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

        {/* Image */}
        <Image
          src={currentImage}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out scale-100 group-hover:scale-105"
          priority={priority}
          unoptimized={mainImage.startsWith('http')} // Avoid local optimization limits for unsplash images
        />
      </Link>

      {/* Product Details */}
      <div className="p-4 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-1">
          {product.category?.name && (
            <p className="text-[10px] uppercase tracking-widest text-brand-charcoal/50 font-semibold">
              {product.category.name}
            </p>
          )}
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-display font-medium text-sm text-brand-charcoal hover:text-brand-gold transition-colors tracking-wide leading-snug">
              {product.title}
            </h3>
          </Link>
          <p className="text-sm font-semibold tracking-wider text-brand-charcoal/90">
            {formattedPrice}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-brand-charcoal/5">
          <Link
            href={`/product/${product.slug}`}
            className="w-1/2 inline-flex items-center justify-center py-2.5 text-[10px] font-semibold uppercase tracking-widest border border-brand-charcoal text-brand-charcoal hover:bg-brand-charcoal hover:text-brand-cream transition-colors duration-300 rounded-none text-center"
          >
            Details
          </Link>
          
          {product.in_stock ? (
            <button
              onClick={handleAddToCart}
              className="w-1/2 inline-flex items-center justify-center py-2.5 text-[10px] font-semibold uppercase tracking-widest bg-brand-charcoal text-brand-cream hover:bg-brand-gold hover:text-brand-charcoal transition-colors duration-300 rounded-none cursor-pointer text-center"
            >
              Add to Cart
            </button>
          ) : (
            <button
              disabled
              className="w-1/2 inline-flex items-center justify-center py-2.5 text-[10px] font-semibold uppercase tracking-widest bg-brand-charcoal/10 text-brand-charcoal/30 rounded-none cursor-not-allowed text-center"
            >
              Sold Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
