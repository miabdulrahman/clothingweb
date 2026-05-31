'use client';

import { SortOption } from '@/types';

interface SortDropdownProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-[10px] uppercase tracking-widest font-semibold text-brand-charcoal/50">
        Sort By:
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="bg-transparent border border-brand-charcoal/15 text-xs text-brand-charcoal/80 focus:outline-none focus:border-brand-charcoal px-3 py-1.5 rounded-none font-medium tracking-wide uppercase transition-colors"
      >
        <option value="featured">Curated</option>
        <option value="newest">New Arrivals</option>
        <option value="price-asc">Price: Low - High</option>
        <option value="price-desc">Price: High - Low</option>
      </select>
    </div>
  );
}
