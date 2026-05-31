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
        'inline-flex items-center justify-center font-medium uppercase tracking-widest transition-all duration-300 rounded-none cursor-pointer focus:outline-none focus-glow disabled:opacity-50 disabled:cursor-not-allowed',
        
        // Variants
        variant === 'primary' && 'bg-brand-charcoal dark:bg-dark-gold text-brand-cream dark:text-dark-bg border border-brand-charcoal dark:border-dark-gold hover:bg-brand-charcoal/90 dark:hover:bg-dark-gold/85',
        variant === 'secondary' && 'bg-transparent text-brand-charcoal dark:text-dark-text border border-brand-charcoal dark:border-dark-text/30 hover:bg-brand-charcoal hover:text-brand-cream dark:hover:bg-dark-text dark:hover:text-dark-bg',
        variant === 'ghost' && 'bg-transparent text-brand-charcoal dark:text-dark-text hover:bg-brand-charcoal/5 dark:hover:bg-dark-border border border-transparent',
        variant === 'whatsapp' && 'bg-[#25D366] text-white border border-[#25D366] hover:bg-[#20ba5a] hover:border-[#20ba5a] hover:shadow-[0_0_20px_rgba(37,211,102,0.2)]',
        
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
