'use client';

import { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Category, Product, FilterState, SortOption } from '@/types';
import FilterPanel from '@/components/catalog/FilterPanel';
import SortDropdown from '@/components/catalog/SortDropdown';
import ProductGrid from '@/components/product/ProductGrid';
import Button from '@/components/ui/Button';

interface CatalogContentProps {
  products: Product[];
  categories: Category[];
  initialFilters: FilterState;
  initialSort: SortOption;
}

export default function CatalogContent({
  products,
  categories,
  initialFilters,
  initialSort,
}: CatalogContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sync state with parent/URL props
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sort, setSort] = useState<SortOption>(initialSort);

  // Apply filters by pushing new query string
  const applyFilters = (newFilters: FilterState, newSort: SortOption) => {
    setFilters(newFilters);
    setSort(newSort);

    startTransition(() => {
      const params = new URLSearchParams();

      // Categories
      newFilters.categories.forEach((catId) => {
        const catSlug = categories.find((c) => c.id === catId)?.slug;
        if (catSlug) params.append('category', catSlug);
      });

      // Sizes
      newFilters.sizes.forEach((size) => params.append('size', size));

      // Colors
      newFilters.colors.forEach((color) => params.append('color', color));

      // Price Range
      if (newFilters.priceRange) {
        params.set('minPrice', newFilters.priceRange[0].toString());
        params.set('maxPrice', newFilters.priceRange[1].toString());
      }

      // Stock
      if (newFilters.inStock) {
        params.set('inStock', 'true');
      }

      // Sort
      if (newSort !== 'featured') {
        params.set('sort', newSort);
      }

      const queryString = params.toString();
      router.push(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false });
    });
  };

  const handleFilterChange = (updatedFilters: FilterState) => {
    applyFilters(updatedFilters, sort);
  };

  const handleSortChange = (updatedSort: SortOption) => {
    applyFilters(filters, updatedSort);
  };

  const handleClearAll = () => {
    const emptyFilters: FilterState = {
      categories: [],
      sizes: [],
      colors: [],
      priceRange: null,
      inStock: false,
    };
    applyFilters(emptyFilters, 'featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner / Header */}
      <div className="space-y-2">
        <h1 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-wider text-brand-charcoal">
          The Catalog
        </h1>
        <p className="text-sm text-brand-charcoal/50 font-light max-w-lg">
          Browse our entire selection of loose-fit tops, premium washed linen trousers, layered dusters, and minimalist kurtas.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between border-y border-brand-charcoal/10 py-4">
        {/* Mobile Filters Toggle */}
        <div className="md:hidden">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsMobileFiltersOpen(true)}
            className="flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 8.293A1 1 0 013 7.586V4z" />
            </svg>
            <span>Filters</span>
            {filters.categories.length + filters.sizes.length + filters.colors.length > 0 && (
              <span className="w-5 h-5 bg-brand-charcoal text-brand-cream rounded-full flex items-center justify-center text-[10px]">
                {filters.categories.length + filters.sizes.length + filters.colors.length}
              </span>
            )}
          </Button>
        </div>

        {/* Product Count (Desktop) */}
        <div className="hidden md:block text-xs uppercase tracking-widest font-semibold text-brand-charcoal/55">
          Showing {products.length} Products
        </div>

        {/* Sort */}
        <SortDropdown value={sort} onChange={handleSortChange} />
      </div>

      {/* Main Grid + Sidebar */}
      <div className="flex gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block w-64 flex-shrink-0 sticky top-32">
          <FilterPanel
            categories={categories}
            filters={filters}
            onChange={handleFilterChange}
            onClear={handleClearAll}
          />
        </aside>

        {/* Product Grid Area */}
        <div className="flex-grow">
          {isPending ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 opacity-60 transition-opacity">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-brand-charcoal/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </div>

      {/* Mobile Drawer Filters */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileFiltersOpen(false)}
            className="fixed inset-0 bg-brand-charcoal/45 backdrop-blur-sm"
          />
          {/* Drawer content */}
          <div className="relative w-4/5 max-w-sm bg-brand-cream h-full p-6 shadow-xl overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-brand-charcoal/10 pb-4">
                <h3 className="font-display text-lg font-bold uppercase tracking-wider text-brand-charcoal">
                  Filter & Sort
                </h3>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="text-brand-charcoal/50 p-1"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <FilterPanel
                categories={categories}
                filters={filters}
                onChange={handleFilterChange}
                onClear={handleClearAll}
              />
            </div>

            <div className="pt-6 border-t border-brand-charcoal/10 mt-6">
              <Button
                variant="primary"
                fullWidth
                onClick={() => setIsMobileFiltersOpen(false)}
                className="py-3"
              >
                Apply Filters ({products.length})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
