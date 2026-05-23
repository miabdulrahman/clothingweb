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
        'inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest leading-none rounded-none',
        variant === 'primary' && 'bg-brand-charcoal text-brand-cream',
        variant === 'secondary' && 'bg-brand-beige text-brand-charcoal',
        variant === 'outline' && 'border border-brand-charcoal/35 text-brand-charcoal/80',
        variant === 'success' && 'bg-emerald-500/10 text-emerald-800 border border-emerald-500/25',
        variant === 'warning' && 'bg-amber-500/10 text-amber-800 border border-amber-500/25',
        className
      )}
    >
      {children}
    </span>
  );
}
