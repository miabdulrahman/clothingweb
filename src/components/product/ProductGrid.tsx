import { Product } from '@/types';
import ProductCard from './ProductCard';
import { StaggerContainer, StaggerChild } from '@/components/motion/Transitions';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-brand-charcoal/15 bg-brand-cream p-8">
        <svg
          className="mx-auto h-12 w-12 text-brand-charcoal/30 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
        <h3 className="font-display font-medium text-brand-charcoal text-base uppercase tracking-wider mb-1">
          No Products Found
        </h3>
        <p className="text-sm text-brand-charcoal/50 font-light">
          Try expanding your filters or search keywords.
        </p>
      </div>
    );
  }

  return (
    <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
      {products.map((product) => (
        <StaggerChild key={product.id}>
          <ProductCard product={product} />
        </StaggerChild>
      ))}
    </StaggerContainer>
  );
}
