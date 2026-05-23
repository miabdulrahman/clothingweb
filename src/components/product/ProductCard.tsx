'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { buildWhatsAppProductUrl } from '@/lib/whatsapp';
import Badge from '@/components/ui/Badge';
import { ScaleOnHover } from '@/components/motion/Transitions';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Format price
  const formattedPrice = formatPrice(product.price, product.currency);

  // WhatsApp link for direct inquiry
  const whatsappUrl = buildWhatsAppProductUrl(product);

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
            className="flex-grow inline-flex items-center justify-center py-2.5 text-[10px] font-semibold uppercase tracking-widest border border-brand-charcoal text-brand-charcoal hover:bg-brand-charcoal hover:text-brand-cream transition-colors duration-300 rounded-none text-center"
          >
            Details
          </Link>
          
          {product.in_stock ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center p-2.5 bg-[#25D366] text-white hover:bg-[#20ba5a] transition-colors rounded-none"
              aria-label="Inquire on WhatsApp"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.497 1.45 5.416 1.451 5.458 0 9.897-4.437 9.902-9.899.002-2.646-1.02-5.133-2.88-6.996C17.228 1.856 14.743.834 12.09.833 6.63.833 2.19 5.27 2.185 10.733c-.001 1.927.501 3.811 1.457 5.418L2.73 22.179l6.082-1.593c1.558.85 3.325 1.298 5.12 1.299h.005zm10.72-7.516c-.292-.146-1.728-.853-1.996-.952-.266-.098-.46-.147-.654.146-.195.293-.755.952-.924 1.147-.17.195-.339.219-.63.073-.292-.147-1.233-.454-2.35-1.45-1.01-.898-1.532-1.109-1.824-1.255-.292-.147-.46-.073-.606.073-.146.147-.631.733-.797.92-.167.188-.334.219-.626.072-.29-.145-1.23-.453-2.345-1.448-.868-.774-1.455-1.73-1.625-2.022-.17-.293-.018-.452.129-.597.13-.13.292-.341.437-.512.146-.17.195-.293.293-.488.098-.195.048-.366-.024-.513-.073-.146-.654-1.579-.896-2.164-.236-.569-.475-.491-.654-.5l-.56-.008c-.193 0-.507.073-.773.366-.266.292-1.015.992-1.015 2.42 0 1.427 1.039 2.808 1.185 3.003.146.195 2.045 3.123 4.954 4.38.692.3 1.233.479 1.654.613.696.222 1.33.191 1.83.116.559-.083 1.729-.707 1.972-1.39.244-.683.244-1.268.17-1.39-.073-.122-.268-.195-.56-.341z" />
              </svg>
            </a>
          ) : (
            <button
              disabled
              className="inline-flex items-center justify-center p-2.5 bg-brand-charcoal/10 text-brand-charcoal/30 rounded-none cursor-not-allowed"
              aria-label="Sold Out"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
