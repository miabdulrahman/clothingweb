'use client';

import { SortOption } from '@/types';

interface SortDropdownProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-[10px] uppercase tracking-widest font-semibold text-brand-charcoal/50 dark:text-brand-cream/50">
        Sort By:
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="bg-transparent dark:bg-[#1E1E1E] border border-brand-charcoal/15 dark:border-white/15 text-xs text-brand-charcoal/80 dark:text-brand-cream/80 focus:outline-none focus:border-brand-charcoal dark:focus:border-brand-cream px-3 py-1.5 rounded-none font-medium tracking-wide uppercase transition-colors"
      >
        <option value="featured" className="dark:bg-[#1E1E1E] dark:text-brand-cream">Curated</option>
        <option value="newest" className="dark:bg-[#1E1E1E] dark:text-brand-cream">New Arrivals</option>
        <option value="price-asc" className="dark:bg-[#1E1E1E] dark:text-brand-cream">Price: Low - High</option>
        <option value="price-desc" className="dark:bg-[#1E1E1E] dark:text-brand-cream">Price: High - Low</option>
      </select>
    </div>
  );
}
