import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'whatsapp';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export default function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium uppercase tracking-widest transition-all duration-300 rounded-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-gold/50 disabled:opacity-50 disabled:cursor-not-allowed',
        
        // Variants
        variant === 'primary' && 'bg-brand-charcoal text-brand-cream border border-brand-charcoal hover:bg-brand-charcoal/90',
        variant === 'secondary' && 'bg-transparent text-brand-charcoal border border-brand-charcoal hover:bg-brand-charcoal hover:text-brand-cream',
        variant === 'ghost' && 'bg-transparent text-brand-charcoal hover:bg-brand-charcoal/5 border border-transparent',
        variant === 'whatsapp' && 'bg-[#25D366] text-white border border-[#25D366] hover:bg-[#20ba5a] hover:border-[#20ba5a]',
        
        // Sizes
        size === 'sm' && 'px-4 py-2 text-[10px] leading-tight',
        size === 'md' && 'px-6 py-3 text-xs',
        size === 'lg' && 'px-8 py-4 text-xs font-semibold tracking-wider',
        
        // Layout
        fullWidth ? 'w-full flex' : '',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
