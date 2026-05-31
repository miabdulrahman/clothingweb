'use client';

import { Category, FilterState } from '@/types';
import { cn } from '@/lib/utils';

interface FilterPanelProps {
  categories: Category[];
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClear: () => void;
}

const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', '52', '54', '56', '58', 'S-M', 'L-XL'];
const AVAILABLE_COLORS = [
  'Off-White',
  'Charcoal Black',
  'Sand Beige',
  'Muted Olive',
  'Natural Oat',
  'Classic Ivory',
  'Sage Green',
  'Espresso Brown',
  'Onyx Black',
];

export default function FilterPanel({ categories, filters, onChange, onClear }: FilterPanelProps) {
  const toggleCategory = (categoryId: string) => {
    const isSelected = filters.categories.includes(categoryId);
    const newCategories = isSelected
      ? filters.categories.filter((id) => id !== categoryId)
      : [...filters.categories, categoryId];
    onChange({ ...filters, categories: newCategories });
  };

  const toggleSize = (size: string) => {
    const isSelected = filters.sizes.includes(size);
    const newSizes = isSelected
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onChange({ ...filters, sizes: newSizes });
  };

  const toggleColor = (color: string) => {
    const isSelected = filters.colors.includes(color);
    const newColors = isSelected
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    onChange({ ...filters, colors: newColors });
  };

  const handleStockToggle = () => {
    onChange({ ...filters, inStock: !filters.inStock });
  };

  const handlePriceChange = (min: number, max: number) => {
    onChange({ ...filters, priceRange: [min, max] });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.priceRange !== null ||
    filters.inStock;

  return (
    <div className="space-y-8 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-brand-charcoal/10">
        <h4 className="text-xs uppercase tracking-widest font-bold text-brand-charcoal">Filters</h4>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-[10px] uppercase tracking-widest font-semibold text-brand-gold hover:text-brand-charcoal transition-colors cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h5 className="text-[11px] uppercase tracking-widest font-bold text-brand-charcoal/80">Category</h5>
        <div className="space-y-2">
          {categories.map((category) => {
            const isChecked = filters.categories.includes(category.id);
            return (
              <label key={category.id} className="flex items-center space-x-3 text-xs text-brand-charcoal/80 hover:text-brand-charcoal cursor-pointer font-light">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleCategory(category.id)}
                  className="w-3.5 h-3.5 border border-brand-charcoal/20 rounded-none bg-transparent accent-brand-charcoal checked:bg-brand-charcoal focus:ring-0 focus:ring-offset-0 focus:outline-none"
                />
                <span className={cn('transition-colors', isChecked && 'font-medium text-brand-charcoal')}>{category.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-3">
        <h5 className="text-[11px] uppercase tracking-widest font-bold text-brand-charcoal/80">Size</h5>
        <div className="flex flex-wrap gap-1.5">
          {AVAILABLE_SIZES.map((size) => {
            const isSelected = filters.sizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={cn(
                  'px-3 py-1.5 text-[10px] font-medium border transition-colors cursor-pointer rounded-none uppercase',
                  isSelected
                    ? 'border-brand-charcoal bg-brand-charcoal text-brand-cream font-semibold'
                    : 'border-brand-charcoal/10 hover:border-brand-charcoal/50 text-brand-charcoal/85'
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-3">
        <h5 className="text-[11px] uppercase tracking-widest font-bold text-brand-charcoal/80">Color</h5>
        <div className="flex flex-wrap gap-1.5">
          {AVAILABLE_COLORS.map((color) => {
            const isSelected = filters.colors.includes(color);
            return (
              <button
                key={color}
                onClick={() => toggleColor(color)}
                className={cn(
                  'px-2.5 py-1.5 text-[9px] uppercase tracking-wider border transition-colors cursor-pointer rounded-none font-medium',
                  isSelected
                    ? 'border-brand-charcoal bg-brand-charcoal text-brand-cream'
                    : 'border-brand-charcoal/10 hover:border-brand-charcoal/50 text-brand-charcoal/85'
                )}
              >
                {color}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h5 className="text-[11px] uppercase tracking-widest font-bold text-brand-charcoal/80">Price Range</h5>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePriceChange(0, 5000)}
            className={cn(
              'flex-1 py-1.5 text-[9px] uppercase border text-center transition-colors cursor-pointer rounded-none',
              filters.priceRange?.[1] === 5000
                ? 'border-brand-charcoal bg-brand-charcoal text-brand-cream'
                : 'border-brand-charcoal/10 hover:border-brand-charcoal/40'
            )}
          >
            Under 5,000
          </button>
          <button
            onClick={() => handlePriceChange(5000, 10000)}
            className={cn(
              'flex-1 py-1.5 text-[9px] uppercase border text-center transition-colors cursor-pointer rounded-none',
              filters.priceRange?.[0] === 5000 && filters.priceRange?.[1] === 10000
                ? 'border-brand-charcoal bg-brand-charcoal text-brand-cream'
                : 'border-brand-charcoal/10 hover:border-brand-charcoal/40'
            )}
          >
            5,000 - 10,000
          </button>
        </div>
        <button
          onClick={() => handlePriceChange(10000, 20000)}
          className={cn(
            'w-full py-1.5 text-[9px] uppercase border text-center transition-colors cursor-pointer rounded-none block',
            filters.priceRange?.[0] === 10000
              ? 'border-brand-charcoal bg-brand-charcoal text-brand-cream'
              : 'border-brand-charcoal/10 hover:border-brand-charcoal/40'
          )}
        >
          Above 10,000
        </button>
      </div>

      {/* Availability */}
      <div className="pt-2">
        <label className="flex items-center space-x-3 text-xs text-brand-charcoal/80 hover:text-brand-charcoal cursor-pointer font-light">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={handleStockToggle}
            className="w-3.5 h-3.5 border border-brand-charcoal/20 rounded-none bg-transparent accent-brand-charcoal checked:bg-brand-charcoal focus:ring-0 focus:ring-offset-0 focus:outline-none"
          />
          <span className={cn('transition-colors', filters.inStock && 'font-medium text-brand-charcoal')}>In Stock Only</span>
        </label>
      </div>
    </div>
  );
}
