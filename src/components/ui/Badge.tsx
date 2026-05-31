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
        variant === 'primary' && 'bg-brand-charcoal dark:bg-dark-gold text-brand-cream dark:text-dark-bg',
        variant === 'secondary' && 'bg-brand-beige dark:bg-dark-border text-brand-charcoal dark:text-dark-text',
        variant === 'outline' && 'border border-brand-charcoal/35 dark:border-dark-text/20 text-brand-charcoal/80 dark:text-dark-muted',
        variant === 'success' && 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 border border-emerald-500/25 dark:border-emerald-500/30',
        variant === 'warning' && 'bg-amber-500/10 dark:bg-amber-500/15 text-amber-800 dark:text-amber-400 border border-amber-500/25 dark:border-amber-500/30',
        className
      )}
    >
      {children}
    </span>
  );
}
