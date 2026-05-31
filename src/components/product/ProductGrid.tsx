'use client';

import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import { StaggerContainer, StaggerChild } from '@/components/motion/Transitions';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-brand-charcoal/5 dark:bg-dark-card flex items-center justify-center">
          <svg className="w-8 h-8 text-brand-charcoal/30 dark:text-dark-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p className="text-xs uppercase tracking-widest font-semibold text-brand-charcoal/50 dark:text-dark-muted">
          No products found
        </p>
      </div>
    );
  }

  return (
    <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <StaggerChild key={product.id}>
          <ProductCard product={product} />
        </StaggerChild>
      ))}
    </StaggerContainer>
  );
}
