import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'warning';
  className?: string;
}

export default function Badge({ children, variant = 'primary', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest leading-none rounded-none transition-colors duration-300',
        variant === 'primary' && 'bg-brand-charcoal dark:bg-brand-cream text-brand-cream dark:text-brand-charcoal',
        variant === 'secondary' && 'bg-brand-beige dark:bg-brand-gold text-brand-charcoal dark:text-[#121212]',
        variant === 'outline' && 'border border-brand-charcoal/35 dark:border-white/35 text-brand-charcoal/80 dark:text-brand-cream/80',
        variant === 'success' && 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25 dark:border-emerald-500/30',
        variant === 'warning' && 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/25 dark:border-amber-500/30',
        className
      )}
    >
      {children}
    </span>
  );
}
