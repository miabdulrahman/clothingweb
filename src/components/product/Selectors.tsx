'use client';

import { cn } from '@/lib/utils';

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onChange: (size: string) => void;
  onOpenSizeGuide?: () => void;
}

export function SizeSelector({ sizes, selectedSize, onChange, onOpenSizeGuide }: SizeSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-widest text-brand-charcoal/80">
        <span>Select Size</span>
        {onOpenSizeGuide && (
          <button
            onClick={onOpenSizeGuide}
            className="text-[10px] text-brand-gold underline hover:text-brand-charcoal transition-colors cursor-pointer"
          >
            Size Guide
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isSelected = size === selectedSize;
          return (
            <button
              key={size}
              onClick={() => onChange(size)}
              className={cn(
                'min-w-12 h-12 flex items-center justify-center border text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer rounded-none',
                isSelected
                  ? 'border-brand-charcoal bg-brand-charcoal text-brand-cream'
                  : 'border-brand-charcoal/10 hover:border-brand-charcoal/50 text-brand-charcoal'
              )}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface ColorSelectorProps {
  colors: string[];
  selectedColor: string;
  onChange: (color: string) => void;
}

export function ColorSelector({ colors, selectedColor, onChange }: ColorSelectorProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-widest text-brand-charcoal/80">
        Select Color: <span className="font-light tracking-normal lowercase">{selectedColor}</span>
      </h4>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => {
          const isSelected = color === selectedColor;
          return (
            <button
              key={color}
              onClick={() => onChange(color)}
              className={cn(
                'px-4 py-2 border text-[10px] font-semibold uppercase tracking-widest transition-all duration-200 cursor-pointer rounded-none',
                isSelected
                  ? 'border-brand-charcoal bg-brand-charcoal text-brand-cream'
                  : 'border-brand-charcoal/10 hover:border-brand-charcoal/50 text-brand-charcoal'
              )}
            >
              {color}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface QuantitySelectorProps {
  value: number;
  onChange: (val: number) => void;
  max?: number;
}

export function QuantitySelector({ value, onChange, max = 10 }: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (value > 1) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-widest text-brand-charcoal/80">
        Quantity
      </h4>
      <div className="inline-flex items-center border border-brand-charcoal/15 bg-brand-cream">
        <button
          onClick={handleDecrement}
          className="w-10 h-10 flex items-center justify-center text-brand-charcoal/70 hover:text-brand-charcoal hover:bg-brand-charcoal/5 transition-colors cursor-pointer"
          disabled={value <= 1}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <span className="w-12 text-center text-xs font-semibold tracking-wider text-brand-charcoal select-none">
          {value}
        </span>
        <button
          onClick={handleIncrement}
          className="w-10 h-10 flex items-center justify-center text-brand-charcoal/70 hover:text-brand-charcoal hover:bg-brand-charcoal/5 transition-colors cursor-pointer"
          disabled={value >= max}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
